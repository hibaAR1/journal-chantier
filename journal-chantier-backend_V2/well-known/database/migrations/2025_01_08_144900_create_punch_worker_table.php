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
            $table->foreignId('punch_id')->constrained('punches')->onDelete('cascade');
            $table->foreignId('worker_id')->constrained('workers')->onDelete('cascade');
            $table->integer('type'); // 1 => Service Normal / 2 => Travail à la tache / 3 => Travail Multiple / 4 => Licencié / 5 => Absent autorisé / 6 => Absent non autorisé / 7 => Malade
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
