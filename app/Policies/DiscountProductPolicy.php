<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Permission;
use App\Models\DiscountProduct;
use Illuminate\Auth\Access\HandlesAuthorization;

class DiscountProductPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user, DiscountProduct $discountProduct)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user)
    {
        $permission = Permission::where('name', 'products_discounts_view')->first();
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
        $permission = Permission::where('name', 'products_discounts_create')->first();
        return $user->hasRole($permission->roles);
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user)
    {
        $permission = Permission::where('name', 'products_discounts_edit')->first();
        return $user->hasRole($permission->roles);
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user)
    {
        $permission = Permission::where('name', 'products_discounts_delete')->first();
        return $user->hasRole($permission->roles);
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, DiscountProduct $discountProduct)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\DiscountProduct  $discountProduct
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, DiscountProduct $discountProduct)
    {
        //
    }
}
