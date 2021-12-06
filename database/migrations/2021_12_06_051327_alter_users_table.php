<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            //
            $table->integer('initCCF')->nullable()->after('statut');
            $table->integer('currentCCF')->nullable()->after('statut');
            $table->integer('finalCCF')->nullable()->after('statut');
            $table->integer('initCF')->nullable()->after('statut');
            $table->integer('currentCF')->nullable()->after('statut');
            $table->integer('finalCF')->nullable()->after('statut');
            $table->integer('warehouse_id')->nullable()->index('warehouse_id')->after('statut');
            $table->foreign('warehouse_id', 'users_warehouse_id')->references('id')->on('warehouses')->onUpdate('RESTRICT')->onDelete('RESTRICT');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            //
        });
    }
}
