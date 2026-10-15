<?php

namespace Tests\Security\Roles;

use App\Models\Punch;
use App\Models\Resource;
use App\Models\Worker;
use Database\Seeders\AccessDefinitionSeeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\JcdTestCase;

/**
 * SECURITY — Définition des accès (CDC V3 § 3.5).
 *  § 3.5.1 Pointage : RH consultation + modification (tous chantiers), Directeur d'Exploitation consultation seule.
 *  § 3.5.2 Ouvriers & Ressources : RH consultation + modification, Directeur d'Exploitation consultation seule.
 */
class DefinitionDesAccesTest extends JcdTestCase
{
    public function test_le_rh_consulte_et_modifie_le_pointage_de_tous_les_chantiers(): void
    {
        $rh = $this->makeUser('rh', ['human_resources_responsible']);

        $this->assertTrue($rh->hasAllPermissions([
            'view punches', 'view all punches', 'store punches', 'update punches', 'validate punches', 'invalidate punches',
        ]));

        // Il voit les pointages de tous les chantiers
        $this->api($rh)->getJson('/api/punches')->assertOk()->assertJsonCount(Punch::count(), 'data');

        // Il peut modifier une ligne de pointage
        $line = Punch::whereDate('date', '2026-09-28')->first()->punchWorkers()->first();
        $this->api($rh)->putJson('/api/punch-worker/' . $line->id, [
            'worker_id' => $line->worker_id,
            'punch_id' => $line->punch_id,
            'type' => 1,
            'natural_hours' => 7,
            'overtime_hours' => 0,
        ])->assertOk();
    }

    public function test_le_rh_consulte_et_modifie_les_ouvriers_et_les_ressources(): void
    {
        $rh = $this->makeUser('rh2', ['human_resources_responsible']);

        $this->assertTrue($rh->hasAllPermissions([
            'view workers', 'store workers', 'update workers', 'delete workers',
            'view resources', 'store resources', 'update resources', 'delete resources',
        ]));

        $this->api($rh)->postJson('/api/resources', [
            'name' => 'Carreleur',
            'abbreviation' => 'CAR',
            'type' => 1,
        ])->assertStatus(201);
    }

    public function test_le_directeur_d_exploitation_consulte_sans_modifier(): void
    {
        $directeur = Role::where('name', 'manager')->first();

        // Pointage : consultation de tous les chantiers, sans modification
        $this->assertTrue($directeur->hasAllPermissions(['view punches', 'view all punches']));
        $this->assertFalse($directeur->hasAnyPermission(['store punches', 'update punches', 'delete punches']));

        // Ouvriers & Ressources : consultation seule
        $this->assertTrue($directeur->hasAllPermissions(['view workers', 'view resources']));
        $this->assertFalse($directeur->hasAnyPermission(['store workers', 'update workers', 'store resources', 'update resources']));
    }

    public function test_le_seeder_peut_etre_relance_sans_doublon(): void
    {
        $before = Permission::count();

        $this->seed(AccessDefinitionSeeder::class);
        $this->seed(AccessDefinitionSeeder::class);

        $this->assertEquals($before, Permission::count());
    }
}
