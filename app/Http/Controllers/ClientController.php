<?php

namespace App\Http\Controllers;

use Throwable;
use Carbon\Carbon;
use App\Models\Sale;
use App\Models\Client;
use App\utils\helpers;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Exports\ClientsExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Writer\Csv as CsvWriter;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use PhpOffice\PhpSpreadsheet\Reader\Xls as XlsReader;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;

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
                    return $query->where('name', 'LIKE', "%$request->search%")
                        ->orWhere('code', 'LIKE', "%$request->search%")
                        ->orWhere('phone', 'LIKE', "%$request->search%")
                        ->orWhere('NIT', 'LIKE', "%$request->search%")
                        ->orWhere('DUI', 'LIKE', "%$request->search%")
                        ->orWhere('NRC', 'LIKE', "%$request->search%")
                        ->orWhere('giro', 'LIKE', "%$request->search%")
                        ->orWhere('email', 'LIKE', "%$request->search%");
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
        try
        {
            $fileUploaded = $request->file('clients');

            $fileName = $fileUploaded->getClientOriginalName();
            $filePath = $fileUploaded->getPathname();
            $fileExtension = pathinfo($fileName, PATHINFO_EXTENSION);

            if ($fileExtension !== "xls" && $fileExtension !== "xlsx" && $fileExtension !== "csv") {
                return response()->json(
                    [
                        'message' => '¡El archivo debe estar en formato csv, xls o xlsx!',
                        'status' => false
                    ]
                );
            } else {
                if ($fileExtension === "xls") {
                    $xlsReader = new XlsReader();
                    $xls = $xlsReader->load($filePath);

                    $writer = new CsvWriter($xls);
                    $csvFilePath = storage_path("app/public/converted_clients-" . Str::random(16) . ".csv");
                    $writer->save($csvFilePath);
                } else {
                    $xlsxReader = new XlsxReader();
                    $xlsx = $xlsxReader->load($filePath);

                    $writer = new CsvWriter($xlsx);
                    $csvFilePath = storage_path("app/public/converted_clients-" . Str::random(16) . ".csv");
                    $writer->save($csvFilePath);
                }

                $fileUploaded = (isset($writer) && isset($csvFilePath)) ? $csvFilePath : $fileUploaded;

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
                if (($handle = fopen($fileUploaded, "r")) !== false) {
                    $max_line_length = defined('MAX_LINE_LENGTH') ? ClientController::MAX_LINE_LENGTH : 10000;
                    $header = fgetcsv($handle, $max_line_length);

                    if (count($header) < 2) {
                        return response()->json(
                            [
                                'message' => '¡Los campos del archivo en formato csv deben estar separados por comas!',
                                'status' => false
                            ]
                        );
                    }

                    $header = array_map(
                        function ($key) use ($accents) {
                            $string = strtolower(strtr($key, $accents));

                            $string = filter_var($string, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_STRIP_HIGH);

                            if (!mb_check_encoding($string, 'UTF-8'))
                                $string = mb_convert_encoding($string, 'UTF-8', 'ISO-8859-1');

                            $string = utf8_encode($string);

                            return $string;
                        }, $header
                    );
                    $header_colcount = count($header);
                    while (($row = fgetcsv($handle, $max_line_length)) !== false) {
                        $row_colcount = count($row);
                        if ($row_colcount == $header_colcount) {
                            $entry = array_map(
                                function ($value) {
                                    $parsedValue = null;

                                    if (is_numeric($value)) {
                                        if (is_integer($value))
                                            $parsedValue = (int)$value;
                                        else
                                            $parsedValue = (float)$value;
                                    }
                                    else
                                        $parsedValue = $value;

                                    return $parsedValue;
                                }, $row
                            );

                            $entry = array_combine($header, $entry);

                            $data[] = $entry;
                        } else
                            return null;

                        $rowcount++;
                    }
                    fclose($handle);
                } else
                    return null;


                foreach ($data as $iKey => $value) {
                    $clientName = (isset($value["nombre"]) && !empty($value["nombre"])) ? $value["nombre"] : '';
                    $clientAddress = (isset($value["direccion"]) && !empty($value["direccion"])) ? $value["direccion"] : '';
                    $clientPhone = (isset($value["telefono"]) && !empty($value["telefono"])) ? $value["telefono"] : '';
                    $clientEmail = (isset($value["email"]) && !empty($value["email"])) ? $value["email"] : '';
                    $clientCountry = (isset($value["pais"]) && !empty($value["pais"])) ? $value["pais"] : 'El Salvador';
                    $clientCity = (isset($value["ciudad"]) && !empty($value["ciudad"])) ? $value["ciudad"] : 'San Salvador';
                    $clientNIT = (isset($value["nit"]) && !empty($value["nit"])) ? $value["nit"] : '';
                    $clientDUI = (isset($value["dui"]) && !empty($value["dui"])) ? $value["dui"] : '';
                    $clientNRC = (isset($value["nrc"]) && !empty($value["nrc"])) ? $value["nrc"] : '';
                    $clientGiro = (isset($value["giro"]) && !empty($value["giro"])) ? $value["giro"] : '';
                    $clientBigConsumer = (isset($value["gran_contribuyente"]) && !empty($value["gran_contribuyente"])) ? $value["gran_contribuyente"] : 0;
                    $clientFinalConsumer = (isset($value["consumidor_final"]) && !empty($value["consumidor_final"])) ? $value["consumidor_final"] : 0;

                    if (isset($value["codigo"]) && !empty($value["codigo"])) {
                        $clientCode = $value["codigo"];

                        if (DB::table("clients")->where("code", '=', $clientCode)->count() >= 1) {
                            DB::table("clients")->where("code", '=', $clientCode)->update(
                                [
                                    'name' => $clientName,
                                    'adresse' => $clientAddress,
                                    'phone' => $clientPhone,
                                    'email' => $clientEmail,
                                    'country' => $clientCountry,
                                    'city' => $clientCity,
                                    'NIT' => $clientNIT,
                                    'DUI' => $clientDUI,
                                    'NRC' => $clientNRC,
                                    'giro' => $clientGiro,
                                    'big_consumer' => $clientBigConsumer,
                                    'final_consumer' => $clientFinalConsumer
                                ]
                            );
                        }
                    } else {
                        $clientCode = $this->getNumberOrder();

                        Client::create(
                            [
                                'name' => $clientName,
                                'code' => $clientCode,
                                'adresse' => $clientAddress,
                                'phone' => $clientPhone,
                                'email' => $clientEmail,
                                'country' => $clientCountry,
                                'city' => $clientCity,
                                'NIT' => $clientNIT,
                                'DUI' => $clientDUI,
                                'NRC' => $clientNRC,
                                'giro' => $clientGiro,
                                'big_consumer' => $clientBigConsumer,
                                'final_consumer' => $clientFinalConsumer
                            ]
                        );
                    }
                }

                if (isset($writer) && isset($csvFilePath))
                    unlink($csvFilePath);

                return response()->json([
                    'status' => true,
                ], 200);
            }
        }
        catch (Throwable $throwable)
        {
            $message = $throwable->getMessage();

            Log::error($message);

            return response()->json(
                [
                    "message" => "¡Error al importar archivo!",
                    "status" => false
                ]
            );
        }
    }
}
