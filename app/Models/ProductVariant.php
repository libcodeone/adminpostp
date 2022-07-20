<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ProductVariant extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    protected $table = 'product_variants';

    protected $fillable = [
        'product_id', 'name', 'qty',
    ];

    protected $casts = [
        'product_id' => 'integer',
        'qty' => 'double',
    ];

}
