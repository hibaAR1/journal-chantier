<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('work_types', function (Blueprint $table) {
            $table->decimal('t_u', 10, 3)->nullable()->after('name');
            $table->char('scope', 1)->default('G')->after('t_u');
            $table->unsignedBigInteger('site_id')->nullable()->after('scope');
            $table->foreign('site_id')
                ->references('id')
                ->on('sites')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('work_types', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropColumn(['t_u', 'scope', 'site_id']);
        });
    }
};
