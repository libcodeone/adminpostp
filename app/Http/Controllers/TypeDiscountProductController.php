<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\DiscountProduct;
use App\Models\Municipality;
use App\Models\TypeDiscountProduct;
use Illuminate\Support\Facades\Gate;

class TypeDiscountProductController extends Controller
{
    public function init(Request $request)
    {
        $typeDiscounts = TypeDiscountProduct::where('discount_id', '=', $request->discount_id)
            ->where('type', '!=', 'producto')->get();
        foreach ($typeDiscounts as $item) {
            switch ($item->type) {
                case 'todo':
                    $item->tipoEntidad = 'General';
                    $item->nombre =  "Todos los productos";
                    break;
                case 'sucursal':
                    $item->tipoEntidad  = 'sucursal';
                    $item->nombre = Warehouse::findOrFail($item->entidad_id)->name;
                    break;
                case 'productCat':
                    $item->tipoEntidad = 'categoría de producto';
                    $item->nombre = Category::findOrFail($item->entidad_id)->name;
                    break;
                case 'default':
                    $item->tipoEntidad  = 'sucursal';
                    $item->nombre = Warehouse::findOrFail($item->entidad_id)->name;
                    break;
            }
        }
        return response()->json([
            'type_discounts' => $typeDiscounts,
        ]);
    }

    public function index(Request $request)
    {
        $typeDiscounts = TypeDiscountProduct::where('discount_id', '=', $request->discount_id)
            ->where('type', '!=', 'producto')->get();

        foreach ($typeDiscounts as $item) {
            switch ($item->type) {
                case 'todo':
                    $item->tipoEntidad = 'General';
                    $item->nombre =  "Todos los productos";
                    break;
                case 'sucursal':
                    $item->tipoEntidad  = 'sucursal';
                    $item->nombre = Warehouse::findOrFail($item->entidad_id)->name;
                    break;
                case 'productCat':
                    $item->tipoEntidad  = 'categoría de producto';
                    $item->nombre = Category::findOrFail($item->entidad_id)->name;
                    break;
                case 'default':
                    $item->tipoEntidad  = 'sucursal';
                    $item->nombre = Warehouse::findOrFail($item->entidad_id)->name;
                    break;
            }
        }

        return view('type_discounts_product', [
            'discount' => DiscountProduct::find($request->discount_id),
            'type_discounts' => $typeDiscounts,
            'subsidiaries' => Warehouse::select('name as text', 'name as name', 'id as value')->get(),
            'categoriesProduct' => Category::select('name as text', 'name as name', 'id as value')->where('type', '=', '2')->where('condition_id', '=', 5)->get(),
            'status' => 200
        ]);
    }

    public function store(Request $request)
    {
        $typeDiscount = new TypeDiscountProduct();
        $typeDiscount->discount_id = $request->discount_id;
        $typeDiscount->type = $request->type;
        $typeDiscount->entidad_id = $request->type == "todo" ? null : $request->entidadDiscount;
        $typeDiscount->save();

        return response()->json("status", 200);
    }

    public function edit(Request $request, $id)
    {
        $type_discount = TypeDiscountProduct::find($id);

        return response()->json([
            'type_discount' => $type_discount,
        ]);
    }

    public function update(Request $request, $id)
    {
        $type_discount = TypeDiscountProduct::find($id);
        $type_discount->discount_id = $request->discount_id;
        $type_discount->type = $request->type;
        $type_discount->entidad_id =  $request->type == "todo" ? null : $request->entidadDiscount;
        $type_discount->update();

        return response()->json("status", 200);
    }

    public function destroy($id)
    {
        $type_discount = TypeDiscountProduct::find($id)->delete();

        return response()->json("status", 200);
    }
}
