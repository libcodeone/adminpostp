<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class role_user extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $table = 'role_user';
    protected $fillable = [
        'user_id', 'role_id',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'role_id' => 'integer',
    ];

}
