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
        Schema::create('report_work_type', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('reports');
            $table->foreignId('work_type_id')->constrained('work_types');
            $table->foreignId('site_location_id')->constrained('site_location');
            $table->string('code')->nullable();
            $table->double('stat_work')->nullable();
            $table->double('quantity_completed')->nullable();
            $table->text('observations')->nullable();
            $table->timestamps();
            $table->softDeletes();
            //            $table->integer('number_qualified')->nullable();
            //            $table->integer('number_workers')->nullable();
            //            $table->integer('number_hours_natural_qualified')->nullable();
            //            $table->integer('number_hours_natural_workers')->nullable();
            //            $table->integer('number_hours_overtime_qualified')->nullable();
            //            $table->integer('number_hours_overtime_workers')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_work_type');
    }
};
