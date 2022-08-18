<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\CommentaryController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Notification;
use App\Notifications\TestNotification;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::group(['middleware' => ['cors']], function () {

/*     //Enviar email de prueba
    Route::get('/pruebaemail',function(){
        Notification::route('mail', 'diana@example.com')->notify(new TestNotification());
    }); */
//Limpiar caché
    Route::get('/clear', function() {
        Artisan::call('cache:clear');
        Artisan::call('config:cache');
        Artisan::call('view:clear');
        return "Cleared!";
    });

//Crear acceso directo a storage en public
    Route::get('/storage-link', function(){
        Artisan::call('storage:link');
    });
//Obtener cantidad de comentarios y restar de acuerdo a eso
Route::get('commentaries/{id}', [MessageController::class, 'getcommentarieslist']);

//Cambiar foto de perfil
Route::post('/user/changedProPic', [UserController::class, 'set_profile_image']);

//Obtener el imagen de perfil de acuerdo a la publicación
Route::get('user/image/{id}', [UserController::class, 'get_profile_image']); //mostrar registros

Route::delete('/image/delete/{id}', [ImageController::class, 'destroy']);

Route::post('/message/image', [ImageController::class, 'store']);

Route::post('/user/changedPassword', [UserController::class, 'mod_pass']);

//Actualizar el número de responses de la publicación(suma)
Route::post('/messager_incr/{id}', [MessageController::class,'updateresponses_incr']); //modificar registros
//Actualizar el número de responses de la publicación(resta)
Route::post('/messager_decr/{id}/{current_id}', [MessageController::class,'updateresponses_decr']);
//Actualizar el número de responses de la publicación(resta simple)
Route::post('/smessager_decr/{id}/{num}', [MessageController::class,'simpleupdateresponses_decr']);

Route::middleware('auth:API')->get('/user', function (Request $request) {
    return $request->user();
});
//restaurar la contraseña
Route::post('/user/restore', [UserController::class, 'restore_pass']);

//Obtener el cambio de contraseña
Route::get('/user/changedPassword', [UserController::class, 'get_password']);

//Crear mensaje 
Route::post('/message/create', [MessageController::class,'create']);

//Modificar mensaje
Route::get('/message/prueba', [MessageController::class,'prueba']); //modificar registros

//Modificar mensaje
Route::put('/message/update/{id}', [MessageController::class,'update']); //modificar registros

//Obtener el post a modificar
Route::get('/post/{id}', [MessageController::class, 'edit']); //mostrar registros


//Obtener los comentarios de una publicación
Route::get('/message/{id}', [MessageController::class, 'show']); //mostrar registros

//Actualizar el número de likes de la publicación(suma)
Route::put('/message_incr/{id}', [MessageController::class,'updatelikes_incr']); //modificar registros
//Actualizar el número de likes de la publicación(resta)
Route::put('/message_decr/{id}', [MessageController::class,'updatelikes_decr']);
//Traer los datos si el usuario ha reaccionado a la publicacion
Route::get('/reaction/{id}', [ReactionController::class, 'edit']); //mostrar registros
//Eliminar resgitro de reacción
Route::delete('/reaction/{id}', [ReactionController::class, 'destroy']); //Eliminar registros
//Crear Reacción
Route::post('/reaction', [ReactionController::class, 'store']);
/* Route::get('user', 'UserController@index'); */
/* Route::group(['middleware' => 'auth:api'], function () { });*/
Route::get('/user', [UserController::class, 'index']); //mostrar registros
Route::post('/user', [UserController::class, 'index']); //Crear registros

Route::put('/user/update/{id}', [UserController::class,'store']); //modificar registros
Route::delete('/user/{id}', [UserController::class, 'destroy']); //Eliminar registros
Route::get('user/{id}', [UserController::class, 'show']); //mostrar registros

Route::get('/sector/{area}/{cargo}', [SectorController::class, 'getid']);//Busca el sector de acuerdo al cargo y area
Route::post('/sector', [SectorController::class, 'store']);//Crea un sector en caso de que no haya obtenido uno en getid
//Lista de mensajes
Route::get('/message/src/{input}', [MessageController::class, 'index']); //mostrar registros

//Borrar publicación
Route::delete('/message/{id}', [MessageController::class, 'destroy']); //Eliminar registros
//Rutas del inicio de sesion
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::get('/user-profile', [AuthController::class, 'userProfile']);    
    });
});