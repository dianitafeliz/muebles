<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $table = 'message';
    protected $fillable = ['text', 'likes', 'responses', 'reply_to','image_id', 'code', 'user_id', 'date'];
    
    public $timestamps = false;

}
