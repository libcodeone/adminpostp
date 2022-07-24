<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PaymentWithCreditCard extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;

    protected $table = 'payment_with_credit_card';

    protected $fillable = [
        'payment_id', 'customer_id', 'customer_stripe_id', 'charge_id',
    ];

    protected $casts = [
        'payment_id' => 'integer',
        'customer_id' => 'integer',
    ];


}
