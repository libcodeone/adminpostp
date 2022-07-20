<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class Provider extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'name', 'code', 'adresse', 'phone', 'country', 'email', 'city',
    ];

    protected $casts = [
        'code' => 'integer',
    ];

}
