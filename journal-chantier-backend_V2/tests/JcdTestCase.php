<?php

namespace Tests;

use App\Models\Site;
use App\Models\User;
use Carbon\Carbon;
use Database\Seeders\DashboardPermissionSeeder;
use Database\Seeders\DashboardTestSeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\PermissionModuleSeeder;
use Database\Seeders\PermissionSeeder;
use Database\Seeders\PunchDetailPermissionSeeder;
use Database\Seeders\ResourceSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\WorkSeeder;
use Database\Seeders\WorkTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Base commune des tests du Journal de chantier (cahier des charges V3) :
 * utilisée par tests/Unit, tests/Feature et tests/Security.
 *
 * ⚠️ Les tests tournent sur une base SQLite EN MÉMOIRE (voir phpunit.xml) :
 * ta vraie base MySQL n'est jamais touchée.
 *
 * Avant chaque test : migrations + permissions + rôles + référentiels (ressources, travaux…)
 * + données de test du tableau de bord (hiba, Villa Test, Symphonie — journaux et pointages 26 → 28/09/2026).
 */
abstract class JcdTestCase extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed([
            PermissionSeeder::class,
            PermissionModuleSeeder::class,
            RoleSeeder::class,
            DashboardPermissionSeeder::class,
            PunchDetailPermissionSeeder::class,
            LocationSeeder::class,
            ResourceSeeder::class,
            WorkSeeder::class,
            WorkTypeSeeder::class,
        ]);

        // Utilisateur propriétaire des chantiers de test (responsable de projet et magasinier)
        $this->makeUser('llouktam', ['admin']);

        $this->seed(DashboardTestSeeder::class);
    }

    /**
     * Crée un utilisateur avec des rôles existants et/ou des permissions précises (via un rôle dédié).
     */
    protected function makeUser(string $username, array $roles = [], array $permissions = []): User
    {
        $user = User::create([
            'name' => ucfirst($username),
            'job' => 'Test',
            'username' => $username,
            'email' => $username . '@test.local',
            'password' => Hash::make('secret'),
            'is_active' => true,
        ]);

        foreach ($roles as $role) {
            $user->assignRole($role);
        }

        if ($permissions) {
            $role = Role::create(['name' => 'role-' . Str::random(8), 'abbreviation' => 'Rôle de test', 'guard_name' => 'web']);
            $role->givePermissionTo($permissions);
            $user->assignRole($role);
        }

        app(PermissionRegistrar::class)->forgetCachedPermissions();

        return $user;
    }

    /**
     * Appel API authentifié avec un VRAI jeton Sanctum (comme après /api/login, valable 30 min).
     */
    protected function api(User $user): static
    {
        // Oublie l'utilisateur de la requête précédente (sinon Laravel le garde en mémoire pendant le test)
        $this->app['auth']->forgetGuards();

        $token = $user->createToken('test');
        $user->tokens()->where('id', $token->accessToken->id)->update(['expires_at' => Carbon::now()->addMinutes(30)]);

        return $this->withHeaders([
            'Accept' => 'application/json',
            'Authorization' => 'Bearer ' . $token->plainTextToken,
        ]);
    }

    protected function siteId(string $name): int
    {
        return Site::where('name', $name)->value('id');
    }

    /**
     * Lit un fichier Excel renvoyé par l'API.
     */
    protected function readExcel(TestResponse $response): \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet
    {
        // Excel::download() renvoie un fichier (BinaryFileResponse)
        $path = $response->baseResponse->getFile()->getPathname();

        return \PhpOffice\PhpSpreadsheet\IOFactory::load($path)->getActiveSheet();
    }
}
