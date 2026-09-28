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
        Schema::create('report_work_type_worker', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_work_type_id')->constrained('report_work_type')->onDelete('cascade');
            $table->foreignId('worker_id')->constrained()->onDelete('cascade');
            $table->string('code')->nullable();
            $table->double('normal_hours')->nullable();
            $table->double('overtime_hours')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_work_type_worker');
    }
};
