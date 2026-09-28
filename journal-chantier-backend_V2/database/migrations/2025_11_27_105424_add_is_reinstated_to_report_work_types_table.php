<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('report_work_type', function (Blueprint $table) {
            $table->boolean('is_reinstated')
                ->nullable()
                ->default(false)
                ->after('is_reported');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report_work_type', function (Blueprint $table) {
            //
        });
    }
};
