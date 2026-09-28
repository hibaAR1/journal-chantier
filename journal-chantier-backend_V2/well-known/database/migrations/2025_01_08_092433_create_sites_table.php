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
        Schema::create('sites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->foreignId('project_responsible_id')->constrained('users')->onDelete('cascade')->nullable();
            $table->foreignId('conductor_id')->constrained('users')->onDelete('cascade')->nullable();
            $table->foreignId('worker_id')->constrained('users')->onDelete('cascade')->nullable();
            $table->string('code', 15)->nullable();
            $table->string('name', 250);
            $table->string('address', 250);
            $table->integer('status')->default(1); // 1: active, 0: inactive
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sites');
    }
};
