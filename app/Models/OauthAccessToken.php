<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class OauthAccessToken extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function oauthRefreshToken()
    {
        return $this->hasMany('\App\Models\OauthRefreshToken', 'access_token_id');
    }

}
