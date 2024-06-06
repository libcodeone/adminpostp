<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountProduct extends Model
{

    use HasFactory, SoftDeletes;
    protected $table = "offers_products";
    protected $fillable = ['id', 'nombre', 'descripcion', 'porcentajeDescuentoProducto', 'precioProducto', 'activo', 'hora_inicio', 'hora_fin', 'fecha_inicio', 'fecha_fin', 'dias', 'category_product_id', '', '', 'subsidiary_id', 'is_all_products'];
    protected $dates = ['deleted_at'];
    public function Types()
    {
        return $this->hasMany(TypeDiscountProduct::class, "offer_id");
    }

}
