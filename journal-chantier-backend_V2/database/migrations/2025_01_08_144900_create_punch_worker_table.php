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
        Schema::create('punch_worker', function (Blueprint $table) {
            $table->id();

            // Pas de cascade pour SQL Server
            $table->foreignId('punch_id')
                ->constrained('punches');

            $table->foreignId('worker_id')
                ->constrained('workers');

            $table->integer('type');
            $table->integer('natural_hours')->default(0);
            $table->integer('overtime_hours')->default(0);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('punch_worker');
    }
};
