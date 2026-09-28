<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ResourceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $list = [
            ['name' => "Conducteur des travaux", 'type' => 1,],
            ['name' => "Conducteur engins", 'type' => 1,],
            ['name' => "Chef chantier", 'type' => 1,],
            ['name' => "Chef d'équipe", 'type' => 1,],
            ['name' => "Chef d'équipe travaux", 'type' => 1,],
            ['name' => "Chef magasinier", 'type' => 1,],
            ['name' => "Magasinier", 'type' => 1,],
            ['name' => "Grutier", 'type' => 1,],
            ['name' => "Chauffeur", 'type' => 1,],
            ['name' => "Chauffeur camion", 'type' => 1,],
            ['name' => "Boiseur", 'type' => 1,],
            ['name' => "Maçon", 'type' => 1,],
            ['name' => "Ferrailleur", 'type' => 1,],
            ['name' => "Mecanicien", 'type' => 1,],
            ['name' => "Platrier", 'type' => 1,],
            ['name' => "Poseur", 'type' => 1,],
            ['name' => "Soudeur", 'type' => 1,],
            ['name' => "Caporal", 'type' => 1,],
            ['name' => "Traceur", 'type' => 1,],
            ['name' => "Agent de maintenance", 'type' => 1,],
            ['name' => "Technicien(ne) metreur", 'type' => 1,],
            ['name' => "Coursier administratif externe", 'type' => 1,],
            ['name' => "Ouvrier travaux", 'type' => 1,],


//            ['name' => "Grue", 'type' => 2,],
//            ['name' => "JCB", 'type' => 2,],
//            ['name' => "Manitou", 'type' => 2,],
//            ['name' => "Pelle", 'type' => 2,],
//            ['name' => "Compresseur", 'type' => 2,],
//            ['name' => "Bétonniére", 'type' => 2,],
//            ['name' => "Groupe Electrogéne", 'type' => 2,],
//            ['name' => "Compresseur Electrique", 'type' => 2,],
//            ['name' => "Meuleuse", 'type' => 2,],
//            ['name' => "Perceuses", 'type' => 2,],
//            ['name' => "Hilti", 'type' => 2,],
        ];

        foreach ($list as $item) {
            \App\Models\Resource::create($item);
        }
    }
}
