<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reaction', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('message_id');
            /* -- Uniques */
            $table->unique(['user_id', 'message_id'], 'uk_reaction_user_msg');
            /* -- Llaves foraneas */
            $table->foreign('user_id','fk_reaction_user_id')->references('id')->on('user')->onDelete('cascade');
            $table->foreign('message_id','fk_reaction_message_id')->references('id')->on('message')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reaction');
    }
};
