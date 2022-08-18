<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message; 
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Validator;

class MessageController extends Controller
{
    /**
     * Devolver los post filtrados
     *
     * @return \Illuminate\Http\Response
     */
    public function index($input)
    {
        $message = DB::table('message')
        ->join('user', 'user.id', '=', 'message.user_id')
        -> leftJoin('image', 'image.id', '=', 'message.image_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('message.*',
         'user.first_name',
         'user.first_surname',
          'rol.name as rol',
          'image.direction',
          'image.id as image_id',
            'message.id as message_id')
        ->where('message.reply_to', NULL)
        ->where(function($query) use ($input) {
            $query->where('message.text','like', '%'.$input.'%')
        ->orwhere('user.first_name','like', '%'.$input.'%')
        ->orwhere('user.first_surname','like', '%'.$input.'%');   
    })->simplePaginate(2);
        return response()->json($message, status:200);
        
        }

    /**
     * Show the form for creating a new resource.
     * 
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        error_log('Some message here.');

        error_log($request);
            $requestData = $request->all();
            $user_id=Auth::id();
            
            
            $requestData['date'] = Carbon::parse($requestData['date'])->format('Y-m-d');
            $requestData['user_id'] = $user_id;

        $validator = Validator::make($requestData, [
            'text'=>'string|nullable',
            'image_id'=>'nullable',
            'reply_to'=>'nullable',
            'code'=>'string|required|min:10|max:10',
            'date'=>'required',
            'likes'=>'required',
            'responses'=>'required',
            'status_id'=>'required',
            'user_id'=>'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        $message = Message::create(array_merge(
                    $validator->validated()
                ));
        return response()->json([
            'message' => 'El mensaje se añadió con exito',
            'message' => $message
        ], 201);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     * Retorna los comentarios de acuerdo al id de
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $message = DB::table('message')
        ->join('user', 'user.id', '=', 'message.user_id')
        ->leftJoin('image', 'image.id', '=', 'message.image_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('user.id as user_id',
        'message.*',
         'user.first_name',
         'user.first_surname',
          'rol.name as rol',
           'image.direction',
           'image.id as image_id',
            'message.id as message_id')
        ->where('message.reply_to', $id)
        ->orderBy('message.id','DESC')
        ->simplepaginate(3);
       return response()->json($message, status:200);

    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $message = DB::table('message')
        ->where('message.id',$id)
        ->first();
        return response()->json($message, status:200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id, Request $request)
    {
        $message = Message::findOrFail($id);
        $message->text = $request->text;
        
        $message->save();
        }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $deleted = Message::find($id)->delete();
        if($deleted){
            return true;
        }
    }

    /**
     * Actualiza el número de likes de cada publicación
     */
 /*    public function updatelikes(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $message->likes = $request->likes;
        $message->save();
    } */

     public function updatelikes_incr(Request $request, $id)
    {
        DB::table('message')->where('message.id',$id)->increment('likes');
    }
    /**
     * Actualiza el número de likes de cada publicación (resta)
     */
    public function updatelikes_decr(Request $request, $id)
    {
        DB::table('message')->where('message.id',$id)->decrement('likes');
    }

    /* Paginar los post y ordenarlo de forma descentente */
    public function prueba()
    {
        $message = DB::table('message')
        ->join('user', 'user.id', '=', 'message.user_id')
        ->leftJoin('image', 'image.id', '=', 'message.image_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->select('message.*',
        'user.id as user_id',
         'user.first_name',
         'user.first_surname',
          'rol.name as rol',
           'image.direction',
            'message.id as message_id')
            ->where('message.reply_to', NULL)
            ->orderBy('id','DESC')
        ->simplePaginate(2);
        return response()->json($message, status:200);
        }

        /* Actualiza el número de comentarios */
        
     public function updateresponses_incr(Request $request, $id)
     {
        DB::table('message')->where('message.id',$id)->increment('responses');
    }
     /**
      * Actualiza el número de likes de cada publicación (resta)
      */
     public function updateresponses_decr(Request $request, $id, $current_id)
     {
         $num = DB::table('message')
        ->select('message.responses')
        ->where('message.id',$current_id)
        ->first();
        
        return $num->responses+1;
     }
     public function simpleupdateresponses_decr(Request $request, $id, $num){
          DB::table('message')->where('message.id',$id)->decrement('responses',$num);
          return $num;
     }
          //Obtener el número de registros de publicaciones de acuerdo al id
    public function getcommentarieslist($id){
        $num = DB::table('message')
        ->select('message.id')
        ->where('message.reply_to', $id)
        ->get();
        $count= $num->count();

       /*  DB::table('message')->where('message.id',$id_reply)->decrement('responses', $num ); */

        return ['id_responses' => $num,'count' =>$count];
     }
}
