<?php

namespace App\Http\Controllers;

use Throwable;
use Illuminate\Support\Str;
use App\Exports\ProductsExport;
use App\Models\Brand;
use Illuminate\Support\Facades\Log;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use App\Models\ProductVariant;
use App\Models\ProductWarehouse;
use App\Models\Unit;
use App\Models\Warehouse;
use App\utils\helpers;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Http\Request;
use App\Http\Controllers\PosController;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Validation\ValidationException;
use App\Mail\ProductPriceModification;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Writer\Csv as CsvWriter;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use PhpOffice\PhpSpreadsheet\Reader\Xls as XlsReader;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;
use \Gumlet\ImageResize;

class ProductsController extends BaseController
{
    private $proceed_function = null;
    private const MAX_LINE_LENGTH = 10000;

    //------------ Get ALL Products --------------\\

    public function index(request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Product::class);
        // How many items do you want to display.
        $perPage = $request->limit;
        $pageStart = $request->get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $order = $request->SortField;
        $dir = $request->SortType;
        $helpers = new helpers();
        // Filter fields With Params to retrieve
        $columns = array(0 => 'name', 1 => 'category_id', 2 => 'brand_id', 3 => 'code');
        $param = array(0 => 'like', 1 => 'many>1', 2 => '=', 3 => 'like');
        $data = array();

        $products = Product::with('unit', 'categories', 'brand')->where('deleted_at', '=', null);

        //Multiple Filter
        $Filtred = $helpers->filter($products, $columns, $param, $request)
            // Search With Multiple Param
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('products.name', 'LIKE', "%$request->search%")
                        ->orWhere('products.code', 'LIKE', "%$request->search%")
                        ->orWhere(function ($query) use ($request) {
                            return $query->whereHas('brand', function ($q) use ($request) {
                                $q->where('name', 'LIKE', "%$request->search%");
                            }, '>=', 1);
                        }
                    );
                });
            }
        );
        $totalRows = $Filtred->count();
        $products = $Filtred->offset($offSet)
            ->limit($perPage)
            ->orderBy($order, $dir)
            ->get();

        foreach ($products as $product) {
            $item['id'] = $product->id;
            $item['code'] = $product->code;
            $item['name'] = $product->name;
            if (isset($product->categories[0])) {
                $categoriesProduct = "";

                foreach ($product->categories as $iKey => $itemCategory) {
                    if (count($product->categories) > 1)
                        $categoriesProduct .=  $itemCategory->name . (($iKey === count($product->categories) - 1) ? '' : ', ');
                    else
                        $categoriesProduct .=  $itemCategory->name;
                }

                $item['category'] =  $categoriesProduct;
            } else
                $item['category'] =  "";

            $item['brand'] = $product['brand'] ? $product['brand']["name"] : 'N/D';
            $item['unit'] = $product['unit']["ShortName"];
            $item['price'] = $product->price;

            $product_warehouse_data = ProductWarehouse::where('product_id', $product->id)
                ->where('deleted_at', '=', null)
                ->get();
            $total_qty = 0;

            foreach ($product_warehouse_data as $product_warehouse) {
                $total_qty += $product_warehouse->qte;
                $item['quantity'] = $total_qty;
            }

            $item['stock_alert'] = (isset($product->stock_alert) && !empty($product->stock_alert)) ? $product->stock_alert : 0;
            $item['note'] = (isset($product->note) && !empty($product->note)) ? $product->note : 'N/A';

            $firstimage = explode(',', $product->image);
            $item['image'] = $firstimage[0];
            $data[] = $item;
        }

        $warehouses = Warehouse::where('deleted_at', null)->get(['id', 'name']);
        $categories = Category::where('deleted_at', null)->get(['id', 'name']);
        $brands = Brand::where('deleted_at', null)->get(['id', 'name']);

        return response()->json([
            'warehouses' => $warehouses,
            'categories' => $categories,
            'brands' => $brands,
            'products' => $data,
            'totalRows' => $totalRows,
        ]);
    }

    public function resetStock(Request $request) {
        $this->authorizeForUser($request->user('api'), 'create', Product::class);

        $warehouseId = ($request->warehouse_id !== "null") ? (int)$request->warehouse_id : null;
        $resetAllWarehouses = $request->allWarehouses;

        try {
            $warehousesToReset = ($resetAllWarehouses === "yes") ? "todas las sucursales" : DB::table("warehouses")->where("id", '=', $warehouseId)->pluck("name")->first();

            if ($resetAllWarehouses === "yes") {
                DB::table("product_warehouse")->update(
                    [
                        "qte" => 0
                    ]
                );
            } else {
                DB::table("product_warehouse")->where("warehouse_id", '=', $warehouseId)->update(
                    [
                        "qte" => 0
                    ]
                );
            }

            $errors = null;
            $message = "¡Enhorabuena! Se han reiniciado la cantidad de existencias en $warehousesToReset de todos los productos.";

            return response()->json(
                [
                    "errors" => $errors,
                    "message" => $message,
                    "success" => true
                ]
            );
        }
        catch (Throwable $throwable)
        {
            $warehousesToReset = ($resetAllWarehouses === "yes") ? "todas las sucursales" : "la sucursal con ID $warehouseId";
            $message = "¡Oops! Ha habido un error al reiniciar la cantidad de existencias en $warehousesToReset de todos los productos.";
            $errors = $throwable->getMessage();

            return response()->json(
                [
                    "errors" => $errors,
                    "message" => $message,
                    "success" => false
                ]
            );
        }
    }

    //-------------- Store new  Product  ---------------\\

    public function store(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Product::class);

        try {
            $this->validate($request, [
                'code' => 'required|unique:products',
                'name' => 'required',
                'Type_barcode' => 'required',
                'price' => 'required',
                'category_id' => 'required',
                'tax_id' => 'required',
                'cost' => 'required',
                'unit_id' => 'required',
            ], [
                'code.unique' => 'This code already used. Generate Now',
                'code.required' => 'This field is required',
            ]);


            DB::transaction(function () use ($request) {
                //-- Create New Product
                $Product = new Product;

                //-- Field Required
                $Product->name = $request['name'];
                $Product->tipoItem = $request['tipoItem'];
                $Product->code = $request['code'];
                $Product->Type_barcode = $request['Type_barcode'];
                $Product->price = $request['price'];
                $Product->brand_id = $request['brand_id'];
                $Product->TaxNet = $request['TaxNet'] ? $request['TaxNet'] : 0;
                $Product->tax_method = $request['tax_method'];
                $Product->note = $request['note'];
                $Product->cost = $request['cost'];
                $Product->unit_id = $request['unit_id'];
                $Product->unit_sale_id = $request['unit_sale_id'];
                $Product->unit_purchase_id = $request['unit_purchase_id'];
                $Product->stock_alert = $request['stock_alert'] ? $request['stock_alert'] : 0;
                $Product->is_variant = $request['is_variant'] == 'true' ? 1 : 0;

                if ($request['images']) {
                    $files = $request['images'];

                    foreach ($files as $file) {
                        $fileData = ImageResize::createFromString(base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $file['path'])));
                        $fileData->resize(500, 500);
                        $name = rand(11111111, 99999999) . $file['name'];
                        $path = public_path() . '/images/products/';

                        file_put_contents($path . $name, $fileData);

                        $images[] = $name;
                    }

                    $filename = implode(",", $images);
                } else
                    $filename = 'no-image.png';

                $Product->image = $filename;
                $Product->save();

                foreach ($request["tax_id"] as $key => $taxId) {
                    DB::table("product_tax")->insert(
                        [
                            "productId" => $Product->id,
                            "taxConfigurationId" => $taxId,
                            "created_at" => date("Y-m-d H:i:s.v"),
                            "updated_at" => date("Y-m-d H:i:s.v")
                        ]
                    );
                }

                if ($request->get('category_id'))
                    $Product->categories()->sync($request['category_id']);

                // Store Variants Product
                if ($request['is_variant'] == 'true') {
                    foreach ($request['variants'] as $variant) {
                        $Product_variants_data[] = [
                            'product_id' => $Product->id,
                            'name' => $variant,
                        ];
                    }
                    ProductVariant::insert($Product_variants_data);
                }
                //--Store Product Warehouse
                $warehouses = Warehouse::where('deleted_at', null)->pluck('id')->toArray();
                if ($warehouses) {
                    $Product_variants = ProductVariant::where('product_id', $Product->id)
                        ->where('deleted_at', null)
                        ->get();
                    foreach ($warehouses as $warehouse) {
                        if ($request['is_variant'] == 'true') {
                            foreach ($Product_variants as $product_variant) {

                                $product_warehouse[] = [
                                    'product_id' => $Product->id,
                                    'warehouse_id' => $warehouse,
                                    'product_variant_id' => $product_variant->id,
                                ];
                            }
                        } else {
                            $product_warehouse[] = [
                                'product_id' => $Product->id,
                                'warehouse_id' => $warehouse,
                            ];
                        }
                    }
                    ProductWarehouse::insert($product_warehouse);
                }
            }, 10);

            return response()->json(['success' => true]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 422,
                'msg' => 'error',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    //-------------- Update Product  ---------------\\
    //-----------------------------------------------\\

    public function update(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Product::class);
        try {
            $this->validate($request, [
                'code' => 'required|unique:products',
                'code' => Rule::unique('products')->ignore($id),
                'name' => 'required',
                'Type_barcode' => 'required',
                'price' => 'required',
                'category_id' => 'required',
                'cost' => 'required',
                'unit_id' => 'required',
            ], [
                'code.unique' => 'This code already used. Generate Now',
                'code.required' => 'This field is required',
            ]);

            DB::transaction(function () use ($request, $id) {

                $Product = Product::where('id', $id)
                    ->where('deleted_at', '=', null)
                    ->first();

                //-- Update Product
                $Product->name = $request['name'];
                $Product->code = $request['code'];
                $Product->Type_barcode = $request['Type_barcode'];
                $Product->price = $request['price'];
                $Product->brand_id = $request['brand_id'];
                $Product->TaxNet = $request['TaxNet'];
                $Product->tax_method = $request['tax_method'];
                $Product->note = $request['note'];
                $Product->cost = $request['cost'];
                $Product->unit_id = $request['unit_id'];
                $Product->unit_sale_id = $request['unit_sale_id'] ? $request['unit_sale_id'] : $request['unit_id'];
                $Product->unit_purchase_id = $request['unit_purchase_id'] ? $request['unit_purchase_id'] : $request['unit_id'];
                $Product->stock_alert = $request['stock_alert'];
                $Product->is_variant = $request['is_variant'] == 'true' ? 1 : 0;

                //categories
                if ($request->get('category_id')) {
                    $Product->categories()->sync($request['category_id']);
                }

                // Store Variants Product
                $oldVariants = ProductVariant::where('product_id', $id)
                    ->where('deleted_at', null)
                    ->get();

                $warehouses = Warehouse::where('deleted_at', null)
                    ->pluck('id')
                    ->toArray();

                if ($request['is_variant'] == 'true') {

                    if ($oldVariants->isNotEmpty()) {
                        $new_variants_id = [];
                        $var = 'id';

                        foreach ($request['variants'] as $new_id) {
                            if (array_key_exists($var, $new_id)) {
                                $new_variants_id[] = $new_id['id'];
                            } else {
                                $new_variants_id[] = 0;
                            }
                        }

                        foreach ($oldVariants as $key => $value) {
                            $old_variants_id[] = $value->id;

                            // Delete Variant
                            if (!in_array($old_variants_id[$key], $new_variants_id)) {
                                $ProductVariant = ProductVariant::findOrFail($value->id);
                                $ProductVariant->deleted_at = Carbon::now();
                                $ProductVariant->save();

                                $ProductWarehouse = ProductWarehouse::where('product_variant_id', $value->id)
                                    ->update(['deleted_at' => Carbon::now()]);
                            }
                        }

                        foreach ($request['variants'] as $key => $variant) {
                            if (array_key_exists($var, $variant)) {

                                $ProductVariantDT = new ProductVariant;

                                //-- Field Required
                                $ProductVariantDT->product_id = $variant['product_id'];
                                $ProductVariantDT->name = $variant['text'];
                                $ProductVariantDT->qty = $variant['qty'];
                                $ProductVariantUP['product_id'] = $variant['product_id'];
                                $ProductVariantUP['name'] = $variant['text'];
                                $ProductVariantUP['qty'] = $variant['qty'];
                            } else {
                                $ProductVariantDT = new ProductVariant;

                                //-- Field Required
                                $ProductVariantDT->product_id = $id;
                                $ProductVariantDT->name = $variant['text'];
                                $ProductVariantDT->qty = 0.00;
                                $ProductVariantUP['product_id'] = $id;
                                $ProductVariantUP['name'] = $variant['text'];
                                $ProductVariantUP['qty'] = 0.00;
                            }

                            if (!in_array($new_variants_id[$key], $old_variants_id)) {
                                $ProductVariantDT->save();

                                //--Store Product warehouse
                                if ($warehouses) {
                                    foreach ($warehouses as $warehouse) {

                                        $product_warehouse[] = [
                                            'product_id' => $id,
                                            'warehouse_id' => $warehouse,
                                            'product_variant_id' => $ProductVariantDT->id,
                                        ];
                                    }
                                    ProductWarehouse::insert($product_warehouse);
                                }
                            } else {
                                ProductVariant::where('id', $variant['id'])->update($ProductVariantUP);
                            }
                        }
                    } else {
                        $ProducttWarehouse = ProductWarehouse::where('product_id', $id)
                            ->update([
                                'deleted_at' => Carbon::now(),
                            ]);

                        foreach ($request['variants'] as $variant) {
                            $product_warehouse_DT = [];
                            $ProductVarDT = new ProductVariant;

                            //-- Field Required
                            $ProductVarDT->product_id = $id;
                            $ProductVarDT->name = $variant['text'];
                            $ProductVarDT->save();

                            //-- Store Product warehouse
                            if ($warehouses) {
                                foreach ($warehouses as $warehouse) {

                                    $product_warehouse_DT[] = [
                                        'product_id' => $id,
                                        'warehouse_id' => $warehouse,
                                        'product_variant_id' => $ProductVarDT->id,
                                    ];
                                }

                                ProductWarehouse::insert($product_warehouse_DT);
                            }
                        }
                    }
                } else {
                    if ($oldVariants->isNotEmpty()) {
                        foreach ($oldVariants as $old_var) {
                            $var_old = ProductVariant::where('product_id', $old_var['product_id'])
                                ->where('deleted_at', null)
                                ->first();
                            $var_old->deleted_at = Carbon::now();
                            $var_old->save();

                            $ProducttWarehouse = ProductWarehouse::where('product_variant_id', $old_var['id'])
                                ->update([
                                    'deleted_at' => Carbon::now(),
                                ]);
                        }

                        if ($warehouses) {
                            foreach ($warehouses as $warehouse) {

                                $product_warehouse[] = [
                                    'product_id' => $id,
                                    'warehouse_id' => $warehouse,
                                    'product_variant_id' => null,
                                ];
                            }
                            ProductWarehouse::insert($product_warehouse);
                        }
                    }
                }

                if ($request['images'] === null) {

                    if ($Product->image !== null) {
                        foreach (explode(',', $Product->image) as $img) {
                            $pathIMG = public_path() . '/images/products/' . $img;
                            if (file_exists($pathIMG)) {
                                if ($img != 'no-image.png') {
                                    @unlink($pathIMG);
                                }
                            }
                        }
                    }
                    $filename = 'no-image.png';
                } else {
                    if ($Product->image !== null) {
                        foreach (explode(',', $Product->image) as $img) {
                            $pathIMG = public_path() . '/images/products/' . $img;
                            if (file_exists($pathIMG)) {
                                if ($img != 'no-image.png') {
                                    @unlink($pathIMG);
                                }
                            }
                        }
                    }
                    $files = $request['images'];
                    foreach ($files as $file) {
                        $fileData = ImageResize::createFromString(base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $file['path'])));
                        $fileData->resize(500, 500);
                        $name = rand(11111111, 99999999) . $file['name'];
                        $path = public_path() . '/images/products/';
                        $success = file_put_contents($path . $name, $fileData);
                        $images[] = $name;
                    }
                    $filename = implode(",", $images);
                }

                setlocale(LC_TIME, "sv_ES");

                $saleDetailsData = null;

                $stringOne = '[{' . '"email"' . ':"';
                $stringTwo = '"}]';
                $adminEmail = json_encode(DB::select('SELECT email FROM settings WHERE id = 1'));

                $data['email'] = str_replace($stringTwo, '', str_replace($stringOne, '', $adminEmail));
                $data['total_discount'] = null;
                $data['old_product_price'] = Product::where('id', '=', $id)->first()->getOriginal('price');
                $data['new_product_price'] = $Product->price;
                $data['firstname'] = auth()->user()->firstname;
                $data['lastname'] = auth()->user()->lastname;
                $data['date'] = Carbon::now()->locale('es')->isoFormat('dddd\, D \d\e MMMM \d\e\l Y');
                $data['time'] = date('h:i:s A');
                $data['name'] = $Product->name;

                if ($data['old_product_price'] != $data['new_product_price']) {
                    $this->Set_config_mail();
                    Mail::to($data['email'])->send(new ProductPriceModification($data, $saleDetailsData));
                }

                $Product->image = $filename;
                $Product->save();
            }, 10);

            return response()->json(['success' => $this->proceed_function]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 422,
                'msg' => 'error',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    //-------------- Remove Product  ---------------\\
    //-----------------------------------------------\\

    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Product::class);

        DB::transaction(function () use ($id) {

            $Product = Product::findOrFail($id);
            $Product->deleted_at = Carbon::now();
            $Product->save();

            foreach (explode(',', $Product->image) as $img) {
                $pathIMG = public_path() . '/images/products/' . $img;
                if (file_exists($pathIMG)) {
                    if ($img != 'no-image.png') {
                        @unlink($pathIMG);
                    }
                }
            }

            ProductWarehouse::where('product_id', $id)->update([
                'deleted_at' => Carbon::now(),
            ]);

            ProductVariant::where('product_id', $id)->update([
                'deleted_at' => Carbon::now(),
            ]);
        }, 10);

        return response()->json(['success' => true]);
    }

    //-------------- Delete by selection  ---------------\\

    public function delete_by_selection(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Product::class);

        DB::transaction(function () use ($request) {
            $selectedIds = $request->selectedIds;
            foreach ($selectedIds as $product_id) {

                $Product = Product::findOrFail($product_id);
                $Product->deleted_at = Carbon::now();
                $Product->save();

                foreach (explode(',', $Product->image) as $img) {
                    $pathIMG = public_path() . '/images/products/' . $img;
                    if (file_exists($pathIMG)) {
                        if ($img != 'no-image.png') {
                            @unlink($pathIMG);
                        }
                    }
                }

                ProductWarehouse::where('product_id', $product_id)->update([
                    'deleted_at' => Carbon::now(),
                ]);

                ProductVariant::where('product_id', $product_id)->update([
                    'deleted_at' => Carbon::now(),
                ]);
            }
        }, 10);

        return response()->json(['success' => true]);
    }

    //-------------- Export All Product to EXCEL  ---------------\\

    public function export_Excel(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Product::class);

        return Excel::download(new ProductsExport, 'Lista_de_Productos.xlsx', \Maatwebsite\Excel\Excel::XLSX,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="Lista_de_Productos.xlsx"',
            ]
        );
    }

    //--------------  Show Product Details ---------------\\

    public function Get_Products_Details(Request $request, $id)
    {

        $this->authorizeForUser($request->user('api'), 'view', Product::class);

        $Product = Product::where('deleted_at', '=', null)->findOrFail($id);
        $warehouses = Warehouse::where('deleted_at', '=', null)->get();

        $item['id'] = $Product["id"];
        $item['code'] = $Product["code"];
        $item['Type_barcode'] = $Product["Type_barcode"];
        $item['name'] = $Product->name;
        if (isset($Product->categories[0])) {
            $categoriesProduct = "";
            foreach ($Product->categories as $itemCategory) {
                $categoriesProduct .=  $itemCategory["name"] . ', ';
            }
            $item['category'] =  $categoriesProduct;
        } else {
            $item['category'] =  "";
        }
        $item['brand'] = $Product['brand'] ? $Product['brand']["name"] : 'N/D';
        $item['unit'] = $Product['unit']["ShortName"];
        $item['price'] = $Product["price"];
        $item['cost'] = $Product["cost"];
        $item['stock_alert'] = $Product["stock_alert"];
        $item['taxe'] = $Product["TaxNet"];
        $item['tax_method'] = $Product["tax_method"] = 1 ? 'Exclusive' : 'Inclusive';

        if ($Product->is_variant) {
            $item['is_variant'] = 'yes';
            $productsVariants = ProductVariant::where('product_id', $id)
                ->where('deleted_at', null)
                ->get();
            foreach ($productsVariants as $variant) {
                $item['ProductVariant'][] = $variant->name;

                foreach ($warehouses as $warehouse) {
                    $product_warehouse = DB::table('product_warehouse')
                        ->where('product_id', $id)
                        ->where('deleted_at', '=', null)
                        ->where('warehouse_id', $warehouse->id)
                        ->where('product_variant_id', $variant->id)
                        ->select(DB::raw('SUM(product_warehouse.qte) AS sum'))
                        ->first();

                    $war_var['mag'] = $warehouse->name;
                    $war_var['variant'] = $variant->name;
                    $war_var['qte'] = $product_warehouse->sum;
                    $item['CountQTY_variants'][] = $war_var;
                }
            }
        } else {
            $item['is_variant'] = 'no';
            $item['CountQTY_variants'] = [];
        }

        foreach ($warehouses as $warehouse) {
            $product_warehouse_data = DB::table('product_warehouse')
                ->where('deleted_at', '=', null)
                ->where('product_id', $id)
                ->where('warehouse_id', $warehouse->id)
                ->select(DB::raw('SUM(product_warehouse.qte) AS sum'))
                ->first();

            $war['mag'] = $warehouse->name;
            $war['qte'] = $product_warehouse_data->sum;
            $item['CountQTY'][] = $war;
        }

        if ($Product->image != '') {
            foreach (explode(',', $Product->image) as $img) {
                $item['images'][] = $img;
            }
        }

        $data[] = $item;

        return response()->json($data[0]);
    }

    //------------ Get products By Warehouse -----------------\\

    public function Products_by_Warehouse(request $request, $id)
    {
        $data = [];
        $product_warehouse_data = json_decode(
            json_encode(
                DB::table("product_warehouse")
                ->where('warehouse_id', '=', $id)
                ->where('deleted_at', '=', null)
                ->where(function ($query) use ($request)
                    {
                        if ($request->stock == '1')
                            return $query->where('qte', '>', 0);
                    }
                )->get()
            ),
            true
        );

        foreach ($product_warehouse_data as $pWRecord) {
            $p = json_decode(json_encode(DB::table("products")->where("id", $pWRecord["product_id"])->where("deleted_at", '=', null)->get()), true);
            $pV = json_decode(json_encode(DB::table("product_variants")->where("id", $pWRecord["product_variant_id"])->where("deleted_at", '=', null)->get()), true);

            $item['id'] = (isset($p)) ? ((count($p) > 0) ? $p[0]["id"] : null) : null;
            $item['name'] = (isset($p)) ? ((count($p) > 0) ? $p[0]["name"] : null) : null;

            if (isset($pV)) {
                if (count($pV) > 0) {
                    $item['product_variant_id'] = $pV["id"];
                    $item['code'] = $pV["name"] . (isset($p)) ? ((count($p) > 0) ? " - " . $p[0]["code"] : null) : null;
                    $item['Variant'] = $pV["name"];
                } else {
                    $item['product_variant_id'] = null;
                    $item['code'] = (isset($p)) ? ((count($p) > 0) ? $p[0]["code"] : null) : null;
                    $item['Variant'] = null;
                }
            } else {
                $item['product_variant_id'] = null;
                $item['code'] = (isset($p)) ? ((count($p) > 0) ? $p[0]["code"] : null) : null;
                $item['Variant'] = null;
            }

            $images = (isset($p)) ? ((count($p) > 0) ? ((!empty($p[0]["image"])) ? ((explode(',', $p[0]["image"]) !== false) ? explode(',', $p[0]["image"]) : null) : null) : null) : null;

            if (isset($images)) {
                $item['image'] = $images[0];
                $item['imageList'] = [];

                foreach ($images as $img) {
                    $item['imageList'][] = $img;
                }
            }

            $productPrice = (isset($p)) ? ((count($p) > 0) ? (double)$p[0]["price"] : null) : null;

            $pUS = (isset($p)) ? ((count($p) > 0) ? json_decode(json_encode(DB::table("units")->where("id", '=', $p[0]["unit_sale_id"])->where("deleted_at", '=', null)->get()), true) : null) : null;
            $pUP = (isset($p)) ? ((count($p) > 0) ? json_decode(json_encode(DB::table("units")->where("id", '=', $p[0]["unit_purchase_id"])->where("deleted_at", '=', null)->get()), true) : null) : null;

            if (isset($pUS)) {
                if (count($pUS) > 0) {
                    if ($pUS[0]["operator"] === '/') {
                        $item['qte_sale'] = $pWRecord["qte"] * $pUS[0]["operator_value"];
                        $price = ($productPrice / (float)$pUS[0]["operator_value"]);
                    } else {
                        $item['qte_sale'] = $pWRecord["qte"] / $pUS[0]["operator_value"];
                        $price = ($productPrice * (float)$pUS[0]["operator_value"]);
                    }
                }
            }

            if (isset($pUP)) {
                if (count($pUP)) {
                    if ($pUP[0]["operator"] === '/')
                        $item['qte_purchase'] = round($pWRecord["qte"] * $pUP[0]["operator_value"], 5);
                    else
                        $item['qte_purchase'] = round($pWRecord["qte"] / $pUP[0]["operator_value"], 5);
                }
            }

            $item['qte'] = $pWRecord["qte"];
            $item['unitSale'] = (isset($pUS)) ? ((count($pUS) > 0) ? $pUS[0]["ShortName"] : null) : null;
            $item['unitPurchase'] = (isset($pUP)) ? ((count($pUP) > 0) ? $pUP[0]["ShortName"] : null) : null;

            $item["product_qte_per_warehouse"] = [];
            $p_qte_per_w = 0;

            $warehouses = json_decode(json_encode(DB::table("warehouses")->where("deleted_at", '=', null)->get()), true);

            foreach ($warehouses as $iKey => $warehouse) {
                $product_qte_per_warehouse = json_decode(json_encode(DB::table("product_warehouse")->where('deleted_at', '=', null)->where("product_id", '=', $pWRecord["product_id"])->where("warehouse_id", '=', $warehouse["id"])->first()), true);
                $p_qte_per_w = (isset($product_qte_per_warehouse["qte"]) && !empty($product_qte_per_warehouse["qte"])) ? $product_qte_per_warehouse["qte"] : 0;

                array_push(
                    $item["product_qte_per_warehouse"],
                    [
                        "warehouse_name" => $warehouse["name"],
                        "qte_per_warehouse" => $p_qte_per_w
                    ]
                );
            }

            if (isset($p) && isset($price)) {
                if (count($p) > 0) {
                    if ($p[0]["TaxNet"] !== 0.00) {
                        if ($p[0]["tax_method"] === '1') {
                            //Exclusive
                            $tax_price = $price * $p[0]["TaxNet"] / 100;
                            $item['Net_price'] = ($price + $tax_price);
                        } else {
                            // Inclusive
                            $item['Net_price'] = $price;
                        }
                    } else
                        $item['Net_price'] = $price;
                }
            }

            if (isset($item["id"]) && isset($item["name"]) && isset($item["code"]) && isset($item["qte_sale"]) && isset($item["qte_purchase"]) && isset($item["unitSale"]) && isset($item["unitPurchase"]) && isset($item["product_qte_per_warehouse"]) && isset($item["Net_price"]))
                $data[] = $item;
        }

        return response()->json($data);
    }

    //------------ Get product By ID -----------------\\

    public function show($id)
    {
        $productId = $id;

        $dataOfProduct = json_decode(json_encode(Product::with("unit", "unitSale", "unitPurchase")->where("id", '=', $productId)->where("deleted_at", '=', null)->first()), true);

        $data = [];

        $item['id'] = $dataOfProduct['id'];
        $item['name'] = $dataOfProduct['name'];
        $item['Type_barcode'] = $dataOfProduct['Type_barcode'];
        $item['unit'] = $dataOfProduct['unit']["ShortName"];
        $item['unitPurchase'] = $dataOfProduct['unit_purchase']["ShortName"];
        $item['unitSale'] = $dataOfProduct['unit_sale']["ShortName"];
        $item['tax_method'] = $dataOfProduct['tax_method'];
        $item['tax_percent'] = $dataOfProduct['TaxNet'];

        if ($dataOfProduct['unit_sale']["operator"] == '/')
            $price = ($dataOfProduct['price'] / $dataOfProduct['unit_sale']["operator_value"]);
        else
            $price = ($dataOfProduct['price'] * $dataOfProduct['unit_sale']["operator_value"]);

        if ($dataOfProduct['unit_purchase']["operator"] == '/') {
            $cost = $dataOfProduct['cost'] / $dataOfProduct['unit_purchase']["operator_value"];
        } else {
            $cost = $dataOfProduct['cost'] * $dataOfProduct['unit_purchase']["operator_value"];
        }

        $item['Unit_cost'] = $cost;
        $item['Unit_price'] = $price;

        if ($dataOfProduct["TaxNet"] !== 0.0) {
            //Exclusive
            if ($dataOfProduct['tax_method'] == '1') {
                $tax_price = $price * $dataOfProduct['TaxNet'] / 100;
                $tax_cost = $cost * $dataOfProduct['TaxNet'] / 100;

                $item['Total_cost'] = $cost + $tax_cost;
                $item['Total_price'] = $price + $tax_price;
                $item['Net_cost'] = $cost;
                $item['Net_price'] = $price;
                $item['tax_price'] = $tax_price;
                $item['tax_cost'] = $tax_cost;

                // Inxclusive
            } else {
                $item['Total_cost'] = $cost;
                $item['Total_price'] = $price;
                $item['Net_cost'] = $cost / (($dataOfProduct['TaxNet'] / 100) + 1);
                $item['Net_price'] = $price / (($dataOfProduct['TaxNet'] / 100) + 1);
                $item['tax_cost'] = $item['Total_cost'] - $item['Net_cost'];
                $item['tax_price'] = $item['Total_price'] - $item['Net_price'];
            }
        } else {
            $item['Total_cost'] = $cost;
            $item['Total_price'] = $price;
            $item['Net_cost'] = $cost;
            $item['Net_price'] = $price;
            $item['tax_price'] = 0;
            $item['tax_cost'] = 0;
        }

        $data[] = $item;

        return response()->json($data[0]);
    }

    //---------- Get Products Details by Id -----------\\

    public function getProductsDetails(Request $request)
    {
        $productId = (!isset($request["id"]) && !isset($request->id)) ? null : ((isset($request["id"])) ? (int)$request["id"] : (int)$request->id);
        $warehouseId = (!isset($request["warehouse_id"]) && !isset($request->warehouse_id)) ? null : ((isset($request["warehouse_id"])) ? (int)$request["warehouse_id"] : (int)$request->warehouse_id);

        $discount = null;
        $productHasDiscount = false;

        $productPerWarehouse = (array)json_decode(json_encode(DB::table("product_warehouse")->where("product_id", '=', $productId)->where("warehouse_id", '=', $warehouseId)->where("qte", ">=", 0)->where("deleted_at", '=', null)->first(), true));
        $data = [];
        $item = null;

        if (isset($productPerWarehouse)) {
            if (is_array($productPerWarehouse)) {
                if (isset($productPerWarehouse["qte"]) && $productPerWarehouse["qte"] > 0) {
                    $dataOfProduct = json_decode(json_encode(Product::with("unit", "unitSale", "unitPurchase")->where("id", '=', $productId)->where("deleted_at", '=', null)->first()), true);

                    $item['id'] = $dataOfProduct['id'];
                    $item['name'] = $dataOfProduct['name'];
                    $item['Type_barcode'] = $dataOfProduct['Type_barcode'];
                    $item['unit'] = $dataOfProduct['unit']["ShortName"];
                    $item['unitPurchase'] = $dataOfProduct['unit_purchase']["ShortName"];
                    $item['unitSale'] = $dataOfProduct['unit_sale']["ShortName"];
                    $item['tax_method'] = $dataOfProduct['tax_method'];
                    $item['tax_percent'] = $dataOfProduct['TaxNet'];

                    $productPrice = (float)$dataOfProduct['price'];

                    $discount = (isset($productId) && isset($productPrice)) ? PosController::checkTimeAndGetDiscountPricePerProduct(date("Y-m-d"), date("H:i:s"), $productId, $productPrice, $warehouseId) : 0.00;
                    $productHasDiscount = $discount["product_has_discount"];
                    $discount = $discount["discount"];

                    if ($dataOfProduct['unit_sale']["operator"] === '/')
                        $price = round((($dataOfProduct['price'] / $dataOfProduct['unit_sale']["operator_value"]) - $discount), 2);
                    else
                        $price = round((($dataOfProduct['price'] * $dataOfProduct['unit_sale']["operator_value"]) - $discount), 2);

                    if ($dataOfProduct['unit_purchase']["operator"] == '/')
                        $cost = round(($dataOfProduct['cost'] / $dataOfProduct['unit_purchase']["operator_value"]), 2);
                    else
                        $cost = round(($dataOfProduct['cost'] * $dataOfProduct['unit_purchase']["operator_value"]), 2);

                    $item['Unit_cost'] = $cost;
                    $item['Unit_price'] = $price;

                    if ($dataOfProduct["TaxNet"] !== 0.0) {
                        if ($dataOfProduct['tax_method'] == '1') {
                            //Exclusive
                            $tax_price = $price * $dataOfProduct['TaxNet'] / 100;
                            $tax_cost = $cost * $dataOfProduct['TaxNet'] / 100;

                            $item['Total_cost'] = $cost + $tax_cost;
                            $item['Total_price'] = $price + $tax_price;
                            $item['Net_cost'] = $cost;
                            $item['Net_price'] = $price;
                            $item['tax_price'] = $tax_price;
                            $item['tax_cost'] = $tax_cost;
                        } else {
                            // Inclusive
                            $item['Total_cost'] = $cost;
                            $item['Total_price'] = $price;
                            $item['Net_cost'] = $cost / (($dataOfProduct['TaxNet'] / 100) + 1);
                            $item['Net_price'] = $price / (($dataOfProduct['TaxNet'] / 100) + 1);
                            $item['tax_cost'] = $item['Total_cost'] - $item['Net_cost'];
                            $item['tax_price'] = $item['Total_price'] - $item['Net_price'];
                        }
                    } else {
                        $item['Total_cost'] = $cost;
                        $item['Total_price'] = $price;
                        $item['Net_cost'] = $cost;
                        $item['Net_price'] = $price;
                        $item['tax_price'] = 0;
                        $item['tax_cost'] = 0;
                    }
                }
            }
        }

        $data[] = $item;

        $hasStock = (isset($data[0])) ? true : false;
        $data = ($hasStock) ? $data[0] : null;

        return response()->json(
            [
                "product_details" => $data,
                "product_has_discount" => $productHasDiscount,
                "product_discount" => $discount,
                "has_stock" => $hasStock
            ]
        );
    }

    //--------------  Product Quantity Alerts ---------------\\

    public function Products_Alert(request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Stock_Alerts', Product::class);

        $product_warehouse_data = ProductWarehouse::with('warehouse', 'product', 'productVariant')
            ->join('products', 'product_warehouse.product_id', '=', 'products.id')
            ->whereRaw('qte <= stock_alert')
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('warehouse'), function ($query) use ($request) {
                    return $query->where('warehouse_id', $request->warehouse);
                });
            })->where('product_warehouse.deleted_at', null)->get();

        $data = [];

        $productWarehouseDataArray = (array)$product_warehouse_data;
        if (count($productWarehouseDataArray) > 0) {
            foreach ($product_warehouse_data as $product_warehouse) {
                if ($product_warehouse["qte"] <= $product_warehouse['product']["stock_alert"]) {
                    $productWarehouse_productVariantName = (is_null($product_warehouse['productVariant']) || empty($product_warehouse['productVariant'])) ? "N/A" : $product_warehouse["productVariant"]["name"];

                    if ($product_warehouse["product_variant_id"] !== null)
                        $item['code'] = $productWarehouse_productVariantName . '-' . $product_warehouse['product']["code"];
                    else
                        $item['code'] = $product_warehouse['product']["code"];

                    $item['quantity'] = $product_warehouse["qte"];
                    $item['name'] = $product_warehouse['product']["name"];
                    $item['warehouse'] = (is_null($product_warehouse['warehouse']) || empty($product_warehouse['warehouse'])) ? "N/A" : $product_warehouse["warehouse"]["name"];
                    $item['stock_alert'] = $product_warehouse['product']["stock_alert"];
                    $data[] = $item;
                }
            }
        }

        $perPage = $request->limit; // How many items do you want to display.
        $pageStart = $request->get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $collection = collect($data);
        // Get only the items you need using array_slice
        $data_collection = $collection->slice($offSet, $perPage)->values();

        $products = new LengthAwarePaginator($data_collection, count($data), $perPage, Paginator::resolveCurrentPage(), array('path' => Paginator::resolveCurrentPath()));
        $warehouses = Warehouse::where('deleted_at', null)->get(['id', 'name']);

        return response()->json([
            'products' => $products,
            'warehouses' => $warehouses,
        ]);
    }


    //---------------- Show Form Create Product ---------------\\

    public function create(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Product::class);

        $categories = Category::where('deleted_at', null)->get(['id', 'name']);
        $brands = Brand::where('deleted_at', null)->get(['id', 'name']);
        $units = Unit::where('deleted_at', null)->where('base_unit', null)->get();
        $taxes = DB::table("taxes_configurations")->where("deleted_at", '=', null)->get(["id", "name"]);

        return response()->json([
            'taxes' => $taxes,
            'categories' => $categories,
            'brands' => $brands,
            'units' => $units
        ]);
    }

    //---------------- Show Elements Barcode ---------------\\

    public function Get_element_barcode(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'barcode', Product::class);

        $warehouses = Warehouse::where('deleted_at', null)->get(['id', 'name']);
        return response()->json(['warehouses' => $warehouses]);
    }

    //---------------- Show Form Edit Product ---------------\\

    public function edit(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Product::class);

        $Product = Product::where('deleted_at', '=', null)->findOrFail($id);

        $item['id'] = $Product->id;
        $item['code'] = $Product->code;
        $item['Type_barcode'] = $Product->Type_barcode;
        $item['name'] = $Product->name;
        $item['categories_id'] = $Product->categories;

        if ($Product->brand_id) {
            if (Brand::where('id', $Product->brand_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $item['brand_id'] = $Product->brand_id;
            } else {
                $item['brand_id'] = '';
            }
        } else {
            $item['brand_id'] = '';
        }

        if ($Product->unit_id) {
            if (Unit::where('id', $Product->unit_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $item['unit_id'] = $Product->unit_id;
            } else {
                $item['unit_id'] = '';
            }

            if (Unit::where('id', $Product->unit_sale_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $item['unit_sale_id'] = $Product->unit_sale_id;
            } else {
                $item['unit_sale_id'] = '';
            }

            if (Unit::where('id', $Product->unit_purchase_id)
                ->where('deleted_at', '=', null)
                ->first()
            ) {
                $item['unit_purchase_id'] = $Product->unit_purchase_id;
            } else {
                $item['unit_purchase_id'] = '';
            }
        } else {
            $item['unit_id'] = '';
        }

        $item['tax_method'] = $Product->tax_method;
        $item['price'] = $Product->price;
        $item['cost'] = $Product->cost;
        $item['stock_alert'] = $Product->stock_alert;
        $item['TaxNet'] = $Product->TaxNet;
        $item['note'] = $Product->note ? $Product->note : '';
        $item['images'] = [];
        if ($Product->image != '' && $Product->image != 'no-image.png') {
            foreach (explode(',', $Product->image) as $img) {
                $path = public_path() . '/images/products/' . $img;
                if (file_exists($path)) {
                    $itemImg['name'] = $img;
                    $type = pathinfo($path, PATHINFO_EXTENSION);
                    $data = file_get_contents($path);
                    $itemImg['path'] = 'data:image/' . $type . ';base64,' . base64_encode($data);

                    $item['images'][] = $itemImg;
                }
            }
        } else {
            $item['images'] = [];
        }
        if ($Product->is_variant) {
            $item['is_variant'] = true;
            $productsVariants = ProductVariant::where('product_id', $id)
                ->where('deleted_at', null)
                ->get();
            foreach ($productsVariants as $variant) {
                $variant_item['id'] = $variant->id;
                $variant_item['text'] = $variant->name;
                $variant_item['qty'] = $variant->qty;
                $variant_item['product_id'] = $variant->product_id;
                $item['ProductVariant'][] = $variant_item;
            }
        } else {
            $item['is_variant'] = false;
            $item['ProductVariant'] = [];
        }

        $data = $item;
        $categories = Category::where('deleted_at', null)->get(['id', 'name']);
        $brands = Brand::where('deleted_at', null)->get(['id', 'name']);
        $units_sub = [];
        $units_F = Unit::where('id', $Product->unit_id)->where('deleted_at', null)->first();

        $u_sub = Unit::where('base_unit', $Product->unit_id)->where('deleted_at', null)->first();

        if ($units_F) {
            $units_sub[] = $units_F;
        }

        if ($u_sub) {
            $units_sub[] = $u_sub;
        }

        $units = Unit::where('deleted_at', null)
            ->where('base_unit', null)
            ->get();

        return response()->json([
            'product' => $data,
            'categories' => $categories,
            'categories_id' => $item['categories_id'],
            'brands' => $brands,
            'units' => $units,
            'units_sub' => $units_sub,
        ]);
    }

    // import Products
    public function import_products(Request $request)
    {
        try
        {
            $user = $request->user('api');
            $this->authorizeForUser($user, 'update', Product::class);

            $fileUploaded = $request->file('products');

            $fileName = $fileUploaded->getClientOriginalName();
            $filePath = $fileUploaded->getPathname();
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

            if ($fileExtension !== "xls" && $fileExtension !== "xlsx" && $fileExtension !== "csv") {
                return response()->json(
                    [
                        'message' => '¡El archivo debe estar en formato csv, xls o xlsx!',
                        'status' => false
                    ]
                );
            } else {
                if ($fileExtension === "xls") {
                    $xlsReader = new XlsReader();
                    $xls = $xlsReader->load($filePath);

                    $writer = new CsvWriter($xls);
                    $csvFilePath = storage_path("app/public/converted_products-" . Str::random(16) . ".csv");
                    $writer->save($csvFilePath);
                } else if ($fileExtension === "xlsx") {
                    $xlsxReader = new XlsxReader();
                    $xlsx = $xlsxReader->load($filePath);

                    $writer = new CsvWriter($xlsx);
                    $csvFilePath = storage_path("app/public/converted_products-" . Str::random(16) . ".csv");
                    $writer->save($csvFilePath);
                }

                $fileUploaded = (isset($writer) && isset($csvFilePath)) ? $csvFilePath : $fileUploaded;

                $accents = array(
                    'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a',
                    'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A',
                    'ß'=>'B', 'ç'=>'c', 'Ç'=>'C',
                    'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e',
                    'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E',
                    'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i',
                    'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I',
                    'ñ'=>'n', 'Ñ'=>'N',
                    'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o',
                    'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O',
                    'š'=>'s', 'Š'=>'S',
                    'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ü'=>'u',
                    'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U',
                    'ý'=>'y', 'Ý'=>'Y', 'ž'=>'z', 'Ž'=>'Z'
                );
                $data = array();
                $rowcount = 0;
                if (($handle = fopen($fileUploaded, "r")) !== false) {
                    $max_line_length = defined('MAX_LINE_LENGTH') ? ProductsController::MAX_LINE_LENGTH : 10000;
                    $header = fgetcsv($handle, $max_line_length);

                    if (count($header) < 2) {
                        if (isset($writer) && isset($csvFilePath))
                            unlink($csvFilePath);

                        return response()->json(
                            [
                                'message' => '¡Los campos del archivo en formato csv deben estar separados por comas!',
                                'status' => false
                            ]
                        );
                    }

                    $header = array_map(
                        function ($key) use ($accents) {
                            $string = strtolower(strtr($key, $accents));

                            $string = filter_var($string, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

                            if (!mb_check_encoding($string, 'UTF-8'))
                                $string = mb_convert_encoding($string, 'UTF-8', 'ISO-8859-1');

                            $string = utf8_encode($string);

                            return $string;
                        }, $header
                    );
                    $header_colcount = count($header);
                    while (($row = fgetcsv($handle, $max_line_length)) !== false) {
                        $row_colcount = count($row);
                        if ($row_colcount == $header_colcount) {
                            $entry = array_map(
                                function ($value) {
                                    $parsedValue = null;

                                    if (is_numeric($value)) {
                                        if (is_integer($value))
                                            $parsedValue = (int)$value;
                                        else
                                            $parsedValue = (float)$value;
                                    }
                                    else
                                        $parsedValue = $value;

                                    return $parsedValue;
                                }, $row
                            );

                            $entry = array_combine($header, $entry);

                            $data[] = $entry;
                        } else
                            return null;

                        $rowcount++;
                    }
                    fclose($handle);
                } else
                    return null;

                $userWarehouseId = $user->warehouse_id;

                $warehouses = (isset($userWarehouseId) && !empty($userWarehouseId)) ? Warehouse::where("id", '=', $userWarehouseId)->where("deleted_at", '=', null)->pluck('id')->toArray() : Warehouse::where("deleted_at", '=', null)->pluck('id')->toArray();

                //-- Create or Update Product
                foreach ($data as $iKey => $value) {
                    $productCodeIsSetAndNotEmpty = (isset($value["codigo"]) && !empty($value["codigo"])) ? true : false;
                    $productNameIsSetAndNotEmpty = (isset($value["nombre"]) && !empty($value["nombre"])) ? true : false;
                    $productPriceIsSetAndNotEmpty = (isset($value["precio"]) && !empty($value["precio"])) ? true : (($value["precio"] >= 0) ? true : false);
                    $productCostIsSetAndNotEmpty = (isset($value["costo"]) && !empty($value["costo"])) ? true : (($value["costo"] >= 0) ? true : false);
                    $productUnitIsSetAndNotEmpty = (isset($value["unidad"]) && !empty($value["unidad"])) ? true : false;
                    $productNoteIsSetAndNotEmpty = (isset($value["nota"]) && !empty($value["nota"])) ? true : false;
                    $productStockAlertIsSetAndNotEmpty = (isset($value["stock"]) && !empty($value["stock"])) ? true : false;
                    $productCategoryIsSetAndNotEmpty = (isset($value["categoria"]) && !empty($value["categoria"])) ? true : false;
                    $productBrandIsSetAndNotEmpty = (isset($value["marca"]) && !empty($value["marca"])) ? true : false;
                    $productQuantityIsSetAndNotEmpty = (isset($value["cantidad"]) && !empty($value["cantidad"])) ? true : (($value["cantidad"] >= 0) ? true : false);

                    if ($productCodeIsSetAndNotEmpty && $productNameIsSetAndNotEmpty && $productPriceIsSetAndNotEmpty && $productCostIsSetAndNotEmpty && $productUnitIsSetAndNotEmpty && $productCategoryIsSetAndNotEmpty && $productQuantityIsSetAndNotEmpty) {
                        $productCode = $value["codigo"];
                        $productName = $value["nombre"];
                        $productPrice = $value["precio"];
                        $productCost = $value["costo"];
                        $productUnit = $value["unidad"];
                        $productNote = ($productNoteIsSetAndNotEmpty) ? $value["nota"] : '';
                        $productStockAlert = ($productStockAlertIsSetAndNotEmpty) ? $value["stock"] : 0;
                        $productCategory = explode(", ", $value["categoria"]);
                        $productBrand = ($productBrandIsSetAndNotEmpty) ? $value["marca"] : '';
                        $productQuantity = $value["cantidad"];

                        $categoriesIds = [];

                        foreach ($productCategory as $k => $pCategory) {
                            if (DB::table("categories")->where("name", '=', $pCategory)->count() >= 1) {
                                $category = Category::where("name", '=', $pCategory)->first();
                                $categoryId = $category->id;
                            } else {
                                $category = new Category;
                                $category->name =  $pCategory;
                                $category->save();

                                $categoryId = $category->id;
                            }

                            $categoriesIds[] = $categoryId;
                        }

                        if ($productBrand !== "N/A" && $productBrand !== '') {
                            $brand = Brand::firstOrCreate(["name" => $productBrand]);
                            $brand_id = $brand->id;
                        } else
                            $brand_id = null;

                        if (DB::table("products")->where("code", '=', $productCode)->count() >= 1) {
                            DB::table("products")->where("code", '=', $productCode)->update(
                                [
                                    'name' => $productName,
                                    'price' => $productPrice,
                                    'cost' => $productCost,
                                    'brand_id' => $brand_id,
                                    'note' => $productNote,
                                    'stock_alert' => $productStockAlert
                                ]
                            );

                            $productId = DB::table("products")->where("code", '=', $productCode)->pluck("id")->first();
                            $categoriesProduct = json_decode(json_encode(DB::table("category_product")->whereIn("category_id", $categoriesIds)->where("product_id", '=', $productId)->get("category_id")), true);

                            $this->insertOrUpdateOrDeleteRecordsToCategoryProduct($categoriesIds, $categoriesProduct, $productId);
                        } else {
                            $productCode = $this->generate_random_code();

                            DB::table("products")->insert(
                                [
                                    'name' => $productName,
                                    'code' => $productCode,
                                    'Type_barcode' => 'CODE128',
                                    'price' => $productPrice,
                                    'cost' => $productCost,
                                    'brand_id' => $brand_id,
                                    'TaxNet' => 0,
                                    'unit_id' => ($productUnit === "Und") ? DB::table("units")->where("name", '=', $productUnit)->pluck("id")->first() : 1,
                                    'unit_sale_id' => ($productUnit === "Und") ? DB::table("units")->where("name", '=', $productUnit)->pluck("id")->first() : 1,
                                    'unit_purchase_id' => ($productUnit === "Und") ? DB::table("units")->where("name", '=', $productUnit)->pluck("id")->first() : 1,
                                    'tax_method' => 1,
                                    'note' => $productNote,
                                    'stock_alert' => $productStockAlert,
                                    'is_variant' => 0,
                                    'image' => 'no-image.png'
                                ]
                            );

                            $productId = DB::table("products")->where("code", '=', $productCode)->pluck("id")->first();
                            $categoriesProduct = json_decode(json_encode(DB::table("category_product")->whereIn("category_id", $categoriesIds)->where("product_id", '=', $productId)->get("category_id")), true);

                            $this->insertOrUpdateOrDeleteRecordsToCategoryProduct($categoriesIds, $categoriesProduct, $productId);
                        }

                        if ($warehouses) {
                            foreach ($warehouses as $warehouse) {
                                if (isset($productQuantity) && $productQuantity !== 'N/A' && $productQuantity !== '' && $productQuantity !== 0) {
                                    $product_warehouse[] = [
                                        'product_id' => $productId,
                                        'warehouse_id' => $warehouse,
                                        'qte' => $productQuantity,
                                    ];
                                } else {
                                    $product_warehouse[] = [
                                        'product_id' => $productId,
                                        'warehouse_id' => $warehouse,
                                        'qte' => 0,
                                    ];
                                }
                            }
                        }
                    } else {
                        if (isset($writer) && isset($csvFilePath))
                            unlink($csvFilePath);

                        return response()->json(
                            [
                                "message" => "¡Todos los campos son requeridos a excepción de los campos 'marca', 'alerta de stock' y 'nota'!",
                                "status" => false
                            ]
                        );
                    };
                }

                foreach ($product_warehouse as $key => $value) {
                    if ($value["qte"] !== 0) {
                        if (DB::table("product_warehouse")->where("deleted_at", '=', null)->where("product_id", '=', $value["product_id"])->where("warehouse_id", '=', $value["warehouse_id"])->exists()) {
                            $currentQte = json_decode(json_encode(DB::table("product_warehouse")->where("deleted_at", '=', null)->where("product_id", '=', $value["product_id"])->where("warehouse_id", '=', $value["warehouse_id"])->pluck("qte")->first()), true);

                            DB::table("product_warehouse")->where("deleted_at", '=', null)->where("product_id", '=', $value["product_id"])->where("warehouse_id", '=', $value["warehouse_id"])->update(
                                [
                                    "updated_at" => date("Y-m-d H:i:s.mmm"),
                                    'qte' => $value["qte"] + $currentQte,
                                ]
                            );
                        } else {
                            DB::table("product_warehouse")->insert(
                                [
                                    "product_id" => $value["product_id"],
                                    "warehouse_id" => $value["warehouse_id"],
                                    "created_at" => date("Y-m-d H:i:s.mmm"),
                                    "qte" => $value["qte"]
                                ]
                            );
                        }
                    }
                }

                if (isset($writer) && isset($csvFilePath))
                    unlink($csvFilePath);

                return response()->json(
                    [
                        'status' => true,
                    ],
                    200
                );
            }
        }
        catch (Throwable $throwable)
        {
            $message = $throwable->getMessage();

            Log::error($message);

            return response()->json(
                [
                    "message" => "¡Error al importar archivo!",
                    "status" => false
                ]
            );
        }
    }

    public function insertOrUpdateOrDeleteRecordsToCategoryProduct($categoriesIds, $categoriesProduct, $productId) {
        $categoriesProduct = array_map(
            function ($value) {
                return (string)$value["category_id"];
            }, $categoriesProduct
        );

        $categoriesProductMatchingWithProductId = json_decode(json_encode(DB::table("category_product")->where("product_id", '=', $productId)->get("category_id")), true);
        $categoriesProductMatchingWithProductId = array_map(
            function ($value) {
                return (string)$value["category_id"];
            }, $categoriesProductMatchingWithProductId
        );

        $recordsToDelete = array_values(array_diff_assoc($categoriesProductMatchingWithProductId, $categoriesProduct));

        foreach ($recordsToDelete as $categoryProductCategoryId)
            DB::table("category_product")->where("category_id", '=', $categoryProductCategoryId)->where("product_id", '=', $productId)->delete();

        if (empty($categoriesProduct)) {
            foreach ($categoriesIds as $cId) {
                DB::table("category_product")->insert(
                    [
                        "category_id" => $cId,
                        "product_id" => $productId
                    ]
                );
            }
        } else if (count($categoriesProduct) < count($categoriesIds) || count($categoriesProduct) > count($categoriesIds)) {
            foreach ($categoriesIds as $cId) {
                if (DB::table("category_product")->where("category_id", '=', $cId)->where("product_id", '=', $productId)->count() < 1) {
                    DB::table("category_product")->insert(
                        [
                            "category_id" => $cId,
                            "product_id" => $productId
                        ]
                    );
                }
            }
        }
    }

    public function getNumberOrder()
    {
        $last = DB::table('adjustments')->latest('id')->first();

        if ($last) {
            $item = $last->Ref;
            $nwMsg = explode("_", $item);
            $inMsg = $nwMsg[1] + 1;
            $code = $nwMsg[0] . '_' . $inMsg;
        } else
            $code = 'AD_1111';

        return $code;
    }

    // Generate_random_code
    public function generate_random_code()
    {
        $code = substr(number_format(time() * mt_rand(), 0, '', ''), 0, 8);

        $check_code = Product::where("code", '=', $code)->first();

        if ($check_code) {
            $this->generate_random_code();
        } else
            return $code;

    }
}
