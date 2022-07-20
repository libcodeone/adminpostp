<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Currency extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'code', 'name', 'symbol',
    ];

}
