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

            // Relation avec clients : cascade OK (table différente)
            $table->foreignId('client_id')
                ->constrained('clients')
                ->onDelete('cascade');

            // Relations avec users -> PAS de cascade pour éviter multiple cascade paths
            $table->foreignId('project_responsible_id')
                ->nullable()
                ->constrained('users');

            $table->foreignId('conductor_id')
                ->nullable()
                ->constrained('users');

            $table->foreignId('worker_id')
                ->nullable()
                ->constrained('users');

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
