<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Client extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'code', 'adresse', 'email', 'phone', 'country', 'city', 'NIT', 'NRC', 'giro','big_consumer','final_consumer', 'DUI',

    ];

    protected $casts = [
        'code' => 'integer',
    ];
}
