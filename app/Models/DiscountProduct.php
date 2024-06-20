<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class DiscountProduct extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $table = "offers_products";
    protected $fillable = ['id', 'nombre', 'descripcion', 'porcentajeDescuentoProducto', 'precioProducto', 'activo', 'hora_inicio', 'hora_fin', 'fecha_inicio', 'fecha_fin', 'dias', 'category_product_id', 'product_id', 'warehouse_id', 'is_all_products'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at'];
    public function Types()
    {
        return $this->hasMany(TypeDiscountProduct::class, "offer_id");
    }
}
