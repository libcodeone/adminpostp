<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Client;
use App\utils\helpers;
use Illuminate\Http\Request;
use App\Exports\ClientsExport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ClientController extends BaseController
{
    private const MAX_LINE_LENGTH = 10000;

    //------------- Get ALL Customers -------------\\

    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Client::class);
        // How many items do you want to display.
        $perPage = $request->limit;
        $pageStart = $request->get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $order = $request->SortField;
        $dir = $request->SortType;
        $helpers = new helpers();
        // Filter fields With Params to retrieve
        $columns = array(0 => 'name', 1 => 'code', 2 => 'phone', 3 => 'email', 4 => 'NIT', 5 => 'DUI', 6 => 'NRC', 7 => 'giro');
        $param = array(0 => 'like', 1 => 'like', 2 => 'like', 3 => 'like', 4 => 'like', 5 => 'like', 6 => 'like', 7 => 'like');

        $clients = Client::where('deleted_at', '=', null);

        //Multiple Filter
        $Filtred = $helpers->filter($clients, $columns, $param, $request)
        // Search With Multiple Param
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('name', 'LIKE', "%{$request->search}%")
                        ->orWhere('code', 'LIKE', "%{$request->search}%")
                        ->orWhere('phone', 'LIKE', "%{$request->search}%")
                        ->orWhere('NIT', 'LIKE', "%{$request->search}%")
                        ->orWhere('DUI', 'LIKE', "%{$request->search}%")
                        ->orWhere('NRC', 'LIKE', "%{$request->search}%")
                        ->orWhere('giro', 'LIKE', "%{$request->search}%")
                        ->orWhere('email', 'LIKE', "%{$request->search}%");
                });
            });
        $totalRows = $Filtred->count();
        $clients = $Filtred->offset($offSet)
            ->limit($perPage)
            ->orderBy($order, $dir)
            ->get();

        return response()->json([
            'clients' => $clients,
            'totalRows' => $totalRows,
        ]);
    }

    //------------- Store new Customer -------------\\

    public function store(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Client::class);

        $client=Client::create([
            'name' => $request['name'],
            'code' => $this->getNumberOrder(),
            'adresse' => $request['adresse'],
            'phone' => $request['phone'],
            'email' => $request['email'],
            'country' => $request['country'],
            'city' => $request['city'],
            'NIT' => $request['NIT'],
            'DUI' => $request['DUI'],
            'NRC' => $request['NRC'],
            'giro' => $request['giro'],
            'big_consumer' => $request['big_consumer'],
            'final_consumer' => $request['final_consumer'],
        ]);
        $id=$client->id;
        return response()->json(['success' => true,'id_client'=> $id]);
    }
    public function store_pos(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'Sales_pos', Sale::class);
        request()->validate([
            'name' => 'required',
            'phone' => 'required',
        ]);
        $client=Client::create([
            'name' => $request['name'],
            'code' => $this->getNumberOrder(),
            'adresse' => $request['adresse'],
            'phone' => $request['phone'],
            'email' => $request['email'],
            'country' => $request['country'],
            'city' => $request['city'],
            'NIT' => $request['NIT'],
            'DUI' => $request['DUI'],
            'NRC' => $request['NRC'],
            'giro' => $request['giro'],
            'big_consumer' => $request['big_consumer'],
            'final_consumer' => $request['final_consumer'],
        ]);
        $id=$client->id;
        return response()->json(['success' => true,'id_client'=> $id]);
    }

    //------------- Update Customer -------------\\

    public function update(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Client::class);

        Client::whereId($id)->update([
            'name' => $request['name'],
            'adresse' => $request['adresse'],
            'phone' => $request['phone'],
            'email' => $request['email'],
            'country' => $request['country'],
            'city' => $request['city'],
            'NIT' => $request['NIT'],
            'DUI' => $request['DUI'],
            'NRC' => $request['NRC'],
            'giro' => $request['giro'],
            'big_consumer' => $request['big_consumer'],
            'final_consumer' => $request['final_consumer'],
        ]);
        return response()->json(['success' => true]);

    }

    //------------- delete client -------------\\

    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Client::class);

        Client::whereId($id)->update([
            'deleted_at' => Carbon::now(),
        ]);
        return response()->json(['success' => true]);
    }

    //-------------- Delete by selection  ---------------\\

    public function delete_by_selection(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Client::class);
        $selectedIds = $request->selectedIds;

        foreach ($selectedIds as $Client_id) {
            Client::whereId($Client_id)->update([
                'deleted_at' => Carbon::now(),
            ]);
        }
        return response()->json(['success' => true]);
    }

    //------------- Export  ALL Customers in EXCEL -------------\\

    public function exportExcel(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Client::class);

        return Excel::download(new ClientsExport, 'Lista_de_Clientes.xlsx', \Maatwebsite\Excel\Excel::XLSX,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="Lista_de_Clientes.xlsx"',
            ]
        );
    }

    //------------- get Number Order Customer -------------\\

    public function getNumberOrder()
    {
        $last = DB::table('clients')->latest('id')->first();

        if ($last) {
            $code = $last->code + 1;
        } else {
            $code = 1;
        }
        return $code;
    }

    //------------- Get Clients Without Paginate -------------\\

    public function Get_Clients_Without_Paginate()
    {
        $clients = Client::where('deleted_at', '=', null)->get(['id', 'name','phone','final_consumer','NRC']);
        foreach($clients as &$client){
            $client->final_consumer=$client->final_consumer===0 ? 'CCF' :'CF';
            $client->phone=$client->final_consumer==='CCF' ? $client->NRC :$client->phone;
        }
        return response()->json($clients);
    }

    // import clients
    public function import_clients(Request $request)
    {
        $file_upload = $request->file('clients');
        $ext = pathinfo($file_upload->getClientOriginalName(), PATHINFO_EXTENSION);
        if ($ext != 'csv') {
            return response()->json([
                'msg' => 'must be in csv format',
                'status' => false,
            ]);
        } else {
            $data = array();
            $rowcount = 0;
            if (($handle = fopen($file_upload, "r")) !== false) {
                $max_line_length = defined('MAX_LINE_LENGTH') ? ClientController::MAX_LINE_LENGTH : 10000;
                $header = fgetcsv($handle, $max_line_length);
                $header_colcount = count($header);
                while (($row = fgetcsv($handle, $max_line_length)) !== false) {
                    $row_colcount = count($row);
                    if ($row_colcount == $header_colcount) {
                        $entry = array_combine($header, $row);
                        $data[] = $entry;
                    } else {
                        return null;
                    }
                    $rowcount++;
                }
                fclose($handle);
            } else {
                return null;
            }

            foreach ($data as $iKey => $value) {
                $clientCode = $value["Código"];

                if (DB::table("clients")->where("code", '=', $clientCode)->count() < 1) {
                    Client::create(
                        [
                            'name' => (!isset($value['Nombre']) && empty($value['Nombre'])) ? null : $value['Nombre'],
                            'code' => $this->getNumberOrder(),
                            'adresse' => (!isset($value['Dirección']) && empty($value['Dirección'])) ? null : $value['Dirección'],
                            'phone' => (!isset($value['Número de teléfono']) && empty($value['Número de teléfono'])) ? null : $value['Número de teléfono'],
                            'email' => (!isset($value['Correo electrónico']) && empty($value['Correo electrónico'])) ? null : $value['Correo electrónico'],
                            'country' => (!isset($value['País']) && empty($value['País'])) ? null : $value['País'],
                            'city' => (!isset($value['Ciudad']) && empty($value['Ciudad'])) ? null : $value['Ciudad'],
                            'NIT' => (!isset($value['NIT']) && empty($value['NIT'])) ? null : $value['NIT'],
                            'DUI' => (!isset($value['DUI']) && empty($value['DUI'])) ? null : $value['DUI'],
                            'NRC' => (!isset($value['NRC']) && empty($value['NRC'])) ? null : $value['NRC'],
                            'giro' => (!isset($value['Giro']) && empty($value['Giro'])) ? null : $value['Giro'],
                            'big_consumer' => (!isset($value['Gran Contribuyente']) && empty($value['Gran Contribuyente'])) ? null : $value['Gran Contribuyente'],
                            'final_consumer' => (!isset($value['Consumidor Final']) && empty($value['Consumidor Final'])) ? null : $value['Consumidor Final'],
                        ]
                    );
                } else {
                    DB::table("clients")->where("code", '=', $clientCode)->update(
                        [
                            'name' => (!isset($value['Nombre']) && empty($value['Nombre'])) ? null : $value['Nombre'],
                            'adresse' => (!isset($value['Dirección']) && empty($value['Dirección'])) ? null : $value['Dirección'],
                            'phone' => (!isset($value['Número de teléfono']) && empty($value['Número de teléfono'])) ? null : $value['Número de teléfono'],
                            'email' => (!isset($value['Correo electrónico']) && empty($value['Correo electrónico'])) ? null : $value['Correo electrónico'],
                            'country' => (!isset($value['País']) && empty($value['País'])) ? null : $value['País'],
                            'city' => (!isset($value['Ciudad']) && empty($value['Ciudad'])) ? null : $value['Ciudad'],
                            'NIT' => (!isset($value['NIT']) && empty($value['NIT'])) ? null : $value['NIT'],
                            'DUI' => (!isset($value['DUI']) && empty($value['DUI'])) ? null : $value['DUI'],
                            'NRC' => (!isset($value['NRC']) && empty($value['NRC'])) ? null : $value['NRC'],
                            'giro' => (!isset($value['Giro']) && empty($value['Giro'])) ? null : $value['Giro'],
                            'big_consumer' => (!isset($value['Gran Contribuyente']) && empty($value['Gran Contribuyente'])) ? null : $value['Gran Contribuyente'],
                            'final_consumer' => (!isset($value['Consumidor Final']) && empty($value['Consumidor Final'])) ? null : $value['Consumidor Final'],
                        ]
                    );
                }
            }

            return response()->json([
                'status' => true,
            ], 200);
        }

    }

}
