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
        Schema::create('movements', function (Blueprint $table) {
            $table->id();
//            $table->foreignId('site_id')->constrained('sites')->onDelete('cascade');
//            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
//            $table->foreignId('supplier_id')->constrained('suppliers')->onDelete('cascade');
//            $table->string('code', 15)->nullable();
//            $table->date('date');
//            $table->integer('type'); // 1 => 'entry', 2 => 'exit', 3 => 'transfer'
//            $table->double('quantity')->default(0);
//            $table->integer('coefficient')->nullable()->default(1); // Coefficient for conversion 1 if entry -1 if exit
//            $table->string('delivery_num', 150)->nullable();
//            $table->string('receipt_num', 150)->nullable();
//            $table->string('exit_num', 150)->nullable();
//            $table->string('transfer_num', 150)->nullable();
//            $table->text('observation')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
