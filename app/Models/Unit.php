<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Unit extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'ShortName', 'base_unit', 'operator', 'operator_value', 'is_active',
    ];

    protected $casts = [
        'base_unit' => 'integer',
        'operator_value' => 'float',
        'is_active' => 'integer',

    ];

}
