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
        Schema::create('message', function (Blueprint $table) {
            $table->id();
            $table->string('code',10);
            $table->text('text',800)->nullable();
            $table->timestamp('date');
            $table->integer('likes')->default(0);
            $table->integer('responses')->default(0);
            $table->unsignedBigInteger('status_id')->default(1);
            $table->unsignedBigInteger('reply_to')->nullable();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('image_id')->nullable();
            /* -- Uniques */
            $table->unique('code', 'uk_message_code');
            /* -- Llaves foraneas */
            $table->foreign('status_id','fk_message_status_id')->references('id')->on('status')->onDelete('cascade');
            $table->foreign('reply_to','fk_message_message_id')->references('id')->on('message')->onDelete('cascade');
            $table->foreign('user_id','fk_message_user_id')->references('id')->on('user')->onDelete('cascade');
            $table->foreign('image_id','fk_message_image_id')->references('id')->on('image')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('message');
    }
};
