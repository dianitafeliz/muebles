<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\Image; 
use Validator;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
    //Almacena la imagen en storage y retorna el id
    public function store(Request $request)
    { $request->validate([
        'image' => 'image'
    ]);
        $url_img= $request->image->store('public/messages');
        $url_img_storage=Storage::Url($url_img);
        $url_img_storage = 'https://mueblesluxury.com.co/backend/public/' . $url_img_storage; 
        /* return $url_img_storage; */
        $create_img = Image::create([
            'direction' => $url_img_storage,
            'code'  => Str::random(10)
        ]);
        return $create_img->id;
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
    /*     public function destroy($id)
    {
        
        $image=Image::where('id',$id)->first();
        $url=str_replace('storage', 'public', $image->direction);
        $url=str_replace('https://mueblesluxury.com.co/backend/public/', '', $url);
        Storage::delete($url);

        $image->delete();
        return "Se borró";
    } */
    public function destroy($id)
    {
        
        $image=Image::where('id',$id)->first();
        $url=str_replace('storage', 'public', $image->direction);
        $url=str_replace('https://mueblesluxury.com.co/backend/public/', '', $url);
        Storage::delete($url);

        $image->delete();
        return "Se borró";
    }
}
