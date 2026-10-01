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
        Schema::create('understanding_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('knowledge_id')->constrained('knowledges')->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->longText('content');
            $table->timestamp('created_at')->nullable();

            $table->unique(['knowledge_id', 'version']);
            $table->index('knowledge_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('understanding_versions');
    }
};
