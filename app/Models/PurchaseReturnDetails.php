<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PurchaseReturnDetails extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'id', 'product_id', 'purchase_return_id', 'total', 'quantity', 'product_variant_id',
        'cost', 'TaxNet', 'discount', 'discount_method', 'tax_method',
    ];

    protected $casts = [
        'total' => 'double',
        'quantity' => 'double',
        'purchase_return_id' => 'integer',
        'product_id' => 'integer',
        'product_variant_id' => 'integer',
        'cost' => 'double',
        'TaxNet' => 'double',
        'discount' => 'double',
    ];

    public function PurchaseReturn()
    {
        return $this->belongsTo('App\Models\PurchaseReturn');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

}
