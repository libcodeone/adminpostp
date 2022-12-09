<?php

namespace App\Http\Controllers;


use DB;
use Illuminate\Http\Request;
use App\Exports\AuditsExport;
use App\Models\User;
use Maatwebsite\Excel\Facades\Excel;

class AuditController extends BaseController
{
      public function index(Request $request)
    {
           // How many items do you want to display.
           $perPage = $request->limit;
           $pageStart = \Request::get('page', 1);
           // Start displaying items from this number;
           $offSet = ($pageStart * $perPage) - $perPage;
           $order = $request->SortField;
           $dir = $request->SortType;

            $audits = DB::table('audits')->select('audits.id','audits.event','audits.created_at','audits.auditable_type','audits.auditable_id','audits.url','audits.old_values','audits.new_values','users.username')->join('users', 'users.id', '=', 'audits.user_id')
            ->where(function ($query) use ($request) {
                return $query->when($request->filled('search'), function ($query) use ($request) {
                    return $query->where('audits.event', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.created_at', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.auditable_type', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.auditable_id', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.url', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.old_values', 'LIKE', "%{$request->search}%")
                        ->orWhere('audits.new_values', 'LIKE', "%{$request->search}%")
                        ->orWhere('users.username', 'LIKE', "%{$request->search}%");
                });
            });
            $totalRows = $audits->count();
            $data = array();
            $audits = $audits->offset($offSet)
            ->limit($perPage)
            ->orderBy('audits.'.$order, $dir)
            ->get();
            foreach ($audits as $audits_data) {
                               
                if( $audits_data->event == 'updated'){
                    $item['event'] = "Modificación";
                }
                if( $audits_data->event == 'created'){
                    $item['event'] = "Creación";
                }
                if( $audits_data->event == 'deleted'){
                    $item['event'] = "Eliminación";
                }
                
                if (strncmp($audits_data->new_values, '{"deleted_at', 12) === 0){
                    $item['event'] = "Eliminación";
                }
                $item['user_id'] = $audits_data->username;
                $item['auditable_id'] = $audits_data->auditable_id;
                $item['auditable_type'] = $audits_data->auditable_type;
                $item['old_values'] = $audits_data->old_values;
                $item['new_values'] = $audits_data->new_values;
                $item['url'] = $audits_data->url;
                $item['created_at'] = date('d/m/y H:m:s',strtotime($audits_data->created_at));
    
                $data[] = $item;
                }

        return response()->json([
            'audits' => $data,
            'totalRows' => $totalRows,
        ]);
       
    }


    public function exportExcel(Request $request)
    {
        
        return Excel::download(new AuditsExport, 'Audits.xlsx');
    }
}
