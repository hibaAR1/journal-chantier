<?php

namespace Tests\Security\Visibilite;

use App\Models\Assignment;
use App\Models\Punch;
use App\Models\Site;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * SECURITY — Un utilisateur qui a seulement "view some …" ne voit QUE ses chantiers
 * (responsable de projet, conducteur, magasinier ou agent de saisie).
 * Ici : l'utilisateur est conducteur de "Villa Test" uniquement.
 */
class VisibiliteParChantierTest extends JcdTestCase
{
    private function conducteur(): User
    {
        $user = $this->makeUser('conducteur', [], [
            'view sites', 'view some sites',
            'view punches', 'view some punches',
            'view reports', 'view some reports',
            'view assignments', 'view some assignments',
        ]);

        Site::where('name', 'Villa Test')->update(['conductor_id' => $user->id]);

        return $user;
    }

    public function test_il_ne_voit_que_ses_chantiers(): void
    {
        $names = collect($this->api($this->conducteur())->getJson('/api/sites')->assertOk()->json())->pluck('name')->all();

        $this->assertEquals(['Villa Test'], $names);
    }

    public function test_il_ne_voit_que_les_pointages_de_ses_chantiers(): void
    {
        $sites = collect($this->api($this->conducteur())->getJson('/api/punches')->assertOk()->json('data'))
            ->pluck('site_id')->unique()->values()->all();

        $this->assertEquals([$this->siteId('Villa Test')], $sites);
    }

    public function test_il_ne_peut_pas_ouvrir_un_pointage_d_un_autre_chantier(): void
    {
        $other = Punch::where('site_id', $this->siteId('hiba'))->first();

        $this->api($this->conducteur())->getJson('/api/punches/' . $other->id)->assertStatus(404);
    }

    public function test_il_ne_voit_que_les_journaux_de_ses_chantiers(): void
    {
        $sites = collect($this->api($this->conducteur())->getJson('/api/reports')->assertOk()->json('data'))
            ->pluck('site_id')->unique()->values()->all();

        $this->assertEquals([$this->siteId('Villa Test')], $sites);
    }

    public function test_il_ne_voit_que_les_affectations_de_ses_chantiers(): void
    {
        Assignment::create(['site_id' => $this->siteId('hiba')]);
        $mine = Assignment::create(['site_id' => $this->siteId('Villa Test')]);

        $ids = collect($this->api($this->conducteur())->getJson('/api/assignments')->assertOk()->json())->pluck('id')->all();

        $this->assertEquals([$mine->id], $ids);
    }

    public function test_sans_aucune_permission_de_vue_les_listes_sont_refusees(): void
    {
        $user = $this->makeUser('rien', [], ['view dashboard']);

        $this->api($user)->getJson('/api/sites')->assertStatus(404);
        $this->api($user)->getJson('/api/punches')->assertStatus(404);
    }
}
