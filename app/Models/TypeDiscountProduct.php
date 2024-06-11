<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TypeDiscountProduct extends Model implements Auditable
{
    use HasFactory;
    use SoftDeletes;
    use \OwenIt\Auditing\Auditable;

    protected $table = "offer_type_product";
    protected $fillable = ['offer_id', 'entidad_id', 'type'];

    public function Offer ()
    {
        return $this->belongsTo(DiscountProduct::class, 'offer_id');
    }
}
