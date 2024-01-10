<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class OauthRefreshToken extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    public function oauthAccessToken()
    {
        return $this->belongsTo('\App\Models\OauthAccessToken');
    }

}
