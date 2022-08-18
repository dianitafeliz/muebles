<?php

namespace App\Http\Controllers;

use App\Notifications\TestNotification;
use Illuminate\Support\Facades\Notification;
use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Models\User; 
use App\Models\Image; 
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //union usuarios a rol y seccion
        $user = DB::table('user')
        ->join('sector', 'sector.id', '=', 'user.sector_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('user.*', 'rol.name', 'sector.area','sector.position')
        ->get();
        return $user;

/*         $user= User::all();
        return $user; */
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($id, Request $request)
    {
        $user = User::findOrFail($id);
        $user->email = $request->email;
        $user->first_name = $request->first_name;
        $user->second_name = $request->second_name;
        $user->first_surname = $request->first_surname;
        $user->second_surname = $request->second_surname;
        $user->number = $request->number;
/*         $user->image_id = $request->image_id;
 */        $user->rol_id = $request->rol_id;
        $user->sector_id = $request->sector_id;

        $user->save();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $user = DB::table('user')
        ->join('sector', 'sector.id', '=', 'user.sector_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('user.*', 'rol.name', 'sector.area','sector.position')
        ->where('user.id', $id)
        ->first();
        return $user;

        }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
        /*  $libro = Libro::where('id', $id)->first();
      return $libro; */
/*       error_log("Entró");
      $user = DB::table('user')
        ->join('sector', 'sector.id', '=', 'user.sector_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('user.*', 'rol.name', 'sector.area','sector.position')
        ->get()
        ->where('user.id', $id)->first(); */
/* 
        return $id; */
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        $deleted = User::find($id)->delete();
        if($deleted){
            return true;
        }
/*         console.log("Destroy");
        $user = User::destroy($request->id);
        return $user; */
    }

    //SISTEMA DE CONTRASEÑAS
    public function get_password(){
        $changed_password=DB::table('user')
        ->select('user.changed_password','user.id')
        ->where('user.id', Auth::id())
        ->first();
        return $changed_password;

    }


    //Actualizar la contraseña
    public function mod_pass(Request $request) {
              $user = User::findOrFail(Auth::id());
        $user->password = bcrypt($request->password);
        $user->changed_password = $request->changed_password;
        $user->save();
        error_log($request);
    }

    //Actualizar la contraseña de acuerdo al email
    public function restore_pass(Request $request) {
        $password=Str::random(16);
        $user = User::where('user.email', $request->email)->firstOrFail();
       $user->password = bcrypt($password);
       $user->changed_password = Carbon::parse($request->changed_password)->format('Y-m-d');
       $user->save();
       Notification::route('mail', $request->email)
       ->notify(new TestNotification($password));
       error_log($request);
    }

    //Traer imagen de perfil de acuerdo a publicación
    public function get_profile_image($id){
        $changed_password=DB::table('user')
        ->join('image', 'image.id', '=', 'user.image_id')
        ->select('image.id as image_id', 'image.direction as image_direction')
        ->where('user.id', $id)
        ->first();
        return $changed_password;

    }
    /*        //Cambiar foto de perfil
    public function set_profile_image(Request $request){
        $user = User::findOrFail(Auth::id());
        $user->image_id = $request->image_id;
        $user->save();
    if($request->current_image!=1){
         $image=Image::where('id',$request->current_image)->first();
          $url=str_replace('storage', 'public', $image->direction);
        $url=str_replace('https://mueblesluxury.com.co/backend/public/', '', $url);
        Storage::delete($url);

        $image->delete();
        return "Se borró";
    } */
    //Cambiar foto de perfil
    public function set_profile_image(Request $request){
        $user = User::findOrFail(Auth::id());
        $user->image_id = $request->image_id;
        $user->save();

        $image=Image::where('id',$request->current_image)->first();
        $url=str_replace('storage', 'public', $image->direction);
        $url=str_replace('https://mueblesluxury.com.co/backend/public/', '', $url);
        Storage::delete($url);

        $image->delete();
        return "Se borró";
    }
/*     //Devolver true si la contraseña ingresada coincide con la almacenada
    //Si no coincide, devolver false
    public function compare_pass(Request $request){
        
        $user = DB::table('user')
        ->select('user.password')
        ->find(Auth::id());
        return Hash::check('', $user->password);;
    } */
}