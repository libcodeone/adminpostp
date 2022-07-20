<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class SaleReturnDetails extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'id', 'product_id', 'sale_return_id', 'total', 'quantity', 'product_variant_id',
        'price', 'TaxNet', 'discount', 'discount_method', 'tax_method',
    ];

    protected $casts = [
        'total' => 'double',
        'quantity' => 'double',
        'sale_return_id' => 'integer',
        'product_id' => 'integer',
        'product_variant_id' => 'integer',
        'price' => 'double',
        'TaxNet' => 'double',
        'discount' => 'double',
    ];

    public function SaleReturn()
    {
        return $this->belongsTo('App\Models\SaleReturn');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

}
