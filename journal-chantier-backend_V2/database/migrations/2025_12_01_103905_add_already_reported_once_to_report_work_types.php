<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('report_work_type', function (Blueprint $table) {
            $table->boolean('already_reported_once')->default(0)->after('is_reported');
        });
    }

    public function down()
    {
        Schema::table('report_work_type', function (Blueprint $table) {
            $table->dropColumn('already_reported_once');
        });
    }
};
