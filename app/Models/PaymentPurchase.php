<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentPurchase extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'purchase_id', 'date', 'montant', 'Ref', 'Reglement', 'user_id', 'notes',
    ];

    protected $casts = [
        'montant' => 'double',
        'purchase_id' => 'integer',
        'user_id' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function purchase()
    {
        return $this->belongsTo('App\Models\Purchase');
    }

}
