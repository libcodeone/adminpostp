<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DiscountProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

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

        if (!is_null($request->orderByName) && $request->orderByName != "") {
            $orderByStr = $request->dataTypeOrderBy == 'int' ? 'CAST(' . $request->orderByName . ' AS UNSIGNED)' . ' ' . $request->orderBy : $request->orderByName . ' ' . $request->orderBy;
            $query->orderByRaw($orderByStr);
        }

        if (!is_null($request->search) && $request->search != '') {
            $query->where(function ($q) use ($request) {
                $q->where('offers_products.nombre', 'like', '%' . $request->search . '%')
                    ->orWhere('offers_products.descripcion', 'like', '%' . $request->search . '%')
                    ->orWhere('offers_products.porcentajeDescuentoProducto', 'like', '%' . $request->search . '%')
                    ->orWhere('offers_products.precioProducto', 'like', '%' . $request->search . '%');
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

        return response()->json(
            [
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

        $data = json_decode(json_encode(request()->all()), true);

        $daysArray = json_decode($data["dias"], true);
        $data["dias"] = (count($daysArray) < 1) ? json_decode("[\"lunes\",\"martes\",\"miercoles\",\"jueves\",\"viernes\",\"sabado\",\"domingo\"]", true) : json_decode($data["dias"], true);

        $requestValidator = Validator::make($data,
            [
                'dias' =>
                [
                    function ($attribute, $input, $fail) {
                        if (count($input) < 1)
                            $fail("¡Debes seleccionar al menos 1 día para aplicar la oferta!");
                    }
                ]
            ]
        );

        $isFailed = $requestValidator->fails();

        if ($isFailed) {
            $messages = [];
            $messageBag = json_decode(json_encode($requestValidator->getMessageBag()), true);

            foreach ($messageBag as $index => $message)
                $messages[] = $message[0];

            $success = $isFailed;
            $status = 422;
        } else {
            $patron = '/[^\w\s\[\]\',\"]+/';
            $daysString = json_encode($data["dias"]);

            $discountProduct = DB::table("offers_products")->insert([
                'nombre' => $data["nombre"],
                'descripcion' => $data["descripcion"],
                'porcentajeDescuentoProducto' => (isset($data["porcentajeDescuentoProducto"])) ? $data["porcentajeDescuentoProducto"] : null,
                'precioProducto' => (isset($data["precioProducto"])) ? $data["precioProducto"] : null,
                'activo' =>  $data["activo"],
                'dias' => preg_replace($patron, '', $daysString),
                'hora_inicio' => $data["hora_inicio"],
                'hora_fin' => $data["hora_fin"],
                'fecha_inicio' => $data["fecha_inicio"],
                'fecha_fin' => $data["fecha_fin"],
                'is_all_products' => $data["is_all_products"],
                'warehouse_id' => $data["warehouse_id"],
                'category_product_id' => $data["category_product_id"]
            ]);

            $success = $discountProduct;

            if ($success)
            {
                $messages[] = '';
                $status = 200;
            }
            else
            {
                $messages[] = "¡No existe contenido!";
                $status = 204;
            }
        }

        return response()->json(
            [
                "success" => $success,
                "messages" => $messages
            ],
            // $status
        );
    }

    public function edit(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', DiscountProduct::class);

        $offer = (array)json_decode(json_encode(DB::table("offers_products")->where("id", '=', $id)->first()), true);

        $offer["types"] = (array)json_decode(json_encode(DB::table("offer_type_product")->where("offer_id", '=', $id)->get()), true);

        $products = [];

        foreach ($offer["types"] as $typeOffer) {
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

        $data = json_decode(json_encode(request()->all()), true);

        $daysArray = json_decode($data["dias"], true);
        $data["dias"] = (count($daysArray) < 1) ? json_decode("[\"lunes\",\"martes\",\"miercoles\",\"jueves\",\"viernes\",\"sabado\",\"domingo\"]", true) : json_decode($data["dias"], true);

        $requestValidator = Validator::make($data,
            [
                'dias' =>
                [
                    function ($attribute, $input, $fail) {
                        if (count($input) < 1)
                            $fail("¡Debes seleccionar al menos 1 día para aplicar la oferta!");
                    }
                ]
            ]
        );

        $isFailed = $requestValidator->fails();

        if ($isFailed) {
            $messages = [];
            $messageBag = json_decode(json_encode($requestValidator->getMessageBag()), true);

            foreach ($messageBag as $index => $message)
                $messages[] = $message[0];

            $success = $isFailed;
            $status = 422;
        } else {
            $patron = '/[^\w\s\[\]\',\"]+/';
            $daysString = json_encode($data["dias"]);

            DB::table("offers_products")->where("id", '=', $id)->update([
                'nombre' => $data["nombre"],
                'descripcion' => $data["descripcion"],
                'porcentajeDescuentoProducto' => (isset($data["porcentajeDescuentoProducto"])) ? $data["porcentajeDescuentoProducto"] : null,
                'precioProducto' => (isset($data["precioProducto"])) ? $data["precioProducto"] : null,
                'activo' => $data["activo"],
                'hora_inicio' => $data["hora_inicio"],
                'dias' => preg_replace($patron, '', $daysString),
                'hora_fin' => $data["hora_fin"],
                'fecha_inicio' => $data["fecha_inicio"],
                'fecha_fin' => $data["fecha_fin"],
                'warehouse_id' => $data["warehouse_id"],
                'category_product_id' => $data["category_product_id"],
                'is_all_products' => $data["is_all_products"]
            ]);

            $messages = '';
            $success = !$isFailed;
            $status = 200;
        }

        return response()->json(
            [
                "messages" => $messages,
                "success" => $success
            ],
            // $status
        );
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
