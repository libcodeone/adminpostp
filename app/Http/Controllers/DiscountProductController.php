<?php

namespace App\Http\Controllers;

use App\Models\DiscountProduct;
use App\Models\Warehouse;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DiscountProductController extends Controller
{
    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', DiscountProduct::class);

        $categories = DB::table("categories")->select("id", "name")->get();
        $warehouses =  DB::table("warehouses")->select("id", "name")->where("deleted_at", "=", null)->get();
        $products = DB::table("products")->select('*')->get();

        $currentPage = $request->page;
        $perPage = $request->perPage;

        $query = DB::table("offers_products")->select('*')->where("deleted_at", '=', null);

        if(!is_null($request->orderByName) && $request->orderByName != ""){
            $orderByStr = $request->dataTypeOrderBy == 'int' ? 'CAST('.$request->orderByName.' AS UNSIGNED)'.' '.$request->orderBy : $request->orderByName.' ' .$request->orderBy;
            $query->orderByRaw($orderByStr);
        }

        if(!is_null($request->search) && $request->search != ''){
            $query->where(function ($q) use ($request){
                $q->where('offers_products.nombre', 'like' ,'%'.$request->search.'%')
                ->orWhere('offers_products.descripcion', 'like' ,'%'.$request->search.'%')
                ->orWhere('offers_products.porcentajeDescuentoProducto', 'like' ,'%'.$request->search.'%')
                ->orWhere('offers_products.precioProducto', 'like' ,'%'.$request->search.'%');
            });
        }

        if (!is_null($request->warehouse) && $request->warehouse != '' && $request->warehouse != "null") {
            $query->where("offers_products.warehouse_id", "=", $request->warehouse);
        }

        if (!is_null($request->category_product) && $request->category_product != '' && $request->category_product != "null") {
            $query->where("offers_products.category_product_id", "=", $request->category_product);
        }

        $rows =  $query->count();

        $offers = $query->simplePaginate($perPage, ['*'], 'page', $currentPage);
        $offers = json_decode(json_encode($offers), true);

        $permissions = json_decode(json_encode($this->getPermissions()), true);
        $warehouses = json_decode(json_encode($warehouses), true);
        $products = json_decode(json_encode($products), true);
        $categories = json_decode(json_encode($categories), true);

        return response()->json([
                'permissions' => $permissions,
                'warehouses' => $warehouses,
                'products' => $products,
                'categories_product' => $categories,
                'offers' => $offers,
                'rows' => $rows
            ],
            200
        );
    }

    public function store(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', DiscountProduct::class);

        $patron = '/[^\w\s\[\]\',\"]+/';

        $discountProduct = DB::table("offers_products")->insert([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'porcentajeDescuentoProducto' => $request->porcentajeDescuentoProducto,
            'precioProducto' => $request->precioProducto,
            'activo' =>  $request->activo,
            'dias' => preg_replace($patron, '', $request->dias),
            'hora_inicio' => $request->hora_inicio,
            'hora_fin' => $request->hora_fin,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'is_all_products' => $request->is_all_products,
            'warehouse_id' =>$request->warehouse_id,
            'category_product_id' => $request->category_product_id
        ]);

        return response()->json(
            [
                "discount_product_is_created" => $discountProduct
            ],
            200
        );
    }

    public function edit(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', DiscountProduct::class);

        $offer = json_decode(json_encode(DiscountProduct::with("Types")->find($id)), true);

        $products = [];

        foreach ($offer["types"] as $typeOffer)
        {
            if ($typeOffer["type"] === "producto")
                array_push($products, $typeOffer["entidad_id"]);
        }

        $offer["offersProducts"] = $products;

        $warehouse = json_decode(json_encode(DB::table("warehouses")->select("name", "id", "id as value")->where("deleted_at", "=", null)->find($offer["warehouse_id"])), true);
        $category_product = json_decode(json_encode(DB::table("categories")->select("name", "id", "id as value")->find($offer["category_product_id"])), true);

        return response()->json(
            [
                'offer' => $offer,
                'warehouse' => $warehouse,
                'category_product' => $category_product
            ],
            200
        );
    }

    public function update(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', DiscountProduct::class);

        $patron = '/[^\w\s\[\]\',\"]+/';

        DB::table("offers_products")->where("id", '=', $id)->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'porcentajeDescuentoProducto' => $request->porcentajeDescuentoProducto,
            'precioProducto' => $request->precioProducto,
            'activo' => $request->activo,
            'hora_inicio' => $request->hora_inicio,
            'dias' => preg_replace($patron, '', $request->dias),
            'hora_fin' => $request->hora_fin,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'warehouse_id' =>$request->warehouse_id,
            'category_product_id' => $request->category_product_id,
            'is_all_products' => $request->is_all_products
        ]);

        return response()->json("status", 200);
    }

    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', DiscountProduct::class);

        DB::table("offers_products")->where('id', '=', $id)->delete();

        return response()->json("status", 200);
    }

    /*
    public function saveProducts(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', DiscountProduct::class);

        $typeOffersProduct = DB::table("offer_type_product")->where('offer_id', '=', $request->offer)->where('type', '=', 'producto')->get();

        for ($i = 0; $i < count($typeOffersProduct); $i++) {
            if (!in_array($typeOffersProduct[$i]->id_entidad, $request->products)) {
                $typeOffersProduct[$i]->delete();
            }
        }

        for ($i = 0; $i < count($request->products); $i++) {
            $typeOffer = DB::table("offer_type_product")->where('offer_id', '=', $request->offer)->where('type', '=', 'producto')->where('entidad_id', '=', $request->products[$i])->first();
            if ($typeOffer === null) {
                $type = new TypeDiscountProduct();
                $type->entidad_id = $request->products[$i];
                $type->type = "producto";
                $type->offer_id = $request->offer;
                $type->save();
            }
        }
    }
    */
}
