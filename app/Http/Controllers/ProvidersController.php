<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\utils\helpers;
use App\Models\Provider;
use Illuminate\Http\Request;
use App\Exports\ProvidersExport;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

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
                    return $query->where('name', 'LIKE', "%{$request->search}%")
                        ->orWhere('code', 'LIKE', "%{$request->search}%")
                        ->orWhere('phone', 'LIKE', "%{$request->search}%")
                        ->orWhere('email', 'LIKE', "%{$request->search}%");
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

        if ($last) {
            $code = $last->code + 1;
        } else {
            $code = 1;
        }
        return $code;
    }

    // import providers
    public function import_providers(Request $request)
    {
        $file_upload = $request->file('providers');
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
                $max_line_length = defined('MAX_LINE_LENGTH') ? ProvidersController::MAX_LINE_LENGTH : 10000;
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
                    } else
                        return null;

                    $rowcount++;
                }
                fclose($handle);
            } else
                return null;

            //-- Create New Provider
            foreach ($data as $iKey => $value) {
                if (isset($value['codigo']) && !empty($value['codigo'])) {
                    $providerCode = $value['codigo'];

                    if (DB::table("providers")->where("code", '=', $providerCode)->count() >= 1) {
                        DB::table("providers")->where("code", '=', $providerCode)->update(
                            [
                                'name' => (!isset($value['nombre']) && empty($value['nombre'])) ? '' : $value['nombre'],
                                'adresse' => (!isset($value['direccion']) && empty($value['direccion'])) ? '' : $value['direccion'],
                                'phone' => (!isset($value['numero de telefono']) && empty($value['numero de telefono'])) ? '' : $value['numero de telefono'],
                                'email' => (!isset($value['correo electronico']) && empty($value['correo electronico'])) ? '' : $value['correo electronico'],
                                'country' => (!isset($value['pais']) && empty($value['pais'])) ? 'El Salvador' : $value['pais'],
                                'city' => (!isset($value['ciudad']) && empty($value['ciudad'])) ? 'San Salvador' : $value['ciudad']
                            ]
                        );
                    }
                } else {
                    Provider::create(
                        [
                            'name' => (!isset($value['nombre']) && empty($value['nombre'])) ? '' : $value['nombre'],
                            'code' => $this->getNumberOrder(),
                            'adresse' => (!isset($value['direccion']) && empty($value['direccion'])) ? '' : $value['direccion'],
                            'phone' => (!isset($value['numero de telefono']) && empty($value['numero de telefono'])) ? '' : $value['numero de telefono'],
                            'email' => (!isset($value['correo electronico']) && empty($value['correo electronico'])) ? '' : $value['correo electronico'],
                            'country' => (!isset($value['pais']) && empty($value['pais'])) ? 'El Salvador' : $value['pais'],
                            'city' => (!isset($value['ciudad']) && empty($value['ciudad'])) ? 'San Salvador' : $value['ciudad']
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
