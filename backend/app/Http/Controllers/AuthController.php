<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Notifications\TestNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Validator;


class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct() {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request){
    	$validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        if (! $token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $this->createNewToken($token);
    }
    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request) {
        error_log($request);

        $requestData = $request->all();
        $requestData['password'] = Str::random(16);
        $requestData['changed_password'] = Carbon::parse($request->changed_password)->format('Y-m-d');

        $validator = Validator::make($requestData, [
            'first_name' => 'required|string',
            'second_name' => 'string|nullable',
            'first_surname' => 'required|string',
            'second_surname' => 'string|nullable',
            'number' => 'required|string|min:10|max:10',
            'image_id' => 'required|numeric',
            'sector_id' => 'required|numeric',
            'changed_password'=>'required|date',
            'rol_id' => 'required|numeric',
            'email' => 'required|string|email|max:320|unique:user',
            'password' => 'required|string|min:6',
            'birthday' => 'required|date'
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(), 400);
        }
        $user = User::create(array_merge(
                    $validator->validated(),
                    ['password' => bcrypt($request->password)]
                ));
        Notification::route('mail', $request->email)
        ->notify(new TestNotification($request->password));
        error_log($request);
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout() {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }
    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }
    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userProfile() {
        $id = Auth::id();
        $user = DB::table('user')
        ->join('sector', 'sector.id', '=', 'user.sector_id')
        ->join('rol', 'rol.id', '=', 'user.rol_id')
        ->join('image', 'image.id', '=', 'user.image_id')
        ->select('user.*', 'rol.name', 'sector.area','sector.position','image.direction')
        ->where('user.id', $id)
        ->first();
        return $user;
        /* return response()->json(auth()->user()); */
    }
    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() *1440,
            'user' => auth()->user()
        ]);
    }
}