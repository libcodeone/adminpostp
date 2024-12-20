<?php

namespace App\Http\Controllers;

use Stripe;
use Twilio\Rest\Client as Client_Twilio;
use App\Exports\SalesExport;
use App\Models\SaleReturn;
use App\Mail\SaleMail;
use App\Models\Client;
use App\Models\PaymentSale;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductWarehouse;
use App\Models\Quotation;
use App\Models\Role;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Setting;
use App\Models\Warehouse;
use App\utils\helpers;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\PaymentWithCreditCard;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\PDF;
use Throwable;

class SalesController extends BaseController
{
    //------------- GET ALL SALES -----------\\

    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Sale::class);
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        // How many items do you want to display.
        $perPage = $request->limit;
        $pageStart = $request->get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $order = isset($request->SortField) ? $request->SortField : "desc";
        $dir = $request->SortType;
        $helpers = new helpers();
        // Filter fields With Params to retrieve
        if ($request->statut == 'unpaid_checkin') {
            $param = array(
                0 => 'null',
                1 => '<>',
                2 => '=',
                3 => '=',
                4 => '=',
                5 => 'like',
            );
        } else {
            $param = array(
                0 => 'like',
                1 => 'like',
                2 => '=',
                3 => '=',
                4 => '=',
                5 => 'like',
            );
        }
        $columns = array(
            0 => 'Ref',
            1 => 'statut',
            2 => 'client_id',
            3 => 'payment_statut',
            4 => 'warehouse_id',
            5 => 'date',
        );
        $data = array();

        // Check If User Has Permission View  All Records
        $Sales = Sale::with('facture', 'client', 'warehouse')->where('deleted_at', '=', null);
        // ->where(function ($query) use ($view_records) {
        //     if (!$view_records) {
        //         return $query->where('user_id', '=', Auth::user()->id);
        //     }
        // });
        //Multiple Filter

        $Filtred = $helpers->filter($Sales, $columns, $param, $request)
            // Search With Multiple Param
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('Ref', 'LIKE', "%$request->search%")
                        ->orWhere('statut', 'LIKE', "%$request->search%")
                        ->orWhere('GrandTotal', $request->search)
                        ->orWhere('payment_statut', 'like', "$request->search")
                        ->orWhere(function ($query) use ($request) {
                            return $query->whereHas('client', function ($q) use ($request) {
                                $q->where('name', 'LIKE', "%$request->search%");
                            });
                        })
                        ->orWhere(function ($query) use ($request) {
                            return $query->whereHas('warehouse', function ($q) use ($request) {
                                $q->where('name', 'LIKE', "%$request->search%");
                            });
                        });
                });
            });

        $totalRows = $Filtred->count();
        $Sales = $Filtred->offset($offSet)
            ->limit($perPage)
            ->orderBy($order, $dir)
            ->get();

        foreach ($Sales as $Sale) {

            $item['id'] = $Sale['id'];
            $item['date'] = $Sale['date'];
            $item['Ref'] = $Sale['Ref'];
            $item['statut'] = $Sale['statut'];
            $item['payment_statut'] = $Sale['payment_statut'];
            $item['discount'] = $Sale['discount'];
            $item['shipping'] = $Sale['shipping'];
            $item['warehouse_name'] = $Sale['warehouse']['name'];
            $item['client_id'] = $Sale['client']['id'];
            $item['client_name'] = $Sale['client']['name'];
            $item['client_email'] = $Sale['client']['email'];
            $item['client_tele'] = $Sale['client']['phone'];
            $item['client_code'] = $Sale['client']['code'];
            $item['final_consumer'] = $Sale['client']['final_consumer'];
            $item['big_consumer'] = $Sale['client']['big_consumer'];
            $item['client_adr'] = substr($Sale['client']['adresse'], 0, 30);
            $item['GrandTotal'] = number_format($Sale['GrandTotal'], 2, '.', '');
            $item['paid_amount'] = number_format($Sale['paid_amount'], 2, '.', '');
            $item['due'] = number_format($Sale['GrandTotal'] - $Sale['paid_amount'], 2, '.', '');
            if ($item['discount'] == ".00" || $item['discount'] == "") {
                $item['discount'] = 0.0;
            }
            if ($item['shipping'] == ".00" || $item['shipping'] == "") {
                $item['shipping'] = 0.0;
            }


            $data[] = $item;
        }

        $stripe_key = config('app.STRIPE_KEY');
        $customers = client::where('deleted_at', '=', null)->get(['id', 'name']);
        $warehouses = Warehouse::where('deleted_at', '=', null)->get(['id', 'name']);

        return response()->json([
            'stripe_key' => $stripe_key,
            'totalRows' => $totalRows,
            'sales' => $data,
            'customers' => $customers,
            'warehouses' => $warehouses,
        ]);
    }

    //------------- STORE NEW SALE-----------\\

    public function store(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Sale::class);
        request()->validate([
            'client_id' => 'required',
            'warehouse_id' => 'required',
        ]);
        DB::transaction(function () use ($request) {
            $helpers = new helpers();
            $order = new Sale;
            $client = Client::findOrFail($request->client_id);
            $company = Setting::where('deleted_at', '=', null)->first();
            $user = Auth::user();
            $taxRate = 0;
            $TaxNet = 0;
            $TaxWithheld = 0;
            $TaxNetDetail = 0;
            $TotalConDescuento = $request->GrandTotal - $request->discount - $request->shipping;
            $GrandTotal = $request->GrandTotal;

            $TaxMethod = 2;
            if ($client->final_consumer === 0) {
                $taxRate = 13;
                $TaxNet = round($TotalConDescuento - ($TotalConDescuento / 1.13), 2);

                if ($client->big_consumer == 1 and round($TotalConDescuento / 1.13, 2) >= 100) {
                    $TaxWithheld = round((($TotalConDescuento / 1.13) * 0.01), 2);
                    $GrandTotal = $TotalConDescuento - $TaxWithheld;
                }
            }

            $order->is_pos = 0;
            $order->date = $request->date;
            $order->client_id = $request->client_id;
            $order->GrandTotal = $GrandTotal;
            $order->subTotal = $request->GrandTotal;
            $order->warehouse_id = $request->warehouse_id;
            $order->tax_rate = $taxRate;
            $order->TaxNet = $TaxNet;
            $order->TaxWithheld = $TaxWithheld;
            $order->discount = $request->discount != "" ? $request->discount : 0.0;

            $order->shipping = $request->shipping != "" ? $request->shipping : 0.0;

            if ($order->discount == ".00" || $order->discount == "") {
                $order->discount = 0.0;
            }

            $order->statut = $request->statut;
            $order->payment_statut = 'unpaid';
            $order->notes = $request->notes;
            $order->refCreditCard = $request->refCreditCard;
            $order->refBankTransfer = $request->refBankTransfer;
            $order->type_invoice = $request->type_invoice;
            $order->Ref = $request->type_invoice == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
            $order->refInvoice = $request->type_invoice == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
            $order->user_id = Auth::user()->id;
            if ($request['type_invoice'] == 'CF') {
                DB::table("users")->where("id", '=', Auth::user()->id)->update([
                    'currentCF' =>  $order->refInvoice
                ]);
            } else {
                $company->update([
                    'currentCCF' =>  $order->refInvoice
                ]);
            }
            $order->save();
            $data = $request['details'];
            foreach ($data as $key => $value) {
                $price = $value['Unit_price'];
                $TaxMethod = 2;

                if ($client->final_consumer === 0) {
                    $TaxNetDetail = round($value['Unit_price'] - ($value['Unit_price'] / 1.13), 2);
                    $price = $value['Unit_price'] - $TaxNetDetail;
                    $TaxMethod = 1;
                }

                $orderDetails[] = [
                    'date' => $request->date,
                    'sale_id' => $order->id,
                    'quantity' => $value['quantity'],
                    'price' => $price,
                    'TaxNet' => $TaxNetDetail,
                    'tax_method' => $TaxMethod,
                    'discount' => $value['discount'],
                    'discount_method' => $value['discount_Method'],
                    'product_id' => $value['product_id'],
                    'product_variant_id' => $value['product_variant_id'],
                    'total' => $value['subtotal'],

                ];

                $unit = Product::with('unitSale')
                    ->where('id', $value['product_id'])
                    ->where('deleted_at', '=', null)
                    ->first();

                if ($order->statut == "completed") {
                    if ($value['product_variant_id'] !== null) {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $order->warehouse_id)
                            ->where('product_id', $value['product_id'])
                            ->where('product_variant_id', $value['product_variant_id'])
                            ->first();

                        if ($unit && $product_warehouse) {
                            if ($unit['unitSale']->operator == '/') {
                                $product_warehouse->qte -= $value['quantity'] / $unit['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte -= $value['quantity'] * $unit['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    } else {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $order->warehouse_id)
                            ->where('product_id', $value['product_id'])
                            ->first();

                        if ($unit && $product_warehouse) {
                            if ($unit['unitSale']->operator == '/') {
                                $product_warehouse->qte -= $value['quantity'] / $unit['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte -= $value['quantity'] * $unit['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    }
                }
            }
            SaleDetail::insert($orderDetails);
            $role = Auth::user()->roles->first();
            $view_records = Role::findOrFail($role->id)->inRole('record_view');

            if ($request->payment['status'] != 'pending') {
                $sale = Sale::findOrFail($order->id);
                // Check If User Has Permission view All Records
                if (!$view_records) {
                    // Check If User->id === sale->id
                    $this->authorizeForUser($request->user('api'), 'check_record', $sale);
                }
                try {
                    $total_paid = $sale->paid_amount + $request->payment['amount'];
                    $due = $sale->GrandTotal - $total_paid;
                    if ($due === 0.0 || $due < 0.0) {
                        $payment_statut = 'paid';
                    } else if ($due != $sale->GrandTotal) {
                        $payment_statut = 'partial';
                    } else if ($due == $sale->GrandTotal) {
                        $payment_statut = 'unpaid';
                    }
                    if ($request->payment['Reglement'] == 'credit card') {
                        $Client = Client::whereId($request->client_id)->first();
                        Stripe\Stripe::setApiKey(config('app.STRIPE_SECRET'));

                        $PaymentWithCreditCard = PaymentWithCreditCard::where('customer_id', $request->client_id)->first();
                        if (!$PaymentWithCreditCard) {
                            // Create a Customer
                            $customer = \Stripe\Customer::create([
                                'source' => $request->token,
                                'email' => $Client->email,
                            ]);
                            // Charge the Customer instead of the card:
                            $charge = \Stripe\Charge::create([
                                'amount' => $request->payment['amount'] * 100,
                                'currency' => 'usd',
                                'customer' => $customer->id,
                            ]);
                            $PaymentCard['customer_stripe_id'] =  $customer->id;
                        } else {
                            $customer_id = $PaymentWithCreditCard->customer_stripe_id;
                            $charge = \Stripe\Charge::create([
                                'amount' => $request->payment['amount'] * 100,
                                'currency' => 'usd',
                                'customer' => $customer_id,
                            ]);
                            $PaymentCard['customer_stripe_id'] =  $customer_id;
                        }

                        $PaymentSale = new PaymentSale();
                        $PaymentSale->sale_id = $order->id;
                        $PaymentSale->Ref = $order->Ref;
                        $PaymentSale->date = Carbon::now();
                        $PaymentSale->Reglement = $request->payment['Reglement'];
                        $PaymentSale->montant = $request->payment['amount'];
                        $PaymentSale->user_id = Auth::user()->id;
                        $PaymentSale->save();

                        $sale->update([
                            'paid_amount' => $total_paid,
                            'payment_statut' => $payment_statut,
                            'statut' => $payment_statut == 'paid' ? 'pending' : 'ordered',

                        ]);

                        $PaymentCard['customer_id'] = $request->client_id;
                        $PaymentCard['payment_id'] = $PaymentSale->id;
                        $PaymentCard['charge_id'] = $charge->id;
                        PaymentWithCreditCard::create($PaymentCard);

                        // Paying Method Cash
                    } else {

                        PaymentSale::create([
                            'sale_id' => $order->id,
                            'Ref' => $order->Ref,
                            'date' => Carbon::now(),
                            'Reglement' => $request->payment['Reglement'],
                            'montant' => $request->payment['amount'],
                            'user_id' => Auth::user()->id,
                        ]);

                        $sale->update([
                            'paid_amount' => $total_paid,
                            'payment_statut' => $payment_statut,
                            'statut' => $payment_statut == 'paid' ? 'pending' : 'ordered',

                        ]);
                    }
                } catch (Throwable $e) {
                    return response()->json(['message' => $e->getMessage()], 500);
                }
            }
        }, 10);

        return response()->json(['success' => true]);
    }


    //------------- UPDATE SALE -----------

    public function update(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Sale::class);

        request()->validate([
            'warehouse_id' => 'required',
            'client_id' => 'required',
        ]);

        DB::transaction(function () use ($request, $id) {
            $role = Auth::user()->roles->first();
            $view_records = Role::findOrFail($role->id)->inRole('record_view');
            $current_Sale = Sale::findOrFail($id);
            $client = Client::findOrFail($request->client_id);
            $taxRate = 0;
            $TaxNet = 0;
            $TaxWithheld = 0;
            $TaxNetDetail = 0;
            $TaxMethod = 2;
            $GrandTotal = $request['GrandTotal'];
            $TotalFinal = $request['GrandTotal'] - $request['shipping'];

            if ($client->final_consumer === 0) {
                $taxRate = 13;
                $TaxNet = round($TotalFinal - ($TotalFinal / 1.13), 2);
                if ($client->big_consumer == 1 and round($TotalFinal / 1.13, 2) >= 100) {
                    $TaxWithheld = round((($TotalFinal / 1.13) * 0.01), 2);
                    $GrandTotal = $TotalFinal - $TaxWithheld;
                }
            }

            // Check If User Has Permission view All Records
            if (!$view_records) {
                // Check If User->id === Sale->id
                $this->authorizeForUser($request->user('api'), 'check_record', $current_Sale);
            }
            $old_sale_details = SaleDetail::where('sale_id', $id)->get();
            $new_sale_details = $request['details'];
            $length = sizeof($new_sale_details);

            // Get Ids for new Details
            $new_products_id = [];
            foreach ($new_sale_details as $new_detail) {
                $new_products_id[] = $new_detail['id'];
            }

            // Init Data with old parameter
            $old_products_id = [];
            foreach ($old_sale_details as $key => $value) {
                $old_products_id[] = $value->id;
                $unit = Product::with('unitSale')
                    ->where('id', $value['product_id'])
                    ->where('deleted_at', '=', null)
                    ->first();

                if ($current_Sale->statut == "completed") {

                    if ($value['product_variant_id'] !== null) {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $current_Sale->warehouse_id)
                            ->where('product_id', $value['product_id'])
                            ->where('product_variant_id', $value['product_variant_id'])
                            ->first();

                        if ($unit && $product_warehouse) {
                            if ($unit['unitSale']->operator == '/') {
                                $product_warehouse->qte += $value['quantity'] / $unit['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte += $value['quantity'] * $unit['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    } else {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $current_Sale->warehouse_id)
                            ->where('product_id', $value['product_id'])
                            ->first();
                        if ($unit && $product_warehouse) {
                            if ($unit['unitSale']->operator == '/') {
                                $product_warehouse->qte += $value['quantity'] / $unit['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte += $value['quantity'] * $unit['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    }
                }
                // Delete Detail
                if (!in_array($old_products_id[$key], $new_products_id)) {
                    $SaleDetail = SaleDetail::findOrFail($value->id);
                    $SaleDetail->delete();
                }
            }

            // Update Data with New request
            foreach ($new_sale_details as $key => $prod_detail) {

                $unit_prod = Product::with('unitSale')
                    ->where('id', $prod_detail['product_id'])
                    ->where('deleted_at', '=', null)
                    ->first();

                if ($request['statut'] == "completed") {

                    if ($prod_detail['product_variant_id'] !== null) {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $request->warehouse_id)
                            ->where('product_id', $prod_detail['product_id'])
                            ->where('product_variant_id', $prod_detail['product_variant_id'])
                            ->first();

                        if ($unit_prod && $product_warehouse) {
                            if ($unit_prod['unitSale']->operator == '/') {
                                $product_warehouse->qte -= $prod_detail['quantity'] / $unit_prod['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte -= $prod_detail['quantity'] * $unit_prod['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    } else {
                        $product_warehouse = ProductWarehouse::where('deleted_at', '=', null)
                            ->where('warehouse_id', $request->warehouse_id)
                            ->where('product_id', $prod_detail['product_id'])
                            ->first();

                        if ($unit_prod && $product_warehouse) {
                            if ($unit_prod['unitSale']->operator == '/') {
                                $product_warehouse->qte -= $prod_detail['quantity'] / $unit_prod['unitSale']->operator_value;
                            } else {
                                $product_warehouse->qte -= $prod_detail['quantity'] * $unit_prod['unitSale']->operator_value;
                            }
                            $product_warehouse->update();
                        }
                    }
                }
                $price = $prod_detail['Unit_price'] + $prod_detail['tax_percent'];
                $TaxMethod = 2;
                if ($client->final_consumer === 0) {
                    $TaxNetDetail = round($price - ($price / 1.13), 2);
                    $price = $price - $TaxNetDetail;
                    $TaxMethod = 1;
                }

                $orderDetails['sale_id'] = $id;
                $orderDetails['price'] = $price;
                $orderDetails['TaxNet'] = $TaxNetDetail;
                $orderDetails['tax_method'] = $TaxMethod;
                $orderDetails['discount'] = $prod_detail['discount'];
                $orderDetails['discount_method'] = $prod_detail['discount_Method'];
                $orderDetails['quantity'] = $prod_detail['quantity'];
                $orderDetails['product_id'] = $prod_detail['product_id'];
                $orderDetails['product_variant_id'] = $prod_detail['product_variant_id'];
                $orderDetails['total'] = $prod_detail['subtotal'];

                if (!in_array($prod_detail['id'], $old_products_id)) {
                    $orderDetails['date'] = Carbon::now();
                    SaleDetail::Create($orderDetails);
                } else {
                    SaleDetail::where('id', $prod_detail['id'])->update($orderDetails);
                }
            }

            $due = $request['GrandTotal'] - $current_Sale->paid_amount;
            if ($due === 0.0 || $due < 0.0) {
                $payment_statut = 'paid';
            } else if ($due != $request['GrandTotal']) {
                $payment_statut = 'partial';
            } else if ($due == $request['GrandTotal']) {
                $payment_statut = 'unpaid';
            }
            if ($request['discount'] == ".00" || $request['discount'] == "") {
                $request['discount'] = 0;
            }
            if ($request['shipping'] == ".00" || $request['shipping'] == "") {
                $request['shipping'] = 0;
            }
            $current_Sale->update([
                'date' => $request['date'],
                'client_id' => $request['client_id'],
                'warehouse_id' => $request['warehouse_id'],
                'notes' => $request['notes'],
                'statut' => $request['statut'],
                'tax_rate' => $taxRate,
                'TaxNet' => $TaxNet,
                'TaxWithheld' => $TaxWithheld,
                'discount' => $request['discount'],
                'shipping' => $request['shipping'],
                'GrandTotal' => $GrandTotal,
                'payment_statut' => $payment_statut,
            ]);
        }, 10);

        return response()->json(['success' => true]);
    }
    //------------- UPDATE SALE TO CREATED PAYMENT s-----------

    public function update_to_payment(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Sale::class);
        $current_Sale = Sale::with('details.product.unitSale')->findOrFail($id);
        $company = Setting::where('deleted_at', '=', null)->first();
        $user = Auth::user();
        $payments_sale = PaymentSale::where('deleted_at', '=', null)->where('sale_id', $id)->get();
        $payment_statut = 'paid';

        foreach ($current_Sale["details"] as $iKey => $sale_details) {
            $unit = json_decode(json_encode(DB::table("products")
                ->where("id", "=", $sale_details["product_id"])
                ->where("deleted_at", "=", null)
                ->first()), true);

            $unit["unitSale"] = json_decode(json_encode(DB::table("units")->where("id", $unit["unit_sale_id"])->first()), true);

            if ($sale_details["product_variant_id"] !== null) {
                $productWarehouse = ProductWarehouse::where("deleted_at", '=', null)
                    ->where("warehouse_id", $current_Sale->warehouse_id)
                    ->where("product_id", $sale_details["product_id"])
                    ->where("product_variant_id", $sale_details["product_variant_id"])
                    ->first();

                if ($unit && $productWarehouse) {
                    if ($unit["unitSale"]["operator"] == "/")
                        $productWarehouse->qte -= $sale_details["quantity"] / $unit["unitSale"]["operator_value"];
                    else
                        $productWarehouse->qte -= $sale_details["quantity"] * $unit["unitSale"]["operator_value"];

                    $productWarehouse->update();
                }
            } else {
                $productWarehouse = ProductWarehouse::where("deleted_at", '=', null)
                    ->where("warehouse_id", '=', $current_Sale->warehouse_id)
                    ->where("product_id", '=', $sale_details["product_id"])
                    ->first();

                if ($unit && $productWarehouse) {
                    if ($unit["unitSale"]["operator"] == "/")
                        $productWarehouse->qte -= $sale_details["quantity"] / $unit["unitSale"]["operator_value"];
                    else
                        $productWarehouse->qte -= $sale_details["quantity"] * $unit["unitSale"]["operator_value"];

                    $productWarehouse->update();
                }
            }
        }

        if ($request['amount'] > 0) {
            $PaymentSale = new PaymentSale();
            $PaymentSale->sale_id = $id;
            $PaymentSale->Ref = $request['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
            $PaymentSale->date = Carbon::now();
            $PaymentSale->Reglement = $request['Reglement'];
            $PaymentSale->montant = $request['amount'];
            $PaymentSale->user_id = Auth::user()->id;
            $PaymentSale->save();
        }
        $current_Sale->update([
            'notes' => $request['notes'],
            'statut' => 'pending',
            'discount' => $request['discount'],
            'change' => $request['change'],
            'cash' => $request['cash'],
            'shipping' => $request['shipping'],
            'GrandTotal' => $request['GrandTotal'],
            'payment_statut' => $payment_statut,
            'paid_amount' => $request['GrandTotal'],
            'refBankTransfer' => $request['RefTransfer'],
            'refCreditCard' => $request['RefCreditCard'],
            'type_invoice' => $request['type_invoice'],
            'Ref' => $request['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1,
            'refInvoice' => $request['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1,
        ]);
        $invoiceRef = $request['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
        if ($request['type_invoice'] == 'CF') {
            $company->update([
                'current_invoiceCF' => $current_Sale['refInvoice']
            ]);
        } else {
            $company->update([
                'current_invoiceCCF' => $current_Sale['refInvoice']
            ]);
        }

        if ($payments_sale) {
            foreach ($payments_sale as $paySale) {
                $paySale->Ref = $invoiceRef;
                $paySale->update();
            }
        }

        return response()->json(['success' => true]);
    }
    //------------- UPDATE STATUS SALE -----------

    public function update_status(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Sale::class);
        $current_Sale = Sale::findOrFail($id);
        $current_Sale->update([
            'statut' => $request['statut'],
        ]);
        return response()->json(['success' => true]);
    }

    //------------- Remove SALE BY ID -----------\\

    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Sale::class);

        DB::transaction(function () use ($id, $request) {
            $role = Auth::user()->roles->first();
            $view_records = Role::findOrFail($role->id)->inRole('record_view');
            $Sale = Sale::findOrFail($id);

            // Check If User Has Permission view All Records
            if (!$view_records) {
                // Check If User->id === Sale->id
                $this->authorizeForUser($request->user('api'), 'check_record', $Sale);
            }
            $Sale->details()->delete();
            $Sale->delete();
            $Payment_Sale_data = PaymentSale::where('sale_id', $id)->get();
            foreach ($Payment_Sale_data as $Payment_Sale) {
                if ($Payment_Sale->Reglement == 'credit card') {
                    $PaymentWithCreditCard = PaymentWithCreditCard::where('payment_id', $Payment_Sale->id)->first();
                    if ($PaymentWithCreditCard) {
                        $PaymentWithCreditCard->delete();
                    }
                }
                $Payment_Sale->delete();
            }
        }, 10);

        return response()->json(['success' => true]);
    }

    //-------------- Delete by selection  ---------------\\

    public function delete_by_selection(Request $request)
    {

        $this->authorizeForUser($request->user('api'), 'delete', Sale::class);

        DB::transaction(function () use ($request) {
            $role = Auth::user()->roles->first();
            $view_records = Role::findOrFail($role->id)->inRole('record_view');
            $selectedIds = $request->selectedIds;
            foreach ($selectedIds as $sale_id) {

                $Sale = Sale::findOrFail($sale_id);
                // Check If User Has Permission view All Records
                if (!$view_records) {
                    // Check If User->id === Sale->id
                    $this->authorizeForUser($request->user('api'), 'check_record', $Sale);
                }
                $Sale->details()->delete();
                $Sale->update([
                    'deleted_at' => Carbon::now(),
                ]);

                $Payment_Sale_data = PaymentSale::where('sale_id', $sale_id)->get();
                foreach ($Payment_Sale_data as $Payment_Sale) {
                    if ($Payment_Sale->Reglement == 'credit card') {
                        $PaymentWithCreditCard = PaymentWithCreditCard::where('payment_id', $Payment_Sale->id)->first();
                        if ($PaymentWithCreditCard) {
                            $PaymentWithCreditCard->delete();
                        }
                    }
                    $Payment_Sale->delete();
                }
            }
        }, 10);

        return response()->json(['success' => true]);
    }

    //------------- EXPORT  SALE to EXCEL-----------\\

    public function exportExcel(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Sale::class);
        return Excel::download(new SalesExport, 'List_Sales.xlsx');
    }

    //---------------- Get Details Sale-----------------\\

    public function show(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'view', Sale::class);
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $sale_data = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);

        $details = array();

        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === sale->id
            $this->authorizeForUser($request->user('api'), 'check_record', $sale_data);
        }

        $sale_details['Ref'] = $sale_data->Ref;
        $sale_details['TaxWithheld'] = $sale_data->TaxWithheld;
        $sale_details['date'] = $sale_data->date;
        $sale_details['statut'] = $sale_data->statut;
        $sale_details['warehouse'] = $sale_data['warehouse']->name;
        $sale_details['discount'] = $sale_data->discount;
        if ($sale_details['discount'] == ".00" || $sale_details['discount'] == "") {
            $sale_details['discount'] = 0.0;
        }
        $sale_details['shipping'] = $sale_data->shipping;
        if ($sale_details['shipping'] == ".00" || $sale_details['shipping'] == "") {
            $sale_details['shipping'] = 0.0;
        }
        $sale_details['tax_rate'] = $sale_data->tax_rate;
        $sale_details['TaxNet'] = $sale_data->TaxNet;
        $sale_details['client_name'] = $sale_data['client']->name;
        $sale_details['client_phone'] = $sale_data['client']->phone;
        $sale_details['client_adr'] = $sale_data['client']->adresse;
        $sale_details['client_email'] = $sale_data['client']->email;
        $sale_details['big_consumer'] = $sale_data['client']->big_consumer;
        $sale_details['final_consumer'] = $sale_data['client']->final_consumer;
        $sale_details['GrandTotal'] = $sale_data->GrandTotal;
        $sale_details['paid_amount'] = $sale_data->paid_amount;
        $sale_details['due'] = $sale_data->GrandTotal - $sale_data->paid_amount;
        $sale_details['payment_statut'] = $sale_data->payment_statut;
        $sale_details['created_at'] = date_format($sale_data['created_at'], 'Y-m-d H:i a');
        foreach ($sale_data['details'] as $detail) {
            if ($detail->product_variant_id) {

                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->first();

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            } else {

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            }

            if ($detail->discount_method == '2') {
                $data['DiscountNet'] = ($detail->discount / $detail->quantity);
            } else {
                $data['DiscountNet'] = $detail->price * ($detail->discount / $detail->quantity) / 100;
            }

            $data['Unit_price'] = $detail->price;
            $data['discount'] = ($detail->discount / $detail->quantity);

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] = ($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity);
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));                $data['taxe'] = ($data['Net_price'] - $detail->price) * $detail->quantity;
                $data['taxe'] = ($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity;
            }

            $details[] = $data;
        }

        $company = Setting::where('deleted_at', '=', null)->first();
        return response()->json([
            'details' => $details,
            'sale' => $sale_details,
            'company' => $company,
        ]);
    }

    //-------------- Print Invoice ---------------\\

    public function Print_Invoice_POS(Request $request, $id)
    {
        $helpers = new helpers();
        $details = array();

        $sale = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);

        $Payment_Sale = PaymentSale::where('sale_id', '=', $sale->id)->first();
        $paymentSaleRecordsArray = (array)$Payment_Sale;

        $item['id'] = $sale->id;
        $item['Ref'] = $sale->Ref;
        $item['date'] = $sale->date;
        $item['created_at'] = $sale->created_at;
        $item['discount'] = $sale->discount;
        $item['shipping'] = $sale->shipping;
        $item['taxe'] = $sale->TaxNet;
        $item['tax_rate'] = $sale->tax_rate;
        $item['TaxWithheld'] = $sale->TaxWithheld;
        $item['seller'] = $sale['user']->firstname . " " . $sale['user']->lastname;
        $item['client_name'] = $sale['client']->name;
        $item['client_phone'] = $sale['client']->phone;
        $item['client_NIT'] = $sale['client']->NIT;
        $item['client_DUI'] = $sale['client']->DUI;
        $item['client_NRC'] = $sale['client']->NRC;
        $item['client_giro'] = $sale['client']->giro;
        $item['final_consumer'] = $sale['client']->final_consumer;
        $item['big_consumer'] = $sale['client']->big_consumer;
        $item['client_adresse'] = $sale['client']->adresse;
        $item['client_country'] = $sale['client']->country;
        $item['client_city'] = $sale['client']->city;
        $item['GrandTotal'] = $sale->GrandTotal;
        $item['type_invoice'] = $sale->type_invoice;
        $item['refInvoice'] = $sale->refInvoice;
        $item['Reglement'] = (count($paymentSaleRecordsArray) > 0) ? $Payment_Sale["Reglement"] : null;

        foreach ($sale['details'] as $detail) {
            if ($detail->product_variant_id) {

                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->first();

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['Net_price'] = $detail->price;
                $data['TaxNet'] = $detail->TaxNet;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            } else {
                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['TaxNet'] = $detail->TaxNet;
                $data['Net_price'] = $detail->price;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            }
            $details[] = $data;
        }

        $settings = Setting::where('deleted_at', '=', null)->first();
        $symbol = $helpers->Get_Currency();

        return response()->json([
            'symbol' => $symbol,
            'setting' => $settings,
            'sale' => $item,
            'details' => $details,
        ]);
    }

    //------------- GET PAYMENTS SALE -----------\\

    public function Payments_Sale(Request $request, $id)
    {

        $this->authorizeForUser($request->user('api'), 'view', PaymentSale::class);
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $Sale = Sale::findOrFail($id);

        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === Sale->id
            $this->authorizeForUser($request->user('api'), 'check_record', $Sale);
        }

        $payments = PaymentSale::with('sale')
            ->where('sale_id', $id)
            ->where(function ($query) use ($view_records) {
                if (!$view_records) {
                    return $query->where('user_id', '=', Auth::user()->id);
                }
            })->orderBy('id', 'DESC')->get();

        return response()->json($payments);
    }

    //------------- Reference Number Order SALE -----------\\

    public function getNumberOrder()
    {

        $last = DB::table('sales')->latest('id')->first();

        if ($last) {
            $item = $last->Ref;
            $nwMsg = explode("_", $item);
            $inMsg = $nwMsg[1] + 1;
            $code = $nwMsg[0] . '_' . $inMsg;
        } else {
            $code = 'SL_1111';
        }
        return $code;
    }

    //------------- SALE PDF -----------\\

    public function Sale_PDF(Request $request, $id)
    {
        $details = array();
        $helpers = new helpers();
        $sale_data = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);

        $sale['client_name'] = $sale_data['client']->name;
        $sale['client_phone'] = $sale_data['client']->phone;
        $sale['client_adr'] = $sale_data['client']->adresse;
        $sale['client_email'] = $sale_data['client']->email;
        $sale['TaxNet'] = number_format($sale_data->TaxNet, 2, '.', '');
        $sale['discount'] = number_format($sale_data->discount, 2, '.', '');
        $sale['shipping'] = number_format($sale_data->shipping, 2, '.', '');
        $sale['statut'] = $sale_data->statut;
        $sale['Ref'] = $sale_data->Ref;
        $sale['date'] = $sale_data->date;
        $sale['GrandTotal'] = number_format($sale_data->GrandTotal, 2, '.', '');
        $sale['payment_statut'] = $sale_data->payment_statut;
        $detail_id = 0;

        foreach ($sale_data['details'] as $detail) {
            if ($detail->product_variant_id) {
                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                ->where('id', $detail->product_variant_id)->first();

                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
            } else
                $data['code'] = $detail['product']['code'];

            $data['detail_id'] = $detail_id += 1;
            $data['quantity'] = $detail->quantity;
            $data['total'] = number_format($detail->total, 2, '.', '');
            $data['name'] = $detail['product']['name'];
            $data['unitSale'] = $detail['product']['unitSale']->ShortName;
            $data['price'] = number_format($detail->price, 2, '.', '');

            if ($detail->discount_method == '2')
                $data['DiscountNet'] = number_format(($detail->discount / $detail->quantity), 2, '.', '');
            else
                $data['DiscountNet'] = number_format($detail->price * ($detail->discount / $detail->quantity) / 100, 2, '.', '');

            $data['Unit_price'] = number_format($detail->price, 2, '.', '');
            $data['discount'] = number_format(($detail->discount / $detail->quantity), 2, '.', '');

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] = number_format((($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity)), 2, '.', '');
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));;
                $data['taxe'] = number_format((($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity), 2, '.', '');
            }

            $details[] = $data;
        }
        $settings = Setting::where('deleted_at', '=', null)->first();
        $symbol = $helpers->Get_Currency();

        $pdf = PDF::loadview(
            "pdf.sale_pdf",
            [
                'symbol' => $symbol,
                'setting' => $settings,
                'sale' => $sale,
                'details' => $details,
            ]
        );

        return $pdf->download('Sale.pdf');
    }

    //----------------Show Form Create Sale ---------------\\

    public function create(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Sale::class);

        $warehouses = Warehouse::where('deleted_at', '=', null)->get(['id', 'name']);
        $clients = Client::where('deleted_at', '=', null)->get(['id', 'name']);
        $stripe_key = config('app.STRIPE_KEY');

        return response()->json([
            'stripe_key' => $stripe_key,
            'clients' => $clients,
            'warehouses' => $warehouses,
        ]);
    }

    //------------- Show Form Edit Sale -----------\\

    public function edit(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Sale::class);
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $Sale_data = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);
        $details = array();
        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === sale->id
            $this->authorizeForUser($request->user('api'), 'check_record', $Sale_data);
        }

        if ($Sale_data->client_id) {
            if (Client::where('id', $Sale_data->client_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $sale['client_id'] = $Sale_data->client_id;
            } else {
                $sale['client_id'] = '';
            }
        } else {
            $sale['client_id'] = '';
        }

        if ($Sale_data->warehouse_id) {
            if (Warehouse::where('id', $Sale_data->warehouse_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $sale['warehouse_id'] = $Sale_data->warehouse_id;
            } else {
                $sale['warehouse_id'] = '';
            }
        } else {
            $sale['warehouse_id'] = '';
        }

        $sale['date'] = $Sale_data->date;
        $sale['tax_rate'] = $Sale_data->tax_rate;
        $sale['TaxNet'] = $Sale_data->TaxNet;
        $sale['discount'] = $Sale_data->discount;
        $sale['shipping'] = $Sale_data->shipping;
        $sale['statut'] = $Sale_data->statut;
        $sale['notes'] = $Sale_data->notes;

        $detail_id = 0;
        foreach ($Sale_data['details'] as $detail) {
            $unit = Product::with('unitSale')->where('id', $detail->product_id)
                ->where('deleted_at', '=', null)->first();

            if ($detail->product_variant_id) {
                $item_product = ProductWarehouse::where('product_id', $detail->product_id)
                    ->where('deleted_at', '=', null)
                    ->where('product_variant_id', $detail->product_variant_id)
                    ->where('warehouse_id', $Sale_data->warehouse_id)
                    ->first();

                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->first();

                $item_product ? $data['del'] = 0 : $data['del'] = 1;

                $data['id'] = $detail->id;
                $data['detail_id'] = $detail_id += 1;
                $data['quantity'] = $detail->quantity;
                $data['product_id'] = $detail->product_id;
                $data['product_variant_id'] = $detail->product_variant_id;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['etat'] = 'current';
                $data['qte_copy'] = $detail->quantity;

                if ($unit && $unit['unitSale']->operator == '/') {
                    $data['stock'] = $item_product ? $item_product->qte * $unit['unitSale']->operator_value : 0;
                } else if ($unit && $unit['unitSale']->operator == '*') {
                    $data['stock'] = $item_product ? $item_product->qte / $unit['unitSale']->operator_value : 0;
                } else {
                    $data['stock'] = 0;
                }

                $data['unitSale'] = $detail['product']['unitSale']->ShortName;
            } else {
                $item_product = ProductWarehouse::where('product_id', $detail->product_id)
                    ->where('deleted_at', '=', null)->where('warehouse_id', $Sale_data->warehouse_id)
                    ->where('product_variant_id', '=', null)->first();

                $item_product ? $data['del'] = 0 : $data['del'] = 1;
                $data['id'] = $detail->id;
                $data['detail_id'] = $detail_id += 1;
                $data['quantity'] = $detail->quantity;
                $data['product_id'] = $detail->product_id;
                $data['total'] = $detail->total;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['product_variant_id'] = null;
                $data['etat'] = 'current';
                $data['qte_copy'] = $detail->quantity;

                if ($unit && $unit['unitSale']->operator == '/') {
                    $data['stock'] = $item_product ? $item_product->qte * $unit['unitSale']->operator_value : 0;
                } else if ($unit && $unit['unitSale']->operator == '*') {
                    $data['stock'] = $item_product ? $item_product->qte / $unit['unitSale']->operator_value : 0;
                } else {
                    $data['stock'] = 0;
                }

                $data['unitSale'] = $detail['product']['unitSale']->ShortName;
            }

            if ($detail->discount_method == '2') {
                $data['DiscountNet'] = ($detail->discount / $detail->quantity);
            } else {
                $data['DiscountNet'] = $detail->price * ($detail->discount / $detail->quantity) / 100;
            }

            $data['Unit_price'] = $detail->price;
            $data['tax_percent'] = $detail->TaxNet;
            $data['tax_method'] = $detail->tax_method;
            $data['discount'] = ($detail->discount / $detail->quantity);
            $data['discount_Method'] = $detail->discount_method;

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] = ($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity);
                $data['subtotal'] = ($data['Net_price'] * $data['quantity']) + (($data['Net_price'] - $detail->price) * $data['quantity']);
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));
                $data['taxe'] = ($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity;
                $data['subtotal'] = ($data['Net_price'] * $data['quantity']) + (($data['Net_price'] - $detail->price) * $data['quantity']);
            }

            $details[] = $data;
        }

        $warehouses = Warehouse::where('deleted_at', '=', null)->get(['id', 'name']);
        $clients = Client::where('deleted_at', '=', null)->get(['id', 'name']);

        return response()->json([
            'details' => $details,
            'sale' => $sale,
            'clients' => $clients,
            'warehouses' => $warehouses,
        ]);
    }

    //------------- SEND SALE TO EMAIL -----------\\

    public function Send_Email(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Sale::class);

        $sale = $request->all();
        $pdf = $this->Sale_PDF($request, $sale['id']);
        $this->Set_config_mail(); // Set_config_mail => BaseController
        $mail = Mail::to($request->to)->send(new SaleMail($sale, $pdf));
        return $mail;
    }

    //------------- Show Form Convert To Sale -----------\\

    public function Elemens_Change_To_Sale(Request $request, $id)
    {

        $this->authorizeForUser($request->user('api'), 'update', Quotation::class);
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $Quotation = Quotation::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);
        $details = array();
        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === Quotation->id
            $this->authorizeForUser($request->user('api'), 'check_record', $Quotation);
        }

        if ($Quotation->client_id) {
            if (Client::where('id', $Quotation->client_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $sale['client_id'] = $Quotation->client_id;
            } else {
                $sale['client_id'] = '';
            }
        } else {
            $sale['client_id'] = '';
        }

        if ($Quotation->warehouse_id) {
            if (Warehouse::where('id', $Quotation->warehouse_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $sale['warehouse_id'] = $Quotation->warehouse_id;
            } else {
                $sale['warehouse_id'] = '';
            }
        } else {
            $sale['warehouse_id'] = '';
        }

        $sale['date'] = $Quotation->date;
        $sale['TaxWithheld'] = $Quotation->TaxWithheld;
        $sale['TaxNet'] = $Quotation->TaxNet;
        $sale['tax_rate'] = $Quotation->tax_rate;
        $sale['discount'] = $Quotation->discount;
        $sale['shipping'] = $Quotation->shipping;
        $sale['statut'] = 'pending';
        $sale['notes'] = $Quotation->notes;

        $detail_id = 0;

        foreach ($Quotation['details'] as $detail) {
            $unit = Product::with('unitSale')->where('id', $detail->product_id)
                ->where('deleted_at', '=', null)->first();

            if ($detail->product_variant_id) {
                $item_product = ProductWarehouse::where('product_id', $detail->product_id)
                    ->where('product_variant_id', $detail->product_variant_id)
                    ->where('warehouse_id', $Quotation->warehouse_id)
                    ->where('deleted_at', '=', null)
                    ->first();
                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->where('deleted_at', null)->first();

                $data['id'] = $id;
                $data['detail_id'] = $detail_id += 1;
                $data['quantity'] = $detail->quantity;
                $data['product_id'] = $detail->product_id;
                $data['product_variant_id'] = $detail->product_variant_id;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['etat'] = 'current';
                $data['qte_copy'] = $detail->quantity;
                $item_product ? $data['del'] = 0 : $data['del'] = 1;

                if ($unit && $unit['unitSale']->operator == '/') {
                    $data['stock'] = $item_product ? $item_product->qte / $unit['unitSale']->operator_value : 0;
                } else if ($unit && $unit['unitSale']->operator == '*') {
                    $data['stock'] = $item_product ? $item_product->qte * $unit['unitSale']->operator_value : 0;
                } else {
                    $data['stock'] = 0;
                }

                $data['unitSale'] = $detail['product']['unitSale']->ShortName;
            } else {
                $item_product = ProductWarehouse::where('product_id', $detail->product_id)
                    ->where('warehouse_id', $Quotation->warehouse_id)
                    ->where('product_variant_id', '=', null)
                    ->where('deleted_at', '=', null)
                    ->first();

                $data['id'] = $id;
                $data['detail_id'] = $detail_id += 1;
                $data['quantity'] = $detail->quantity;
                $data['product_id'] = $detail->product_id;
                $data['total'] = $detail->total;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['product_variant_id'] = null;
                $data['etat'] = 'current';
                $data['qte_copy'] = $detail->quantity;
                $item_product ? $data['del'] = 0 : $data['del'] = 1;

                if ($unit && $unit['unitSale']->operator == '/') {
                    $data['stock'] = $item_product ? $item_product->qte * $unit['unitSale']->operator_value : 0;
                } else if ($unit && $unit['unitSale']->operator == '*') {
                    $data['stock'] = $item_product ? $item_product->qte / $unit['unitSale']->operator_value : 0;
                } else {
                    $data['stock'] = 0;
                }
                $data['unitSale'] = $detail['product']['unitSale']->ShortName;
            }

            if ($detail->discount_method == '2') {
                $data['DiscountNet'] = ($detail->discount / $detail->quantity);
            } else {
                $data['DiscountNet'] = $detail->price * ($detail->discount / $detail->quantity) / 100;
            }

            $data['Unit_price'] = $detail->price;
            $data['tax_percent'] = $detail->TaxNet;
            $data['tax_method'] = $detail->tax_method;
            $data['discount'] = ($detail->discount / $detail->quantity);
            $data['discount_Method'] = $detail->discount_method;

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] = ($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity);
                $data['subtotal'] = ($data['Net_price'] * $data['quantity']) + (($data['Net_price'] - $detail->price) * $data['quantity']);
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));
                $data['taxe'] = ($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity;
                $data['subtotal'] = ($data['Net_price'] * $data['quantity']) + (($data['Net_price'] - $detail->price) * $data['quantity']);
            }

            $details[] = $data;
        }

        $warehouses = Warehouse::where('deleted_at', '=', null)->get(['id', 'name']);
        $clients = Client::where('deleted_at', '=', null)->get(['id', 'name']);

        return response()->json([
            'details' => $details,
            'sale' => $sale,
            'clients' => $clients,
            'warehouses' => $warehouses,
        ]);
    }

    //-------------------Sms Notifications -----------------\\
    public function Send_SMS(Request $request)
    {
        $sale = Sale::where('deleted_at', '=', null)->findOrFail($request->id);
        $url = url('/Sale_PDF/' . $request->id);
        $receiverNumber = $sale['client']->phone;
        $message = "Dear" . ' ' . $sale['client']->name . " \n We are contacting you in regard to a invoice #" . $sale->Ref . ' ' . $url . ' ' . "that has been created on your account. \n We look forward to conducting future business with you.";
        try {

            $account_sid = env("TWILIO_SID");
            $auth_token = env("TWILIO_TOKEN");
            $twilio_number = env("TWILIO_FROM");

            $client = new Client_Twilio($account_sid, $auth_token);
            $client->messages->create($receiverNumber, [
                'from' => $twilio_number,
                'body' => $message
            ]);
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function SaleLessReturnsSave(Request $request, $id)
    {

        $saleAll = $this->SaleLessReturnsNoJson($id);
        $sale = $saleAll['sale'];
        $saleDetails = $saleAll['details'];
        $company = Setting::where('deleted_at', '=', null)->first();
        $user = Auth::user();
        $salePayment = PaymentSale::where('sale_id', $id)->first();
        $order = new Sale;
        $order->is_pos = 0;
        $order->date = $sale['date'];

        $order->client_id = $sale['client_id'];
        $order->GrandTotal = $sale['GrandTotal'];
        $order->subTotal = $sale['GrandTotal'];
        $order->paid_amount = $sale['paid_amount'];
        $order->warehouse_id = $sale['warehouse'];
        $order->tax_rate = $sale['tax_rate'];
        $order->TaxNet = $sale['TaxNet'];
        $order->TaxWithheld = $sale['TaxWithheld'];
        $order->discount = $sale['discount'];
        $order->shipping = $sale['shipping'];
        $order->statut = $sale['statut'];
        $order->payment_statut = $sale['payment_statut'];
        $order->notes = $sale['notes'];
        $order->refCreditCard = $sale['refCreditCard'];
        $order->refBankTransfer = $sale['refBankTransfer'];
        $order->type_invoice = $sale['type_invoice'];
        $order->Ref = $sale['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
        $order->refInvoice = $sale['type_invoice'] == 'CF' ? $user['currentCF'] + 1 : $user['currentCCF'] + 1;
        $order->user_id = Auth::user()->id;
        if ($sale['type_invoice'] == 'CF') {
            $company->update([
                'current_invoiceCF' =>  $order->refInvoice
            ]);
        } else {
            $company->update([
                'current_invoiceCCF' =>  $order->refInvoice
            ]);
        }
        $order->save();
        foreach ($saleDetails as $orderDetail) {
            $orderDetails[] = [
                'date' => $orderDetail['date'],
                'sale_id' => $order->id,
                'quantity' => $orderDetail['quantity'],
                'price' => $orderDetail['price'],
                'TaxNet' => $orderDetail['unit_sale'],
                'tax_method' => $orderDetail['tax_method'],
                'discount' => $orderDetail['discount'],
                'discount_method' => $orderDetail['discount_method'],
                'product_id' => $orderDetail['product_id'],
                'product_variant_id' => $orderDetail['product_variant_id'],
                'total' => $orderDetail['total'],
            ];
        }
        SaleDetail::insert($orderDetails);

        $sale = Sale::findOrFail($order->id);
        // Check If User Has Permission view All Records
        try {

            $total_paid = $sale->paid_amount;
            $due = $sale->GrandTotal - $total_paid;
            if ($due === 0.0 || $due < 0.0) {
                $payment_statut = 'paid';
            } else if ($due != $sale->GrandTotal) {
                $payment_statut = 'partial';
            } else if ($due == $sale->GrandTotal) {
                $payment_statut = 'unpaid';
            }

            if ($salePayment->Reglement == 'Tarjeta de Credito') {
                $Client = Client::whereId($order->client_id)->first();
                Stripe\Stripe::setApiKey(config('app.STRIPE_SECRET'));

                $PaymentWithCreditCard = PaymentWithCreditCard::where('customer_id', $order->client_id)->first();
                if (!$PaymentWithCreditCard) {
                    // Create a Customer
                    $customer = \Stripe\Customer::create([
                        'source' => $request->token,
                        'email' => $Client->email,
                    ]);

                    // Charge the Customer instead of the card:
                    $charge = \Stripe\Charge::create([
                        'amount' => $sale->paid_amount * 100,
                        'currency' => 'usd',
                        'customer' => $customer->id,
                    ]);
                    $PaymentCard['customer_stripe_id'] =  $customer->id;
                } else {
                    $customer_id = $PaymentWithCreditCard->customer_stripe_id;
                    $charge = \Stripe\Charge::create([
                        'amount' => $sale->paid_amount * 100,
                        'currency' => 'usd',
                        'customer' => $customer_id,
                    ]);
                    $PaymentCard['customer_stripe_id'] =  $customer_id;
                }

                $PaymentSale = new PaymentSale();
                $PaymentSale->sale_id = $order->id;
                $PaymentSale->Ref = $order->Ref;
                $PaymentSale->date = Carbon::now();
                $PaymentSale->Reglement = $salePayment->Reglement;
                $PaymentSale->montant = $sale->paid_amount;
                $PaymentSale->user_id = Auth::user()->id;
                $PaymentSale->save();

                $sale->update([
                    'paid_amount' => $total_paid,
                    'payment_statut' => $payment_statut,
                    'statut' => $payment_statut == 'paid' ? 'pending' : 'ordered',

                ]);

                $PaymentCard['customer_id'] = $order->client_id;
                $PaymentCard['payment_id'] = $PaymentSale->id;
                $PaymentCard['charge_id'] = $charge->id;
                PaymentWithCreditCard::create($PaymentCard);

                // Paying Method Cash
            } else {

                PaymentSale::create([
                    'sale_id' => $order->id,
                    'Ref' => $order->Ref,
                    'date' => Carbon::now(),
                    'Reglement' => $salePayment->Reglement,
                    'montant' => $sale->paid_amount,
                    'user_id' => Auth::user()->id,
                ]);

                $sale->update([
                    'paid_amount' => $total_paid,
                    'payment_statut' => $payment_statut,
                    'statut' => $payment_statut == 'paid' ? 'pending' : 'ordered',

                ]);
            }
        } catch (Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
        $saleOriginal = Sale::findOrFail($id);
        $saleOriginal->update([
            'deleted_at' => Carbon::now(),
            'statut' => $payment_statut,
            'statut' => 'nullByReturn'
        ]);
        $salePayment->update([
            'deleted_at' => Carbon::now(),
            'notes' => 'nullByReturn'
        ]);
        return response()->json(['success' => true, 'newId' => $order->id]);
    }

    public function SaleLessReturns($id)
    {

        /*         $this->authorizeForUser($request->user('api'), 'view', Sale::class); */
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $devoluciones = SaleReturn::where('ref_invoice', $id)->get();
        $totalDevolucion = 0;
        $totalDevolucionPaidAmount = 0;
        $detallesDevolucion = [];
        foreach ($devoluciones as $devolucion) {
            foreach ($devolucion['details'] as $detalle) {
                $devolucionData['product_id'] = $detalle->product_id;
                $devolucionData['price'] = $detalle->price;
                $devolucionData['total'] = $detalle->total;
                $devolucionData['TaxNet'] = $detalle->TaxNet;
                $devolucionData['quantity'] = $detalle->quantity;
                $detallesDevolucion[] = $devolucionData;
            }
            $totalDevolucion = $totalDevolucion + $devolucion->GrandTotal;
            $totalDevolucionPaidAmount = $totalDevolucionPaidAmount + $devolucion->paid_amount;
        }
        $sale_data = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);
        $details = array();

        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === sale->id
            /* $this->authorizeForUser($request->user('api'), 'check_record', $sale_data); */
        }
        $TaxWithheld = $sale_data->TaxWithheld;
        if ($sale_data->TaxWithheld > 0) {
            $TaxWithheld = $TaxWithheld - round((($totalDevolucion / 1.13) * 0.01), 2);
        }
        $TaxNet = $sale_data->TaxNet;
        $TaxNet = $TaxNet - round((($totalDevolucion / 1.13) * 0.01), 2);

        $sale_details['Ref'] = $sale_data->Ref;
        $sale_details['TaxWithheld'] = $TaxWithheld;
        $sale_details['date'] = $sale_data->date;
        $sale_details['statut'] = $sale_data->statut;
        $sale_details['warehouse'] = $sale_data['warehouse']->name;
        $sale_details['discount'] = $sale_data->discount;
        $sale_details['shipping'] = $sale_data->shipping;
        $sale_details['tax_rate'] = $sale_data->tax_rate;
        $sale_details['TaxNet'] = $TaxNet;
        $sale_details['client_name'] = $sale_data['client']->name;
        $sale_details['client_phone'] = $sale_data['client']->phone;
        $sale_details['client_adr'] = $sale_data['client']->adresse;
        $sale_details['client_email'] = $sale_data['client']->email;
        $sale_details['big_consumer'] = $sale_data['client']->big_consumer;
        $sale_details['final_consumer'] = $sale_data['client']->final_consumer;
        $sale_details['GrandTotal'] = $sale_data->GrandTotal - $totalDevolucion;
        $sale_details['paid_amount'] = $sale_data->paid_amount - $totalDevolucionPaidAmount;
        $sale_details['due'] = $sale_details['GrandTotal'] - $sale_details['paid_amount'];
        $sale_details['payment_statut'] = $sale_data->payment_statut;

        $sale_details['created_at'] = date_format($sale_data['created_at'], 'Y-m-d H:i a');
        foreach ($sale_data['details'] as $detail) {
            $data['product_id'] = $detail->product_id;
            if ($detail->product_variant_id) {

                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->first();

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            } else {

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
            }

            if ($detail->discount_method == '2') {
                $data['DiscountNet'] = ($detail->discount / $detail->quantity);
            } else {
                $data['DiscountNet'] = $detail->price * ($detail->discount / $detail->quantity) / 100;
            }

            $data['Unit_price'] = $detail->price;
            $data['discount'] = ($detail->discount / $detail->quantity);

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] =  ($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity);
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));
                $data['taxe'] = ($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity;
            }

            $details[] = $data;
        }
        $company = Setting::where('deleted_at', '=', null)->first();
        $varUnset = [];
        $contador = 0;
        foreach ($details as $detailSales) {
            foreach ($detallesDevolucion as $detailLess) {
                if ($detailLess['product_id'] === $detailSales['product_id']) {
                    if ($detailLess['quantity'] === $detailSales['quantity']) {
                        $varUnset[] = $contador;
                    } else {
                        $details[$contador]['quantity'] = $detailSales['quantity'] - $detailLess['quantity'];
                        $details[$contador]['total'] = $detailSales['total'] - $detailLess['total'];
                        $details[$contador]['taxe'] = $detailSales['taxe'] - $detailLess['TaxNet'];
                    }
                }
            }
            $contador++;
        }
        //Log::debug($details);
        //Log::debug($details);
        foreach ($varUnset as $unset) {
            unset($details[$unset]);
        }
        //Log::debug($details);
        return response()->json([
            'details' => $details,
            'sale' => $sale_details,
            'company' => $company
        ]);
    }
    public function SaleLessReturnsNoJson($id)
    {

        /*         $this->authorizeForUser($request->user('api'), 'view', Sale::class); */
        $role = Auth::user()->roles->first();
        $view_records = Role::findOrFail($role->id)->inRole('record_view');
        $devoluciones = SaleReturn::where('ref_invoice', $id)->get();
        $totalDevolucion = 0;
        $totalDevolucionPaidAmount = 0;
        $detallesDevolucion = [];
        foreach ($devoluciones as $devolucion) {
            foreach ($devolucion['details'] as $detalle) {
                $devolucionData['product_id'] = $detalle->product_id;
                $devolucionData['price'] = $detalle->price;
                $devolucionData['total'] = $detalle->total;
                $devolucionData['TaxNet'] = $detalle->TaxNet;
                $devolucionData['quantity'] = $detalle->quantity;
                $detallesDevolucion[] = $devolucionData;
            }
            $totalDevolucion = $totalDevolucion + $devolucion->GrandTotal;
            $totalDevolucionPaidAmount = $totalDevolucionPaidAmount + $devolucion->paid_amount;
        }
        $sale_data = Sale::with('details.product.unitSale')
            ->where('deleted_at', '=', null)
            ->findOrFail($id);
        $details = array();

        // Check If User Has Permission view All Records
        if (!$view_records) {
            // Check If User->id === sale->id
            /* $this->authorizeForUser($request->user('api'), 'check_record', $sale_data); */
        }
        $TaxWithheld = $sale_data->TaxWithheld;
        if ($sale_data->TaxWithheld > 0) {
            $TaxWithheld = $TaxWithheld - round((($totalDevolucion / 1.13) * 0.01), 2);
        }
        $TaxNet = $sale_data->TaxNet;
        $TaxNet = $TaxNet - round((($totalDevolucion / 1.13) * 0.01), 2);
        $sale_details['Ref'] = $sale_data->Ref;
        $sale_details['notes'] = $sale_data->notes;
        $sale_details['TaxWithheld'] = $TaxWithheld;
        $sale_details['date'] = $sale_data->date;
        $sale_details['statut'] = $sale_data->statut;
        $sale_details['warehouse'] = $sale_data->warehouse_id;
        $sale_details['discount'] = $sale_data->discount;
        $sale_details['shipping'] = $sale_data->shipping;
        $sale_details['tax_rate'] = $sale_data->tax_rate;
        $sale_details['TaxNet'] = $TaxNet;
        $sale_details['refCreditCard'] = $sale_data->refCreditCard;
        $sale_details['type_invoice'] = $sale_data->type_invoice;
        $sale_details['refBankTransfer'] = $sale_data->refBankTransfer;
        $sale_details['client_id'] = $sale_data->client_id;
        $sale_details['GrandTotal'] = $sale_data->GrandTotal - $totalDevolucion;
        $sale_details['paid_amount'] = $sale_data->paid_amount - $totalDevolucionPaidAmount;
        $sale_details['due'] = $sale_details['GrandTotal'] - $sale_details['paid_amount'];
        $sale_details['payment_statut'] = $sale_data->payment_statut;
        foreach ($sale_data['details'] as $detail) {
            $data['product_id'] = $detail->product_id;
            if ($detail->product_variant_id) {

                $productsVariants = ProductVariant::where('product_id', $detail->product_id)
                    ->where('id', $detail->product_variant_id)->first();

                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $productsVariants->name . '-' . $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
                $data['tax_method'] = $detail->tax_method;
                $data['discount_method'] = $detail->discount_method;
                $data['date'] = $detail->date;

                $data['product_variant_id'] = $detail->product_variant_id;
            } else {
                $data['discount_method'] = $detail->discount_method;
                $data['date'] = $detail->date;
                $data['tax_method'] = $detail['tax_method'];
                $data['quantity'] = $detail->quantity;
                $data['total'] = $detail->total;
                $data['code'] = $detail['product']['code'];
                $data['name'] = $detail['product']['name'];
                $data['price'] = $detail->price;
                $data['unit_sale'] = $detail['product']['unitSale']->ShortName;
                $data['product_variant_id'] = $detail->product_variant_id;
            }

            if ($detail->discount_method == '2') {
                $data['DiscountNet'] = ($detail->discount / $detail->quantity);
            } else {
                $data['DiscountNet'] = $detail->price * ($detail->discount / $detail->quantity) / 100;
            }

            $data['Unit_price'] = $detail->price;
            $data['discount'] = ($detail->discount / $detail->quantity);

            $originalPrice = round((float)json_decode(json_encode(DB::table("products")->where("id", "=", $detail['product']['id'])->pluck("price")->first()), true), 2);

            if ($detail->tax_method == '1') {
                $data['Net_price'] = ($detail->price < $originalPrice) ? $originalPrice - $data['DiscountNet'] : (($detail->price === $originalPrice) ? $detail->price - $data['DiscountNet'] : $detail->price);
                $data['taxe'] = ($data['total'] >= 100.00) ? 0.00 : (($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity);
            } else {
                $data['Net_price'] = ($detail->price < $originalPrice) ? (($originalPrice - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : (($detail->price === $originalPrice) ? (($detail->price - $data['DiscountNet']) / (($detail->TaxNet / 100) + 1)) : ($detail->price / (($detail->TaxNet / 100) + 1)));
                $data['taxe'] = ($data['Net_price'] >= $detail->price) ? ($data['Net_price'] - $detail->price) * $detail->quantity : ($detail->price - $data['Net_price']) * $detail->quantity;
            }

            $details[] = $data;
        }
        $company = Setting::where('deleted_at', '=', null)->first();
        $varUnset = [];
        $contador = 0;
        foreach ($details as $detailSales) {
            foreach ($detallesDevolucion as $detailLess) {
                if ($detailLess['product_id'] === $detailSales['product_id']) {
                    if ($detailLess['quantity'] === $detailSales['quantity']) {
                        $varUnset[] = $contador;
                    } else {
                        $details[$contador]['quantity'] = $detailSales['quantity'] - $detailLess['quantity'];
                        $details[$contador]['total'] = $detailSales['total'] - $detailLess['total'];
                        $details[$contador]['taxe'] = $detailSales['taxe'] - $detailLess['TaxNet'];
                    }
                }
            }
            $contador++;
        }
        foreach ($varUnset as $unset) {
            unset($details[$unset]);
        }
        return [
            'details' => $details,
            'sale' => $sale_details,
            'company' => $company,
        ];
    }
}
