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
        Schema::table('report_work_type', function (Blueprint $table) {
            $table->boolean('is_reported')->default(false)->after('quantity_completed');
            $table->date('original_report_date')->nullable()->after('is_reported');
            $table->integer('original_stat_work')->nullable()->after('stat_work');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('report_work_type', function (Blueprint $table) {
            $table->dropColumn(['is_reported', 'original_report_date']);
        });
    }
};
