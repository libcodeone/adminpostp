<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Permission;
use App\Models\PosAuthToken;
use Illuminate\Auth\Access\HandlesAuthorization;

class PosAuthTokenPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user, PosAuthToken $token)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PosAuthToken  $posAuthToken
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user)
    {
        $permission = Permission::where('name', 'posAuthTokenVal')->first();
        return $user->hasRole($permission->roles);
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        $permission = Permission::where('name', 'posAuthTokenGen')->first();
        return $user->hasRole($permission->roles);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PosAuthToken  $posAuthToken
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user)
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PosAuthToken  $posAuthToken
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user)
    {
        //
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PosAuthToken  $posAuthToken
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, PosAuthToken $posAuthToken)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\PosAuthToken  $posAuthToken
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, PosAuthToken $posAuthToken)
    {
        //
    }
}
