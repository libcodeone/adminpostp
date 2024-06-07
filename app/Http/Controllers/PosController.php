<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Client;
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

        request()->validate([
            'client_id' => 'required',
            'warehouse_id' => 'required',
            'payment.amount' => 'required',
        ]);

        $item = DB::transaction(function () use ($request) {
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

            $data1 = $request['details'];

            $saleDetailsData = null;

            foreach ($data1 as $value) {
                $this->productId = $value['product_id'];
                $this->productQuantity = $value['quantity'];
                $this->productDiscount = $value['discount'];
                $this->subTotalProductPrice = $value['subtotal'];
                $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where('id', '=', $this->productId)->pluck('price')->first()), true), 2);
                $price = null;

                // $discount = $this->checkTimeAndGetDiscountPricePerProduct(date("Y-m-d"), date("H:i:s"), $this->productId, $value['Net_price']);

                if ($client->final_consumer === 1) {
                    $price = $value['Net_price'] /* - $discount */;
                    $this->taxMethod = 2;
                } else if ($client->final_consumer === 0) {
                    $originalPrice = $originalPrice - round($originalPrice - ($originalPrice / 1.13), 2);

                    $price = $value['Net_price'] - round($value['Net_price'] - ($value['Net_price'] / 1.13), 2) /* - $discount */;
                    $this->taxMethod = 1;
                }

                $this->originalProductPrice = $originalPrice;
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

            setlocale(LC_TIME, "sv_ES");

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
                if (round($saleDetailsData[$i]['original_product_price'], 2) != round($saleDetailsData[$i]['new_product_price'], 2) || $data['total_discount'] !== 0.0 || (round($saleDetailsData[$i]['original_product_price'], 2) != round($saleDetailsData[$i]['new_product_price'], 2) && $data['total_discount'] !== 0.0)) {
                    $boolean = true;
                } else if (round($saleDetailsData[$i]['original_product_price'], 2) === round($saleDetailsData[$i]['new_product_price'], 2) || $data['total_discount'] === 0.0 || (round($saleDetailsData[$i]['original_product_price'], 2) === round($saleDetailsData[$i]['new_product_price'], 2) && $data['total_discount'] === 0.0)) {
                    $boolean = false;
                }
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

            return $order->id;
        }, 10);

        return response()->json(['success' => true, 'id' => $item]);
    }

    //--- Get Offers Per Categories or Warehouses or Both ---\\

    private function getOfferPerCategoryOrWarehouseOrBoth($productId)
    {
        $product = json_decode(json_encode(DB::table("products")->where("id", '=', $productId)->first()), true);
        $offers = json_decode(json_encode(DB::table("offers_products")->where("activo", "=", 1)->where("deleted_at", "=", null)->get()), true);

        $productName = json_decode(json_encode(DB::table("products")->where('id', '=', $productId)->pluck('name')->first()), true);

        $productDiscount = array();

        foreach ($offers as $offer) {
            if (is_null($offer["category_product_id"]) && is_null($offer["warehouse_id"])) {
                    Log::info("¡Entro a aplicar la oferta global al producto '" + $productName + "'!");

                // if ($product["category_id"] === $offer["category_product_id"] && $product["warehouse_id"] === $offer["warehouse_id"] /* $product["category_id"] === null && $product["warehouse_id"] === null */) {
                    array_push($productDiscount, $offer);
                    break;
                // }
            } else if (!is_null($offer["category_product_id"]) && is_null($offer["warehouse_id"])) {
                if ($product["category_id"] === $offer["category_product_id"] && $product["warehouse_id"] === $offer["warehouse_id"] /* $product["category_id"] === $offer["category_product_id"] && $product["warehouse_id"] === null */) {
                    Log::info("¡Entro a aplicar la oferta al producto '" + $productName + "' en el almacén " + $product["warehouse_id"] + "!");

                    array_push($productDiscount, $offer);
                    break;
                }
            } else if (is_null($offer["category_product_id"]) && !is_null($offer["warehouse_id"])) {
                if ($product["category_id"] === $offer["category_product_id"] && $product["warehouse_id"] === $offer["warehouse_id"] /* $product["category_id"] === null && $product["warehouse_id"] === $offer["warehouse_id"] */) {
                    Log::info("¡Entro a aplicar la oferta al producto '" + $productName + "' de la categoría " + $product["category_id"] + "!");

                    array_push($productDiscount, $offer);
                    break;
                }
            } else if (!is_null($offer["category_product_id"]) && !is_null($offer["warehouse_id"])) {
                if ($product["category_id"] === $offer["category_product_id"] && $product["warehouse_id"] === $offer["warehouse_id"]) {
                    Log::info("¡Entro a aplicar la oferta al producto '" + $productName + "' en el almacén " + $product["warehouse_id"] + " de la categoría " + $product["category_id"] + "!");

                    array_push($productDiscount, $offer);
                    break;
                }
            }
        }

        return (count($productDiscount) > 0) ? $productDiscount : 0.00;
    }

    public static function checkTimeAndGetDiscountPricePerProduct($currentDate, $currentHour, $productId, $productPrice)
    {
        $is_in_days_array = false;
        $is_between_range_of_dates = false;
        $is_between_range_of_hours = false;

        $offer = PosController::getDiscountPricePerProduct($productId, $productPrice);

        $discount = 0.00;

        if (count($offer["offer"]) > 0) {
            $horaInicio = $offer["offer"][0]["hora_inicio"];
            $horaFin = $offer["offer"][0]["hora_fin"];
            $fechaInicio = $offer["offer"][0]["fecha_inicio"];
            $fechaFin = $offer["offer"][0]["fecha_fin"];
            $dias = json_decode($offer["offer"][0]["dias"]);

            $settedLocale = setlocale(LC_TIME, "es");

            Log::info($settedLocale);

            $currentDateInSpanish = utf8_encode(strftime("%A"));

            Log::info($currentDateInSpanish);

            $currentDateInSpanish = str_replace(['á', 'é', 'í', 'ó', 'ú'], ['a', 'e', 'i', 'o', 'u'], $currentDateInSpanish);

            if (in_array($currentDateInSpanish, $dias))
                $is_in_days_array = true;

            if (strtotime($currentHour) >= strtotime($horaInicio) && strtotime($currentHour) <= strtotime($horaFin))
                $is_between_range_of_dates = true;

            if (strtotime($currentDate) >= strtotime($fechaInicio) && strtotime($currentDate) <= strtotime($fechaFin))
                $is_between_range_of_hours = true;

            $discount = ($is_between_range_of_dates && $is_between_range_of_hours && $is_in_days_array) ? $offer["discount"] : $discount;
        }

        return round($discount, 2);
    }

    private function getDiscountPricePerProduct($productId, $productPrice)
    {
        $pos = new PosController();

        $productDiscount = $pos->getOfferPerCategoryOrWarehouseOrBoth($productId);
        $finalProductDiscount = (!is_array($productDiscount)) ? $productDiscount : ((!is_null($productDiscount[0]["porcentajeDescuentoProducto"])) ? (float)$productDiscount[0]["porcentajeDescuentoProducto"] : (float)$productDiscount[0]["precioProducto"]);

        $discountAmount = ((!is_array($productDiscount)) ? $finalProductDiscount : ((!is_null($productDiscount[0]["porcentajeDescuentoProducto"])) ? ((float)$finalProductDiscount / 100) * $productPrice : (float)$finalProductDiscount));

        return ["discount" => $discountAmount, "offer" => (!is_array($productDiscount)) ? [] : ((count($productDiscount) > 0) ? $productDiscount : [])];
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

            $discount = $this->checkTimeAndGetDiscountPricePerProduct(date("Y-m-d"), date("H:i:s"), $product_warehouse["product"]["id"], $product_warehouse["product"]["price"]);

            if ($product_warehouse["product"]["unitSale"]["operator"] == '/') {
                $item['qte_sale'] = $product_warehouse["qte"] * $product_warehouse["product"]["unitSale"]["operator_value"];
                $price = ($product_warehouse["product"]["price"] / $product_warehouse["product"]["unitSale"]["operator_value"]) - $discount;
            } else {
                $item['qte_sale'] = $product_warehouse["qte"] / $product_warehouse["product"]["unitSale"]["operator_value"];
                $price = ($product_warehouse["product"]["price"] * $product_warehouse["product"]["unitSale"]["operator_value"]) - $discount;
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

    public function GetELementPos(Request $request)
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
}
