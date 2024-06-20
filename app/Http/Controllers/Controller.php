<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function getPermissions()
    {
        $userRole = json_decode(json_encode(Auth::user()->roles), true);

        if ($userRole[0]["status"] == 1)
            return Permission::all()->where('status', '=', 1)->pluck('name');
        else
            return Permission::all()->where('status', '=', 0)->pluck('name');
    }
}
