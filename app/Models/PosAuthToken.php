<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class PosAuthToken extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;

    protected $table = "pos_auth_tokens";
    protected $fillable = ['id', 'token', 'status', 'configuration_id', 'sale_id', 'user_id'];
    protected $dates = ['created_at', 'updated_at', 'deleted_at', 'expires_at'];
}
