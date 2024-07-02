<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ProductPriceModification extends Mailable
{
    use Queueable, SerializesModels;

    public $data;
    public $saleDetailsData;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data, $saleDetailsData)
    {
        $this->data = $data;
        $this->saleDetailsData = $saleDetailsData;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('Alerta de modificación a la información de productos.')
            ->markdown('emails.productPriceModification');
    }
}
