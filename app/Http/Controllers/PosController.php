<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Client;
use Illuminate\Support\Str;
use App\Models\PosAuthToken;
use Illuminate\Http\Request;
use App\Models\ProductWarehouse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ProductPriceModification;

class PosController extends BaseController
{
    private $orderDiscount = null;
    private $productId = null;
    private $originalProductPrice = null;
    private $newProductPrice = null;
    private $subTotalProductPrice = null;
    private $productDiscount = null;
    private $productQuantity = null;
    private $clientName = null;
    private $clientFinalConsumerOrNot = null;
    private $clientBigConsumerOrNot = null;
    private $taxMethod = null;

    //------------ Create New  POS --------------\\

    public function CreatePOS(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        $message = 0;

        $productsDiscounts = $request->productsDiscounts;

        request()->validate([
            'client_id' => 'required',
            'warehouse_id' => 'required',
            'payment.amount' => 'required',
        ]);

        $item = DB::transaction(function () use ($message, $request, $productsDiscounts) {
            $role = DB::table('role_user')
                ->join('roles', 'role_user.role_id', '=', 'roles.id')
                ->where('role_user.user_id', Auth::id())
                ->first();
            $view_records = DB::table('roles')
                ->join('permission_role', 'roles.id', '=', 'permission_role.role_id')
                ->join('permissions', 'permission_role.permission_id', '=', 'permissions.id')
                ->where('roles.id', $role->id)
                ->where('permissions.name', 'record_view')
                ->count() > 0;

            $order = new Sale();

            $client = Client::findOrFail($request->client_id);

            $this->clientName = $client->name;
            $this->clientFinalConsumerOrNot = $client->final_consumer;
            $this->clientBigConsumerOrNot = $client->big_consumer;
            $taxRate = 0;
            $TaxNet = 0;
            $TaxWithheld = 0;
            $TaxNetDetail = 0;
            // $TaxMethod = 2;
            $totalWithDiscount = $request->GrandTotal - $request->shipping;

            $GrandTotal = $request->GrandTotal;

            if ($this->clientFinalConsumerOrNot === 0) {
                $taxRate = 13;
                $TaxNet = round($totalWithDiscount - ($totalWithDiscount / 1.13), 2);

                if ($this->clientBigConsumerOrNot == 1 and round($totalWithDiscount / 1.13, 2) >= 100) {
                    $TaxWithheld = round((($totalWithDiscount / 1.13) * 0.01), 2);
                    $GrandTotal = $totalWithDiscount - $TaxWithheld;
                }
            }

            $order->is_pos = 1;
            $order->date = Carbon::now();
            $order->client_id = $request->client_id;
            $order->warehouse_id = $request->warehouse_id;
            $order->tax_rate = $taxRate;
            $order->TaxNet = $TaxNet;
            $order->TaxWithheld = $TaxWithheld;
            $order->discount = $request->discount;
            $order->shipping = $request->shipping;

            if ($order->discount == ".00" || $order->discount == "")
                $order->discount = 0.0;

            if ($order->shipping == ".00" || $order->shipping == "")
                $order->shipping = 0.0;

            $this->orderDiscount = $order->discount;
            $order->subTotal = $request->GrandTotal;
            $order->GrandTotal = $GrandTotal;
            $order->cash = 0;
            $order->change = 0;
            $order->payment_statut = 'unpaid';

            $order->statut = 'ordered';
            $order->user_id = Auth::user()->id;

            $order->save();

            $token = (array)json_decode(json_encode(DB::table("pos_auth_tokens")->where("token", '=', $request->posToken)->first()), true);

            if (!is_null($token))
            {
                if (Carbon::parse($token["created_at"])->diffInSeconds(Carbon::parse(date("Y-m-d H:i:s.mmm"))) >= 3600)
                {
                    DB::table("pos_auth_tokens")->where("token", '=', $request->posToken)->update(
                        [
                            "status" => false
                        ]
                    );

                    $message = 1;

                    return ["order_id" => $order->id, "message" => $message, "success" => false, "slogan" => "¡El token ingresado ya está invalidado!"];
                }
                else
                {
                    if ($token["status"] && $token["user_id"] === $request->user('api')->id) {
                        DB::table("pos_auth_tokens")->where("token", '=', $request->posToken)->update(
                            [
                                "status" => false,
                                "sale_id" => $order->id
                            ]
                        );
                    }
                    else {
                        if (!$token["status"])
                        {
                            $message = 1;

                            return ["order_id" => $order->id, "message" => $message, "success" => false, "slogan" => "¡El token ingresado ya está invalidado!"];
                        }
                        else if ($token["user_id"] !== $request->user('api')->id)
                        {
                            $message = 2;

                            return ["order_id" => $order->id, "message" => $message, "success" => false, "slogan" => "¡El token ingresado ya está asignado a otro usuario!"];
                        }
                        else
                        {
                            $message = 3;

                            return ["order_id" => $order->id, "message" => $message, "success" => false, "slogan" => "¡El token ingresado ya ha sido usado y está invalidado!"];
                        }
                    }
                }
            }

            $detailsData = $request['details'];

            $saleDetailsData = null;

            foreach ($detailsData as $key => $value) {
                $this->productId = $value['product_id'];
                $this->productQuantity = $value['quantity'];
                $this->productDiscount = $value['discount'];
                $this->subTotalProductPrice = $value['subtotal'];
                $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where('id', '=', $this->productId)->pluck('price')->first()), true), 2);
                $originalPriceWithDiscount = $originalPrice - $productsDiscounts[$key];

                $price = null;

                if ($client->final_consumer === 1) {
                    $price = $value['Net_price'];
                    $this->taxMethod = 2;
                } else if ($client->final_consumer === 0) {
                    $originalPriceWithDiscount = $originalPriceWithDiscount - round($originalPriceWithDiscount - ($originalPriceWithDiscount / 1.13), 2);

                    $price = $value['Net_price'] - round($value['Net_price'] - ($value['Net_price'] / 1.13), 2);
                    $this->taxMethod = 1;
                }

                $this->originalProductPrice = $originalPriceWithDiscount;
                $this->newProductPrice = $price;

                $productName = json_decode(json_encode(DB::table("products")->where('id', '=', $this->productId)->pluck("name")->first()), true);

                $saleDetailsData[] = [
                    'name' => $productName,
                    'original_product_price' => round($this->originalProductPrice, 2),
                    'new_product_price' => round($this->newProductPrice, 2),
                    'product_quantity' => $this->productQuantity,
                    'product_total' => round($this->subTotalProductPrice)
                ];

                $orderDetails[] = [
                    'date' => Carbon::now(),
                    'sale_id' => $order->id,
                    'quantity' => $this->productQuantity,
                    'product_id' => $this->productId,
                    'product_variant_id' => $value['product_variant_id'],
                    'total' => round($this->subTotalProductPrice, 2),
                    'price' => round($this->newProductPrice, 2),
                    'TaxNet' => round($TaxNetDetail, 2),
                    'tax_method' => $this->taxMethod,
                    'discount' => round($this->productDiscount),
                    'discount_method' => $value['discount_Method'],
                ];

                $unit = json_decode(json_encode(DB::table('products')
                    ->where('id', '=', $this->productId)
                    ->where('deleted_at', '=', null)
                    ->first()), true);

                $unit["unitSale"] = json_decode(json_encode(DB::table('units')->where('id', $unit["unit_sale_id"])->first()), true);

                if ($value['product_variant_id'] !== null) {
                    $product_warehouse = ProductWarehouse::where('warehouse_id', $order->warehouse_id)
                        ->where('product_id', $this->productId)->where('product_variant_id', $value['product_variant_id'])
                        ->first();

                    if ($unit && $product_warehouse) {
                        if ($unit['unitSale']["operator"] == '/')
                            $product_warehouse->qte -= $this->productQuantity / $unit['unitSale']["operator_value"];
                        else
                            $product_warehouse->qte -= $this->productQuantity * $unit['unitSale']["operator_value"];

                        $product_warehouse->save();
                    }
                } else {
                    $product_warehouse = ProductWarehouse::where('warehouse_id', $order->warehouse_id)
                        ->where('product_id', $this->productId)
                        ->first();

                    if ($unit && $product_warehouse) {
                        if ($unit['unitSale']["operator"] == '/')
                            $product_warehouse->qte -= $this->productQuantity / $unit['unitSale']["operator_value"];
                        else
                            $product_warehouse->qte -= $this->productQuantity * $unit['unitSale']["operator_value"];

                        $product_warehouse->save();
                    }
                }
            }

            $stringOne = '[{' . '"email"' . ':"';
            $stringTwo = '"}]';
            $adminEmail = json_encode(DB::select('SELECT email FROM settings WHERE id = 1'));

            $data['client_name'] = $this->clientName;
            $data['final_consumer'] = $this->clientFinalConsumerOrNot;
            $data['big_consumer'] = $this->clientBigConsumerOrNot;
            $data['email'] = str_replace($stringTwo, '', str_replace($stringOne, '', $adminEmail));
            $data['total_discount'] = round($this->orderDiscount, 2);
            $data['firstname'] = auth()->user()->firstname;
            $data['lastname'] = auth()->user()->lastname;
            $data['date'] = Carbon::now()->locale('es')->isoFormat('dddd\, D \d\e MMMM \d\e\l Y');
            $data['time'] = date('h:i:s A');

            $boolean = null;
            $booleansArray = array();

            for ($i = 0; $i < count($saleDetailsData); $i++) {
                    if (round($saleDetailsData[$i]['original_product_price'], 2) != round($saleDetailsData[$i]['new_product_price'], 2) || $data['total_discount'] !== 0.0 || (round($saleDetailsData[$i]['original_product_price'], 2) != round($saleDetailsData[$i]['new_product_price'], 2) && $data['total_discount'] !== 0.0))
                        $boolean = true;
                    else if (round($saleDetailsData[$i]['original_product_price'], 2) === round($saleDetailsData[$i]['new_product_price'], 2) || $data['total_discount'] === 0.0 || (round($saleDetailsData[$i]['original_product_price'], 2) === round($saleDetailsData[$i]['new_product_price'], 2) && $data['total_discount'] === 0.0))
                        $boolean = false;

                    array_push($booleansArray, $boolean);
            }

            if (in_array(true, $booleansArray)) {
                $this->Set_config_mail();
                Mail::to($data['email'])->send(new ProductPriceModification($data, $saleDetailsData));
            }

            DB::table("sale_details")->insert($orderDetails);

            $sale = Sale::findOrFail($order->id);

            // Check If User Has Permission view All Records
            if (!$view_records) {
                $this->authorizeForUser($request->user('api'), 'check_record', $sale);
            }

            // try {

            //     $total_paid = $sale->paid_amount + $request->payment['amount'];
            //     $due = $sale->GrandTotal - $total_paid;
            //     $payment_statut = 'unpaid';


            //     // if ($due === 0.0 || $due < 0.0) {
            //     //     $payment_statut = 'paid';
            //     // } else if ($due != $sale->GrandTotal) {
            //     //     $payment_statut = 'partial';
            //     // } else if ($due == $sale->GrandTotal) {
            //     //     $payment_statut = 'unpaid';
            //     // }

            //     if ($request->payment['Reglement'] == 'credit card') {
            //         $Client = Client::whereId($request->client_id)->first();
            //         Stripe\Stripe::setApiKey(config('app.STRIPE_SECRET'));

            //         $PaymentWithCreditCard = PaymentWithCreditCard::where('customer_id', $request->client_id)->first();
            //         if (!$PaymentWithCreditCard) {
            //             // Create a Customer
            //             $customer = \Stripe\Customer::create([
            //                 'source' => $request->token,
            //                 'email' => $Client->email,
            //             ]);

            //             // Charge the Customer instead of the card:
            //             $charge = \Stripe\Charge::create([
            //                 'amount' => $request->payment['amount'] * 100,
            //                 'currency' => 'usd',
            //                 'customer' => $customer->id,
            //             ]);
            //             $PaymentCard['customer_stripe_id'] = $customer->id;

            //         } else {
            //             $customer_id = $PaymentWithCreditCard->customer_stripe_id;
            //             $charge = \Stripe\Charge::create([
            //                 'amount' => $request->payment['amount'] * 100,
            //                 'currency' => 'usd',
            //                 'customer' => $customer_id,
            //             ]);
            //             $PaymentCard['customer_stripe_id'] = $customer_id;
            //         }

            //         $PaymentSale = new PaymentSale();
            //         $PaymentSale->sale_id = $order->id;
            //         $PaymentSale->Ref = app('App\Http\Controllers\PaymentSalesController')->getNumberOrder();
            //         $PaymentSale->date = Carbon::now();
            //         $PaymentSale->Reglement = $request->payment['Reglement'];
            //         $PaymentSale->montant = $request->payment['amount'];
            //         $PaymentSale->notes = $request->payment['notes'];
            //         $PaymentSale->user_id = Auth::user()->id;
            //         $PaymentSale->save();

            //         $sale->update([
            //             'paid_amount' => $total_paid,
            //             'payment_statut' => $payment_statut,
            //         ]);

            //         $PaymentCard['customer_id'] = $request->client_id;
            //         $PaymentCard['payment_id'] = $PaymentSale->id;
            //         $PaymentCard['charge_id'] = $charge->id;
            //         PaymentWithCreditCard::create($PaymentCard);

            //         // Paying Method Cash
            //     } else {

            //         PaymentSale::create([
            //             'sale_id' => $order->id,
            //             'Ref' => app('App\Http\Controllers\PaymentSalesController')->getNumberOrder(),
            //             'date' => Carbon::now(),
            //             'Reglement' => $request->payment['Reglement'],
            //             'montant' => $request->payment['amount'],
            //             'notes' => $request->payment['notes'],
            //             'user_id' => Auth::user()->id,
            //         ]);

            //         $sale->update([
            //             'paid_amount' => $total_paid,
            //             'payment_statut' => $payment_statut,
            //         ]);
            //     }

            // } catch (Exception $e) {
            //     return response()->json(['message' => $e->getMessage()], 500);
            // }

            return ["order_id" => $order->id, "message" => $message, "success" => true, "slogan" => ""];
        }, 10);

        return response()->json(['success' => $item["success"], 'id' => $item["order_id"], 'message' => $item["message"], 'slogan' => $item["slogan"]]);
    }

    //--- Get Offers Per Categories or Warehouses or Both ---\\

    private function getOfferPerCategoryOrWarehouseOrBoth($productId, $warehouseId)
    {
        $offers = json_decode(json_encode(DB::table("offers_products")->where("activo", "=", 1)->where("deleted_at", "=", null)->get()), true);
        $productWarehouse = json_decode(json_encode(DB::table("product_warehouse")->where("product_id", "=", $productId)->where("warehouse_id", "=", $warehouseId)->first()), true);

        $productDiscount = [];

        if (isset($productWarehouse))
        {
            if (is_array($productWarehouse))
            {
                $productWarehouse["product_details"] = json_decode(json_encode(DB::table("products")->where("id", "=", $productId)->first()), true);
                $productWarehouse["warehouse_details"] = (isset($warehouseId)) ? json_decode(json_encode(DB::table("warehouses")->where("id", "=", $warehouseId)->first()), true) : [];

                $productName = $productWarehouse["product_details"]["name"];
                $productCategoryId = $productWarehouse["product_details"]["category_id"];
                $productWarehouseName = $productWarehouse["warehouse_details"]["name"];

                foreach ($offers as $offer) {
                    $offerCategoryProductId = $offer["category_product_id"];
                    $offerWarehouseId = $offer["warehouse_id"];

                    if (is_null($offerCategoryProductId) && is_null($offerWarehouseId)) {
                            Log::info("¡Entro a aplicar la oferta global al producto '" . $productName . "'!");

                        // if ($productCategoryId === $offerCategoryProductId && $productWarehouseName === $offerWarehouseId /* $productCategoryId === null && $productWarehouseName === null */) {
                            array_push($productDiscount, $offer);
                            break;
                        // }
                    } else if (!is_null($offerCategoryProductId) && is_null($offerWarehouseId)) {
                        if ($productCategoryId === $offerCategoryProductId && $productWarehouseName === $offerWarehouseId /* $productCategoryId === $offerCategoryProductId && $productWarehouseName === null */) {
                            Log::info("¡Entro a aplicar la oferta al producto '" . $productName . "' de la categoría " . (string)$productCategoryId . "!");

                            array_push($productDiscount, $offer);
                            break;
                        }
                    } else if (is_null($offerCategoryProductId) && !is_null($offerWarehouseId)) {
                        if ($productCategoryId === $offerCategoryProductId && $productWarehouseName === $offerWarehouseId /* $productCategoryId === null && $productWarehouseName === $offerWarehouseId */) {
                            Log::info("¡Entro a aplicar la oferta al producto '" . $productName . "' en el almacén " . (string)$productWarehouseName . "!");

                            array_push($productDiscount, $offer);
                            break;
                        }
                    } else if (!is_null($offerCategoryProductId) && !is_null($offerWarehouseId)) {
                        if ($productCategoryId === $offerCategoryProductId && $productWarehouseName === $offerWarehouseId) {
                            Log::info("¡Entro a aplicar la oferta al producto '" . $productName . "' de la categoría " . (string)$productCategoryId . " en el almacén " . (string)$productWarehouseName . "!");

                            array_push($productDiscount, $offer);
                            break;
                        }
                    }
                }
            }
        }

        return (count($productDiscount) > 0) ? $productDiscount : 0.00;
    }

    public static function checkTimeAndGetDiscountPricePerProduct($currentDate, $currentHour, $productId, $productPrice, $warehouseId)
    {
        $is_in_days_array = false;
        $is_between_range_of_dates = false;
        $is_between_range_of_hours = false;

        $discount = 0.00;
        $productHasDiscount = false;

        $offer = PosController::getDiscountPricePerProduct($productId, $productPrice, $warehouseId);

        if (count($offer["offer"]) > 0) {
            $horaInicio = $offer["offer"][0]["hora_inicio"];
            $horaFin = $offer["offer"][0]["hora_fin"];
            $fechaInicio = $offer["offer"][0]["fecha_inicio"];
            $fechaFin = $offer["offer"][0]["fecha_fin"];
            $dias = json_decode($offer["offer"][0]["dias"]);

            $currentDateInLetters = (int)strtolower(utf8_encode(strftime("%u")));

            $currentDateInSpanish = null;

            switch ($currentDateInLetters)
            {
                case 1:
                    $currentDateInSpanish = "lunes";
                    break;
                case 2:
                    $currentDateInSpanish = "martes";
                    break;
                case 3:
                    $currentDateInSpanish = "miercoles";
                    break;
                case 4:
                    $currentDateInSpanish = "jueves";
                    break;
                case 5:
                    $currentDateInSpanish = "viernes";
                    break;
                case 6:
                    $currentDateInSpanish = "sabado";
                    break;
                case 7:
                    $currentDateInSpanish = "domingo";
                    break;
                default:
                    break;
            }

            if (in_array($currentDateInSpanish, $dias))
                $is_in_days_array = true;

            if (strtotime($currentHour) >= strtotime($horaInicio) && strtotime($currentHour) <= strtotime($horaFin))
                $is_between_range_of_dates = true;

            if (strtotime($currentDate) >= strtotime($fechaInicio) && strtotime($currentDate) <= strtotime($fechaFin))
                $is_between_range_of_hours = true;

            $discount = ($is_between_range_of_dates && $is_between_range_of_hours && $is_in_days_array) ? $offer["discount"] : $discount;
            $productHasDiscount = ($is_between_range_of_dates && $is_between_range_of_hours && $is_in_days_array) ? true : $productHasDiscount;
        }

        return ["product_has_discount" => $productHasDiscount, "discount" => round($discount, 2)];
    }

    private function getDiscountPricePerProduct($productId, $productPrice, $warehouseId)
    {
        $pos = new PosController();

        $productDiscount = $pos->getOfferPerCategoryOrWarehouseOrBoth($productId, $warehouseId);
        $finalProductDiscount = (!is_array($productDiscount)) ? $productDiscount : ((!is_null($productDiscount[0]["porcentajeDescuentoProducto"])) ? (float)$productDiscount[0]["porcentajeDescuentoProducto"] : (float)$productDiscount[0]["precioProducto"]);

        $discountAmount = ((!is_array($productDiscount)) ? $finalProductDiscount : ((!is_null($productDiscount[0]["porcentajeDescuentoProducto"])) ? ((float)$finalProductDiscount / 100) * $productPrice : (float)$finalProductDiscount));

        return ["discount" => $discountAmount, "offer" => (!is_array($productDiscount)) ? [] : ((count($productDiscount) > 0) ? $productDiscount : [])];
    }

    //------- Create Generation Token -------\\

    public function generateNewPosAuthToken(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', PosAuthToken::class);

        openssl_random_pseudo_bytes(64);

        $token = Str::random(8);
        $todayDateAndTime = date("Y-m-d H:i:s.mmm");
        $existingAndValidTokens = json_decode(json_encode(DB::table("pos_auth_tokens")->where("expires_at", '>', $todayDateAndTime)->get()), true);

        if (count($existingAndValidTokens) > 0)
        {
            foreach ($existingAndValidTokens as $key => $existingAndValidToken) {
                if ($token === $existingAndValidToken["token"]) {
                    $token = null;
                    break;
                }
                else {
                    if (count($existingAndValidTokens) > 1) {
                        if ($key === count($existingAndValidTokens) - 1) {
                            DB::table("pos_auth_tokens")->insert(
                                [
                                    "token" => $token,
                                    "created_at" => date("Y-m-d H:i:s.mmm"),
                                    "expires_at" => date("Y-m-d H:i:s.mmm", strtotime(date("Y-m-d H:i:s.mmm") . " + 1 hour")),
                                    "status" => true
                                ]
                            );
                        }
                        else
                            continue;
                    }
                    else {
                        DB::table("pos_auth_tokens")->insert(
                            [
                                "token" => $token,
                                "created_at" => date("Y-m-d H:i:s.mmm"),
                                "expires_at" => date("Y-m-d H:i:s.mmm", strtotime(date("Y-m-d H:i:s.mmm") . " + 1 hour")),
                                "status" => true
                            ]
                        );
                    }
                }
            }
        }
        else
        {
            DB::table("pos_auth_tokens")->insert(
                [
                    "token" => $token,
                    "created_at" => date("Y-m-d H:i:s.mmm"),
                    "expires_at" => date("Y-m-d H:i:s.mmm", strtotime(date("Y-m-d H:i:s.mmm") . " + 1 hour")),
                    "status" => true
                ]
            );
        }

        return response()->json(
            [
                'token' => $token
            ],
            (!is_null($token) && !empty($token)) ? 200 : 204
        );
    }

    //------------ Get Products--------------\\

    public function GetProductsByParametre(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        // How many items do you want to display.

        $perPage = 30;
        $pageStart = $request->input('page', 1);
        // Start displaying items from this number;
        $offset = ($pageStart * $perPage) - $perPage;
        $data = array();

        $product_warehouse_query = DB::table('product_warehouse')
            ->join('products', 'product_warehouse.product_id', '=', 'products.id')
            ->join('units', 'products.unit_sale_id', '=', 'units.id')
            ->where('product_warehouse.warehouse_id', $request->warehouse_id)
            ->whereNull('product_warehouse.deleted_at')
            ->when($request->filled('category_id'), function ($query) use ($request) {
                return $query->whereExists(function ($query) use ($request) {
                    $query->select(DB::raw(1))
                        ->from('categories')
                        ->whereRaw('categories.id = products.category_id')
                        ->where('categories.id', $request->category_id);
                });
            })
            ->when($request->filled('brand_id'), function ($query) use ($request) {
                return $query->where('products.brand_id', $request->brand_id);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                return $query->where(function ($query) use ($request) {
                    $query->where('products.name', 'LIKE', "%{$request->search}%")
                        ->orWhere('products.code', 'LIKE', "%{$request->search}%");
                });
            })->get();

        $totalRows = $product_warehouse_query->count();

        $product_warehouse_data = json_decode(json_encode($product_warehouse_query->skip($offset)->take($perPage)), true);

        foreach ($product_warehouse_data as &$product_warehouse) {
            $product_warehouse["product"] = json_decode(json_encode(DB::table('products')->where('id', $product_warehouse["product_id"])->first()), true);
            $product_warehouse["product"]["unitSale"] = json_decode(json_encode(DB::table('units')->where('id', $product_warehouse["product"]["unit_sale_id"])->first()), true);

            if ($product_warehouse["product_variant_id"]) {
                $productsVariants = DB::table("product_variants")->where('product_id', $product_warehouse["product_id"])
                    ->where('id', $product_warehouse["product_variant_id"])
                    ->where('deleted_at', null)
                    ->first();

                $item['product_variant_id'] = $product_warehouse["product_variant_id"];
                $item['Variant'] = $productsVariants->name;
                $item['code'] = $productsVariants->name . '-' . $product_warehouse["product"]["code"];
            } else if ($product_warehouse["product_variant_id"] === null) {
                $item['product_variant_id'] = null;
                $item['Variant'] = null;
                $item['code'] = $product_warehouse["product"]["code"];
            }

            $item['id'] = $product_warehouse["product_id"];
            $item['name'] = $product_warehouse["product"]["name"];
            $firstimage = explode(',', $product_warehouse["product"]["image"]);
            $item['image'] = $firstimage[0];
            $item['imageList'] = [];

            if ($product_warehouse["product"]["image"] != '') {
                foreach (explode(',', $product_warehouse["product"]["image"]) as $img)
                    $item['imageList'][] = $img;
            }

            // $productId = $product_warehouse["product"]["id"];
            // $productPrice = $product_warehouse["product"]["price"];
            // $productWarehouseId = $product_warehouse["warehouse_id"];

            // $discount = (isset($productId) && isset($productPrice)) ? $this->checkTimeAndGetDiscountPricePerProduct(date("Y-m-d"), date("H:i:s"), $productId, $productPrice, $productWarehouseId) : 0.00;

            if ($product_warehouse["product"]["unitSale"]["operator"] == '/') {
                $item['qte_sale'] = $product_warehouse["qte"] * $product_warehouse["product"]["unitSale"]["operator_value"];
                $price = ($product_warehouse["product"]["price"] / $product_warehouse["product"]["unitSale"]["operator_value"]) /* - $discount */;
            } else {
                $item['qte_sale'] = $product_warehouse["qte"] / $product_warehouse["product"]["unitSale"]["operator_value"];
                $price = ($product_warehouse["product"]["price"] * $product_warehouse["product"]["unitSale"]["operator_value"]) /* - $discount */;
            }

            $item['unitSale'] = $product_warehouse["product"]["unitSale"]["ShortName"];

            if ($product_warehouse["product"]["TaxNet"] !== 0.0) {
                //Exclusive
                if ($product_warehouse["product"]["tax_method"] == '1') {
                    $tax_price = $price * $product_warehouse["product"]["TaxNet"] / 100;
                    $item['Net_price'] = ($price + $tax_price);
                }
                // Inclusive
                else
                    $item['Net_price'] = $price;
            } else
                $item['Net_price'] = $price;

            $data[] = $item;
        }

        return response()->json(
            [
                'products' => $data,
                'totalRows' => $totalRows,
            ]
        );
    }

    //--------------------- Get Element POS ------------------------\\

    public function GetElementPos(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        $warehouses = DB::table("warehouses")->where('deleted_at', '=', null)->get(['id', 'name']);
        $clients = DB::table("clients")->where('deleted_at', '=', null)->get(['id', 'name', 'phone', 'final_consumer', 'NRC']);

        foreach ($clients as &$client) {
            $client->final_consumer = $client->final_consumer === 0 ? 'CCF' : 'CF';
            $client->phone = $client->final_consumer === 'CCF' ? $client->NRC : $client->phone;
        }

        $settings = DB::table("settings")->where('deleted_at', '=', null)->first();

        if ($settings->warehouse_id) {
            if (DB::table("warehouses")->where('id', $settings->warehouse_id)->where('deleted_at', '=', null)->first())
                $defaultWarehouse = $settings->warehouse_id;
            else
                $defaultWarehouse = '';
        } else
            $defaultWarehouse = '';

        if ($settings->client_id) {
            if (DB::table("clients")->where('id', $settings->client_id)->where('deleted_at', '=', null)->first())
                $defaultClient = $settings->client_id;
            else
                $defaultClient = '';
        } else
            $defaultClient = '';

        $categories = DB::table("categories")->where('deleted_at', '=', null)->get(['id', 'name', 'image']);
        $brands = DB::table("brands")->where('deleted_at', '=', null)->get();
        $stripe_key = config('app.STRIPE_KEY');

        return response()->json(
            [
                'stripe_key' => $stripe_key,
                'brands' => $brands,
                'defaultWarehouse' => $defaultWarehouse,
                'defaultClient' => $defaultClient,
                'clients' => $clients,
                'warehouses' => $warehouses,
                'categories' => $categories,
            ]
        );
    }

    public function authDiscount(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);

        $authorizedCode = $request->authorizedCode;

        $authorized = DB::table('users')->where('authorizedCode', $authorizedCode)->count();

        $authorized = $authorized >= 1 ? 1 : $authorized;

        return response()->json(['authorized' => $authorized]);
    }

    public function authPriceChange(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', PosAuthToken::class);

        $authorizedCode = $request->authorizedCode;
        $userId = $request->user('api')->id;

        $posAuthToken = (array)json_decode(json_encode(DB::table("pos_auth_tokens")->where("token", '=', $authorizedCode)->where("status", '=', true)->first()), true);
        $posAuthTokenUserId = null;

        if (isset($posAuthToken))
        {
            if (count($posAuthToken) > 0)
            {
                if (Carbon::parse($posAuthToken["created_at"])->diffInSeconds(Carbon::parse(date("Y-m-d H:i:s.mmm"))) >= 3600)
                {
                    DB::table("pos_auth_tokens")->where("token", '=', $authorizedCode)->update(
                        [
                            "status" => false
                        ]
                    );
                }
                else
                {
                    if ($posAuthToken["status"] && is_null($posAuthToken["user_id"])) {
                        DB::table("pos_auth_tokens")->where("token", '=', $authorizedCode)->update(
                            [
                                "user_id" => $userId
                            ]
                        );
                    }

                    $posAuthTokenUserId = json_decode(json_encode(DB::table("pos_auth_tokens")->where("token", '=', $authorizedCode)->where("status", '=', true)->pluck("user_id")->first()), true);
                }
            }
        }

        $authorized = (isset($posAuthToken) && isset($posAuthTokenUserId)) ? (($posAuthTokenUserId === $userId) ? 1 : 0) : 0;

        return response()->json(
            [
                "authorized" => $authorized
            ]
        );
    }
}
