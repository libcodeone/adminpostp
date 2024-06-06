<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypeDiscountProduct extends Model
{
    use HasFactory;
    protected $table = "offer_type_product";
    protected $fillable = ['offer_id', 'entidad_id', 'type'];

    public function Offer ()
    {
        return $this->belongsTo(DiscountProduct::class, 'offer_id');
    }
}
