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
        Schema::create('user', function (Blueprint $table) {
            $table->id();
            $table->text('email',320);
            $table->string('first_name', 30);
            $table->string('second_name', 40)->nullable();
            $table->string('first_surname', 30);
            $table->string('second_surname', 30)->nullable();
            $table->string('number', 10);
            $table->text('password');
            $table->unsignedBigInteger('image_id')->default('1');
            $table->unsignedBigInteger('rol_id');
            $table->unsignedBigInteger('sector_id')->default('1');
            $table->date('changed_password')->nullable()->default(NULL);
            $table->date('changed_birthday')->default('2022-04-12');
            $table->date('birthday');
            /* -- Uniques */
            $table->unique('email', 'uk_user_email');
            $table->unique('number', 'uk_user_number');
            /* -- Llaves foraneas */
            $table->foreign('image_id','fk_user_image_id')->references('id')->on('image')->onDelete('cascade');
            $table->foreign('rol_id','fk_user_rol_id')->references('id')->on('rol')->onDelete('cascade');
            $table->foreign('sector_id','fk_user_sector_id')->references('id')->on('sector')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user');
    }
};
