<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            $table->id();
            $table->text('email',320);
            $table->string('first_name');
            $table->string('second_name')->nullable();
            $table->string('first_surname');
            $table->string('second_surname')->nullable();
            $table->string('number');
            $table->string('password');
            $table->unsignedBigInteger('image_id')->default('1');
            $table->unsignedBigInteger('rol_id');
            $table->unsignedBigInteger('sector_id');
        ];
    }
}
