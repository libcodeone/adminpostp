<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class QuotationDetail extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'id', 'product_id', 'quotation_id', 'total', 'quantity', 'product_variant_id',
        'price', 'TaxNet', 'discount', 'discount_method', 'tax_method',
    ];

    protected $casts = [
        'total' => 'double',
        'quantity' => 'double',
        'price' => 'double',
        'TaxNet' => 'double',
        'discount' => 'double',
        'quotation_id' => 'integer',
        'product_id' => 'integer',
        'product_variant_id' => 'integer',
    ];

    public function quotation()
    {
        return $this->belongsTo('App\Models\Quotation');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product');
    }

}
