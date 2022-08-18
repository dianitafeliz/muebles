<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sector extends Model
{
    use HasFactory;

    protected $table = 'sector';
    /* El siguiente código va pero para versiones futuras */
    protected $fillable = ['area', 'position'];
    
    public $timestamps = false;
}
