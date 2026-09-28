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
        Schema::create('site_location', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');
            $table->foreignId('location_id')->constrained('locations')->onDelete('cascade');
            $table->string('code')->nullable();
            $table->string('block', 255);
            $table->string('element', 255);
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
        Schema::dropIfExists('site_location');
    }
};
