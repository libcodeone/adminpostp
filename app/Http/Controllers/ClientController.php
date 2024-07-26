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
            $accents = array(
                'à'=>'a', 'á'=>'a', 'â'=>'a', 'ã'=>'a', 'ä'=>'a', 'å'=>'a', 'æ'=>'a',
                'À'=>'A', 'Á'=>'A', 'Â'=>'A', 'Ã'=>'A', 'Ä'=>'A', 'Å'=>'A', 'Æ'=>'A',
                'ß'=>'B', 'ç'=>'c', 'Ç'=>'C',
                'è'=>'e', 'é'=>'e', 'ê'=>'e', 'ë'=>'e',
                'È'=>'E', 'É'=>'E', 'Ê'=>'E', 'Ë'=>'E',
                'ì'=>'i', 'í'=>'i', 'î'=>'i', 'ï'=>'i',
                'Ì'=>'I', 'Í'=>'I', 'Î'=>'I', 'Ï'=>'I',
                'ñ'=>'n', 'Ñ'=>'N',
                'ò'=>'o', 'ó'=>'o', 'ô'=>'o', 'õ'=>'o', 'ö'=>'o',
                'Ò'=>'O', 'Ó'=>'O', 'Ô'=>'O', 'Õ'=>'O', 'Ö'=>'O',
                'š'=>'s', 'Š'=>'S',
                'ù'=>'u', 'ú'=>'u', 'û'=>'u', 'ü'=>'u',
                'Ù'=>'U', 'Ú'=>'U', 'Û'=>'U', 'Ü'=>'U',
                'ý'=>'y', 'Ý'=>'Y', 'ž'=>'z', 'Ž'=>'Z'
            );
            $data = array();
            $rowcount = 0;
            if (($handle = fopen($file_upload, "r")) !== false) {
                $max_line_length = defined('MAX_LINE_LENGTH') ? ClientController::MAX_LINE_LENGTH : 10000;
                $header = fgetcsv($handle, $max_line_length);
                $header = array_map(
                    function ($key) use ($accents) {
                        return strtolower(strtr($key, $accents));
                    }, $header
                );
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
                if (isset($value['codigo']) && !empty($value['codigo'])) {
                    $clientCode = $value['codigo'];

                    if (DB::table("clients")->where("code", '=', $clientCode)->count() >= 1) {
                        DB::table("clients")->where("code", '=', $clientCode)->update(
                            [
                                'name' => (!isset($value['nombre']) && empty($value['nombre'])) ? '' : $value['nombre'],
                                'adresse' => (!isset($value['direccion']) && empty($value['direccion'])) ? '' : $value['direccion'],
                                'phone' => (!isset($value['numero de telefono']) && empty($value['numero de telefono'])) ? '' : $value['numero de telefono'],
                                'email' => (!isset($value['correo electronico']) && empty($value['correo electronico'])) ? '' : $value['correo electronico'],
                                'country' => (!isset($value['pais']) && empty($value['pais'])) ? 'El Salvador' : $value['pais'],
                                'city' => (!isset($value['ciudad']) && empty($value['ciudad'])) ? 'San Salvador' : $value['ciudad'],
                                'nit' => (!isset($value['nit']) && empty($value['nit'])) ? '' : $value['nit'],
                                'DUI' => (!isset($value['dui']) && empty($value['dui'])) ? '' : $value['dui'],
                                'NRC' => (!isset($value['nrc']) && empty($value['nrc'])) ? '' : $value['nrc'],
                                'giro' => (!isset($value['giro']) && empty($value['giro'])) ? '' : $value['giro'],
                                'big_consumer' => (!isset($value['gran contribuyente']) && empty($value['gran contribuyente'])) ? 0 : $value['gran contribuyente'],
                                'final_consumer' => (!isset($value['Cconsumidor final']) && empty($value['consumidor final'])) ? 0 : $value['consumidor final']
                            ]
                        );
                    }
                } else {
                    Client::create(
                        [
                            'name' => (!isset($value['nombre']) && empty($value['nombre'])) ? '' : $value['nombre'],
                            'code' => $this->getNumberOrder(),
                            'adresse' => (!isset($value['direccion']) && empty($value['direccion'])) ? '' : $value['direccion'],
                            'phone' => (!isset($value['numero de telefono']) && empty($value['numero de telefono'])) ? '' : $value['numero de telefono'],
                            'email' => (!isset($value['correo electronico']) && empty($value['correo electronico'])) ? '' : $value['correo electronico'],
                            'country' => (!isset($value['pais']) && empty($value['pais'])) ? 'El Salvador' : $value['pais'],
                            'city' => (!isset($value['ciudad']) && empty($value['ciudad'])) ? 'San Salvador' : $value['ciudad'],
                            'NIT' => (!isset($value['nit']) && empty($value['nit'])) ? '' : $value['nit'],
                            'DUI' => (!isset($value['dui']) && empty($value['dui'])) ? '' : $value['dui'],
                            'NRC' => (!isset($value['nrc']) && empty($value['nrc'])) ? '' : $value['nrc'],
                            'giro' => (!isset($value['giro']) && empty($value['giro'])) ? '' : $value['giro'],
                            'big_consumer' => (!isset($value['gran contribuyente']) && empty($value['gran contribuyente'])) ? 0 : $value['gran contribuyente'],
                            'final_consumer' => (!isset($value['consumidor final']) && empty($value['consumidor final'])) ? 0 : $value['consumidor final']
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
