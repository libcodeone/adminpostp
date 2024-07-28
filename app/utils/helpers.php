<?php
namespace App\utils;

use Throwable;
use App\Models\Role;
use App\Models\Setting;
use App\Models\Product;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\BaseController as Controller;

class helpers
{
    //  Helper Multiple Filter
    public function filter($model, $columns, $param, $request)
    {
        // Loop through the fields checking if they've been input, if they have add
        //  them to the query.
        $fields = [];
        for ($key = 0; $key < count($columns); $key++) {
            $fields[$key]['param'] = $param[$key];
            $fields[$key]['value'] = $columns[$key];
        }

        foreach ($fields as $field) {
            $model->where(function ($query) use ($request, $field, $model)
                {
                    $fieldValue = $field['value'];
                    $fieldParameter = $field['param'];

                    return $model->when($request->filled($fieldValue),
                        function ($query) use ($request, $model, $fieldParameter, $fieldValue) {
                            $requestFieldValue = $request[$fieldValue];

                            if($fieldParameter == 'like')
                                $model->where($fieldValue, 'like', "%".$requestFieldValue."%");
                            else if ($fieldParameter == '<>')
                                $model->where($fieldValue,'<>',$requestFieldValue);
                            else if ($fieldParameter == 'null')
                                $model->where($fieldValue,'',$requestFieldValue);
                            else if ($fieldParameter == 'many>1'){
                                $model->whereHas('categories', function (Builder $query) use ($requestFieldValue, $fieldValue){
                                    $query->where($fieldValue, '=', $requestFieldValue);
                                }, '>=', 1)->get();
                            } else
                                $model->where($fieldValue,$requestFieldValue);
                        }
                    );
                }
            );
        }

        return $model;
    }

    private function convertToCSV($csvBody, $csvHeaders, $filename)
    {
        $outputBuffer = fopen($filename, 'w', true);

        fputcsv($outputBuffer, $csvHeaders);

        foreach ($csvBody as $row)
            fputcsv($outputBuffer, $row);

        fclose($outputBuffer);
    }

    public function downloadSampleOfCSV(Request $request) {
        $baseController = new Controller();
        $baseController->authorizeForUser($request->user('api'), 'view', Product::class);

        $filename = $request->section . "_sample_" . date("Ymd_His") . ".csv";

        try
        {
            $csvBody = json_decode($request->dataArray, true);
            $csvHeaders = json_decode($request->csvHeaders, true);

            /*
            $csvConversionOutput = $this->convertToCSV($csvBody, $csvHeaders, $filename);

            $isFileClosed = $csvConversionOutput["file_is_closed"];
            */

            $filepath = tempnam(sys_get_temp_dir(), 'prefix_');

            $this->convertToCSV($csvBody, $csvHeaders, $filepath);

            $headers = [
                "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
                "Content-Type" => "text/csv; charset=utf-8",
                "Content-Disposition" => 'attachment; filename="' . $filename . '"',
                "Expires" => "0",
                "Pragma" => "public"
            ];

            return Response::make(
                [
                    'file' => File::get($filepath),
                    'filename' => $filename,
                    'errors' => null,
                    'message' => "¡La generación del archivo " . $filename . " fue exitosa!",
                    'success' => true
                ],
                200,
                $headers
            );
        }
        catch (Throwable $throwable)
        {
            $errors = $throwable->getMessage();

            return Response::json(
                [
                    'file' => null,
                    'filename' => null,
                    'errors' => $errors,
                    'message' => "¡La generación del archivo " . $filename . " fue fallida!",
                    'success' => false
                ]
            );
        }
    }

    //  Check If Hass Permission Show All records
    public function Show_Records($model)
    {
        $Role = Auth::user()->roles->first();
        $ShowRecord = Role::findOrFail($Role->id)->inRole('record_view');

        if (!$ShowRecord) {
            return $model->where('user_id', '=', Auth::user()->id);
        }
        return $model;
    }

    // Get Currency
    public function Get_Currency()
    {
        $settings = Setting::with('Currency')->where('deleted_at', '=', null)->first();

        if ($settings && $settings->currency_id) {
            if (Currency::where('id', $settings->currency_id)
                ->where('deleted_at', '=', null)
                ->first()) {
                $symbol = $settings['Currency']->symbol;
            } else {
                $symbol = '';
            }
        } else {
            $symbol = '';
        }
        return $symbol;
    }

    // Get Currency COde
    public function Get_Currency_Code()
    {
        $settings = Setting::with('Currency')->where('deleted_at', '=', null)->first();

        if ($settings && $settings->currency_id) {
            if (Currency::where('id', $settings->currency_id)
                ->where('deleted_at', '=', null)
                ->first()) {
                $code = $settings['Currency']->code;
            } else {
                $code = 'usd';
            }
        } else {
            $code = 'usd';
        }
        return $code;
    }

}
