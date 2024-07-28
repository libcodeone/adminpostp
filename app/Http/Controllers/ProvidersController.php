<?php

namespace App\Http\Controllers;

use Throwable;
use Carbon\Carbon;
use App\utils\helpers;
use App\Models\Provider;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Exports\ProvidersExport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use PhpOffice\PhpSpreadsheet\Writer\Csv as CsvWriter;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use PhpOffice\PhpSpreadsheet\Reader\Xls as XlsReader;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx as XlsxReader;

class ProvidersController extends BaseController
{
    private const MAX_LINE_LENGTH = 10000;

    //----------- Get ALL Suppliers-------\\

    public function index(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Provider::class);

        // How many items do you want to display.
        $perPage = $request->limit;
        $pageStart = $request->get('page', 1);
        // Start displaying items from this number;
        $offSet = ($pageStart * $perPage) - $perPage;
        $order = $request->SortField;
        $dir = $request->SortType;
        $helpers = new helpers();
        // Filter fields With Params to retrieve
        $columns = array(0 => 'name', 1 => 'code', 2 => 'phone', 3 => 'email');
        $param = array(0 => 'like', 1 => 'like', 2 => 'like', 3 => 'like');

        $providers = Provider::where('deleted_at', '=', null);

        //Multiple Filter
        $Filtred = $helpers->filter($providers, $columns, $param, $request)
        // Search With Multiple Param
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('name', 'LIKE', "%$request->search%")
                        ->orWhere('code', 'LIKE', "%$request->search%")
                        ->orWhere('phone', 'LIKE', "%$request->search%")
                        ->orWhere('email', 'LIKE', "%$request->search%");
                });
            });
        $totalRows = $Filtred->count();
        $providers = $Filtred->offset($offSet)
            ->limit($perPage)
            ->orderBy($order, $dir)
            ->get();

        return response()->json([
            'providers' => $providers,
            'totalRows' => $totalRows,
        ]);
    }

    //----------- Store new Supplier -------\\

    public function store(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'create', Provider::class);

        request()->validate([
            'name' => 'required|min:4|max:30',
            'email' => 'required',
            'phone' => 'required|min:4',
            'country' => 'required',
            'city' => 'required',
            'adresse' => 'required',
        ]);
        Provider::create([
            'name' => $request['name'],
            'code' => $this->getNumberOrder(),
            'adresse' => $request['adresse'],
            'phone' => $request['phone'],
            'email' => $request['email'],
            'country' => $request['country'],
            'city' => $request['city'],
        ]);
        return response()->json(['success' => true]);

    }

    //----------- Update Supplier-------\\

    public function update(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'update', Provider::class);

        request()->validate([
            'name' => 'required|min:4|max:30',
            'email' => 'required',
            'phone' => 'required|min:4',
            'country' => 'required',
            'city' => 'required',
            'adresse' => 'required',
        ]);

        Provider::whereId($id)->update([
            'name' => $request['name'],
            'adresse' => $request['adresse'],
            'phone' => $request['phone'],
            'email' => $request['email'],
            'country' => $request['country'],
            'city' => $request['city'],
        ]);
        return response()->json(['success' => true]);

    }

    //----------- Remdeleteove Provider-------\\

    public function destroy(Request $request, $id)
    {
        $this->authorizeForUser($request->user('api'), 'delete', Provider::class);

        Provider::whereId($id)->update([
            'deleted_at' => Carbon::now(),
        ]);
        return response()->json(['success' => true]);

    }

    //-------------- Delete by selection  ---------------\\

    public function delete_by_selection(Request $request)
    {

        $this->authorizeForUser($request->user('api'), 'delete', Provider::class);

        $selectedIds = $request->selectedIds;
        foreach ($selectedIds as $Provider_id) {
            Provider::whereId($Provider_id)->update([
                'deleted_at' => Carbon::now(),
            ]);
        }
        return response()->json(['success' => true]);
    }

    //----------- Export Excel ALL Suppliers-------\\

    public function exportExcel(Request $request)
    {
        $this->authorizeForUser($request->user('api'), 'view', Provider::class);

        return Excel::download(new ProvidersExport, 'Lista_de_Proveedores.xlsx', \Maatwebsite\Excel\Excel::XLSX,
            [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="Lista_de_Proveedores.xlsx"',
            ]
        );
    }

    //----------- get Number Order Of Suppliers-------\\

    public function getNumberOrder()
    {
        $last = DB::table('providers')->latest('id')->first();

        if ($last)
            $code = $last->code + 1;
        else
            $code = 1;

        return $code;
    }

    // import providers
    public function import_providers(Request $request)
    {
        try
        {
            $user = $request->user('api');
            $this->authorizeForUser($user, 'view', Provider::class);

            $fileUploaded = $request->file('providers');

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
                    $csvFilePath = storage_path("app/public/converted_providers-" . Str::random(16) . ".csv");
                    $writer->save($csvFilePath);
                } else if ($fileExtension === "xlsx") {
                    $xlsxReader = new XlsxReader();
                    $xlsx = $xlsxReader->load($filePath);

                    $writer = new CsvWriter($xlsx);
                    $csvFilePath = storage_path("app/public/converted_providers-" . Str::random(16) . ".csv");
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
                    $max_line_length = defined('MAX_LINE_LENGTH') ? ProvidersController::MAX_LINE_LENGTH : 10000;
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

                //-- Create New Provider
                foreach ($data as $iKey => $value) {
                    $name = (isset($value["nombre"]) && !empty($value["nombre"])) ? $value["nombre"] : '';
                    $address = (isset($value["direccion"]) && !empty($value["direccion"])) ? $value["direccion"] : '';
                    $phone = (isset($value["telefono"]) && !empty($value["telefono"])) ? $value["telefono"] : '';
                    $email = (isset($value["email"]) && !empty($value["email"])) ? $value["email"] : '';
                    $country = (isset($value["pais"]) && !empty($value["pais"])) ? $value["pais"] : 'El Salvador';
                    $city = (isset($value["ciudad"]) && !empty($value["ciudad"])) ? $value["ciudad"] : 'San Salvador';

                    if (isset($value["codigo"]) && !empty($value["codigo"])) {
                        $providerCode = $value["codigo"];

                        if (DB::table("providers")->where("code", '=', $providerCode)->count() >= 1) {
                            DB::table("providers")->where("code", '=', $providerCode)->update(
                                [
                                    'name' => $name,
                                    'adresse' => $address,
                                    'phone' => $phone,
                                    'email' => $email,
                                    'country' => $country,
                                    'city' => $city
                                ]
                            );
                        }
                    } else {
                        $code = $this->getNumberOrder();

                        Provider::create(
                            [
                                'name' => $name,
                                'code' => $code,
                                'adresse' => $address,
                                'phone' => $phone,
                                'email' => $email,
                                'country' => $country,
                                'city' => $city
                            ]
                        );
                    }
                }

                if (isset($writer) && isset($csvFilePath))
                    unlink($csvFilePath);

                return response()->json(
                    [
                        'status' => true,
                    ],
                    200
                );
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
