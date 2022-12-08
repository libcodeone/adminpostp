@component('mail::message')

<span>Estimado administrador,</span>

<span>Este correo fue enviado porque {{$data['firstname']}} {{$data['lastname']}} modificó la información de {{$data['name']}} con los siguientes valores:</span>

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
    <tr>
        <td>
            Precio anterior
        </td>
        <td>
            ${{$data['old_product_price']}}
        </td>
    </tr>
    <tr>
        <td>
            Precio nuevo
        </td>
        <td>
            ${{$data['new_product_price']}}
        </td>
    </tr>
</table>

<br><span>Regards,<span><br>
{{ config('app.name') }}
@endcomponent
