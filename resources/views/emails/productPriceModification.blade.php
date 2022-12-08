@component('mail::message')

<span>Estimado administrador,</span>

<?php
    $modifier = '';

    if(auth()->user()->email != $data['email'])
    {
        $modifier = $data['firstname'].' '.$data['lastname'].' modificó';
    }
    else
    {
        $modifier = 'tú modificaste';
    }
?>

<span>Este correo fue enviado porque {{$modifier}} la información de {{$data['name']}} con los siguientes valores:</span>

<table border="1">
    <tr>
        <th>
            Item
        </th>
        <th>
            Valor
        </th>
    </tr>
    <tr>
        <td>
            Precio anterior
        </td>
        <td>
            <strong>${{$data['old_product_price']}}</strong>
        </td>
    </tr>
    <tr>
        <td>
            Precio nuevo
        </td>
        <td>
            <strong>${{$data['new_product_price']}}</strong>
        </td>
    </tr>
    <tr>
        <td>
            Día actualizado
        </td>
        <td>
            {{$data['date']}}
        </td>
    </tr>
    <tr>
        <td>
            Hora actualizada
        </td>
        <td>
            {{$data['time']}}
        </td>
    </tr>
</table>

<br><span>Atentamente,<span><br>
{{ config('app.name') }}
@endcomponent
