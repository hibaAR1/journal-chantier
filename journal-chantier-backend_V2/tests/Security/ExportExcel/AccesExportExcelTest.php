<?php

namespace Tests\Security\ExportExcel;

use Spatie\Permission\Models\Role;
use Tests\JcdTestCase;

/**
 * SECURITY — Export Excel : accès réservé au Service RH et au Directeur d'Exploitation (CDC V3 § 3.2.3).
 */
class AccesExportExcelTest extends JcdTestCase
{
    public function test_permission_donnee_seulement_a_admin_et_responsable_rh(): void
    {
        $roles = Role::whereHas('permissions', fn($q) => $q->where('name', 'export punch details'))
            ->pluck('name')->sort()->values()->all();

        $this->assertEquals(['admin', 'human_resources_responsible'], $roles);
    }

    public function test_les_autres_roles_recoivent_403(): void
    {
        foreach (['conductor', 'data_entry', 'worker', 'stock_responsible', 'project_responsible'] as $role) {
            $this->api($this->makeUser('u-' . $role, [$role]))
                ->get('/api/punch-details/export?from=2026-09-26&to=2026-09-28')
                ->assertStatus(403);
        }
    }

    public function test_parametres_invalides_ou_malveillants_422(): void
    {
        $rh = $this->makeUser('rh', ['human_resources_responsible']);
        $export = fn(string $query) => $this->api($rh)->getJson('/api/punch-details/export?' . $query);

        $export('from=2026-09-28&to=2026-09-26')->assertStatus(422)                          // fin avant début
            ->assertJsonPath('errors.to.0', 'La date de fin doit être après la date de début.');
        $export('to=2026-09-28')->assertStatus(422);                                         // début obligatoire
        $export('from=2025-01-01&to=2026-09-28')->assertStatus(422);                         // plus d'un an
        $export('from=2026-09-26&to=2026-09-28&site_ids[]=99999')->assertStatus(422);        // chantier inconnu
        $export("from=2026-09-26' OR 1=1 --&to=2026-09-28")->assertStatus(422);              // injection SQL
    }
}
