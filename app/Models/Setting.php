<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{

    protected $fillable = [
        'currency_id', 'email', 'CompanyName', 'CompanyPhone', 'CompanyAdress',
         'logo','footer','developed_by','client_id','warehouse_id','initial_invoiceCF',
         'current_invoiceCF',
         'initial_invoiceCCF',
         'current_invoiceCCF',
    ];

    protected $casts = [
        'currency_id' => 'integer',
        'client_id' => 'integer',
        'warehouse_id' => 'integer',
        'initial_invoiceCF' => 'integer',
        'current_invoiceCF' => 'integer',
        'initial_invoiceCCF' => 'integer',
        'current_invoiceCCF' => 'integer',
    ];

    public function Currency()
    {
        return $this->belongsTo('App\Models\Currency');
    }

}
