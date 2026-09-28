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
        Schema::create('assignment_worker', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_id')->constrained("workers")->cascadeOnDelete();
            $table->foreignId('assignment_id')->constrained("assignments")->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assignment_worker');
    }
};
