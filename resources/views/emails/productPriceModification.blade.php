@component('mail::message')

<span>Estimado administrador,</span>

<?php
    $userString = '';

    if(auth()->user()->email != $data['email'])
    {
        $userString = $data['firstname'].' '.$data['lastname'].' modificó';
    }
    else
    {
        $userString = 'tú modificaste';
    }

    $section = '';
    $totalDiscount = '';

    if ($data['total_discount'] === null)
    {
        $section = 'Lista de Productos';
        $totalDiscount = 'N/A';
    }
    else if ($data['total_discount'] !== null)
    {
        $section = 'POS';
        if ($data['total_discount'] === 0.0)
        {
            $totalDiscount = 'N/A';
        }
        else
        {
            $totalDiscount = '$'.$data['total_discount'];
        }
    }
?>

<span>Este correo fue enviado porque {{$userString}} información en la sección <em>{{$section}}</em> con los siguientes valores:</span>
<br>

<?php
    if ($section === 'POS')
    {
        echo '<span>Nombre del cliente: '.$data['client_name'].'</span><br>';
        if ($data['final_consumer'] === 1)
        {
            echo '<span>Tipo de cliente: Consumidor final</span><br>';
        }
        else
        {
            echo '<span>Tipo de cliente: Crédito fiscal</span><br>';
        }
    }
?>
<span>Descuento total: <strong>{{$totalDiscount}}</strong></span>
<br>
<?php
    if ($saleDetailsData !== null)
    {
?>
        <span>Día actualizado: <strong>{{$data['date']}}</strong></span>
        <br>
        <span>Hora actualizado: <strong>{{$data['time']}}</strong></span>
<?php
    }
?>
<br>

<?php
    if ($saleDetailsData === null)
    {
        echo '<table border="1">
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
                    Nombre
                </td>
                <td>
                    '.$data['name'].'
                </td>
            </tr>
            <tr>
                <td>
                    Precio anterior
                </td>
                <td>
                    <strong>$'.$data['old_product_price'].'</strong>
                </td>
            </tr>
            <tr>
                <td>
                    Precio nuevo
                </td>
                <td>
                    <strong>$'.$data['new_product_price'].'</strong>
                </td>
            </tr>
            <td>
            <tr>
                <td>
                    Día actualizado
                </td>
                <td>
                    '.$data['date'].'
                </td>
            </tr>
            <tr>
                <td>
                    Hora actualizado
                </td>
                <td>
                    '.$data['time'].'
                </td>
            </tr>
        </table>
        <br>';
    }
    else
    {
        foreach ($saleDetailsData as $key => $value)
        {
            if ($value['new_product_price'] != $value['original_product_price'])
            {
                echo '<table border="1">
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
                            Nombre
                        </td>
                        <td>
                            '.$value['name'].'
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Precio anterior
                        </td>
                        <td>
                            <strong>$'.$value['original_product_price'].'</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Precio nuevo
                        </td>
                        <td>
                            <strong>$'.$value['new_product_price'].'</strong>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Cantidad de producto
                        </td>
                        <td>
                            '.$value['product_quantity'].'
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Total del producto
                        </td>
                        <td>
                            <strong>$'.$value['product_total'].'</strong>
                        </td>
                    </tr>
                </table>
                <br>';
            }
        }
    }
?>

<span>Atentamente,<span><br>
{{ config('app.name') }}
@endcomponent
