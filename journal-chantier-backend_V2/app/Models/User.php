<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\ModelCounterTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasRoles, HasApiTokens, HasFactory, Notifiable, ModelCounterTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'job',
        'is_active',
        'password',
        'registration_number',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    public function profile () {
        $name = $this->name;

        // Explode the name into words
        $words = explode(' ', trim($name));

        // Get the first letter of the first two words (if they exist)
        $initials = '';
        if (isset($words[0])) {
            $initials .= strtoupper($words[0][0]);
        }
        if (isset($words[1])) {
            $initials .= strtoupper($words[1][0]);
        }

        return $initials;
    }

    public static function booted(): void {
        static::creating(function(User $user) {
            $user->code = $user->codeGenerator([
                "prefix" => "USR",
                "model" => "User",
                "length" => 5,
            ]);
        });
    }
}
