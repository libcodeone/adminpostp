<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model implements Auditable
{

    use \OwenIt\Auditing\Auditable;
    use SoftDeletes;
    protected $dates = ['deleted_at'];

    protected $fillable = [
        'date', 'Ref', 'is_pos', 'client_id', 'GrandTotal','subTotal', 'qte_retturn', 'TaxNet', 'tax_rate', 'TaxWithheld', 'notes',
        'total_retturn', 'warehouse_id', 'user_id', 'statut', 'discount', 'shipping',
        'paid_amount','cash','change', 'payment_statut', 'type_invoice', 'refInvoice', 'refTrasnsferedBank', 'refCreditCard', 'created_at', 'updated_at', 'deleted_at',
    ];

    protected $casts = [
        'is_pos' => 'integer',
        'GrandTotal' => 'double',
        'qte_retturn' => 'double',
        'total_retturn' => 'double',
        'user_id' => 'integer',
        'client_id' => 'integer',
        'warehouse_id' => 'integer',
        'discount' => 'double',
        'shipping' => 'double',
        'TaxNet' => 'double',
        'tax_rate' => 'double',
        'TaxWithheld' => 'double',
        'paid_amount' => 'double',
        'cash' => 'double',
        'change' => 'double',
    ];

    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }

    public function details()
    {
        return $this->hasMany('App\Models\SaleDetail');
    }

    public function client()
    {
        return $this->belongsTo('App\Models\Client');
    }

    public function facture()
    {
        return $this->hasMany('App\Models\PaymentSale');
    }

    public function warehouse()
    {
        return $this->belongsTo('App\Models\Warehouse');
    }

}
