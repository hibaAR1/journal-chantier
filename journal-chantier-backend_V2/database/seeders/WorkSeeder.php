<?php

namespace Database\Seeders;

use App\Models\Work;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $list = [
            ["name" => "Travaux de terrassement", "unit" => "M3"],
            ["name" => "Travaux de coffrage", "unit" => "M2"],
            ["name" => "Travaux de ferraillage", "unit" => "KG"],
            ["name" => "Travaux de betonnage", "unit" => "M3"],
            ["name" => "Travaux de maconnerie et enduit", "unit" => "M2"],
        ];

        foreach ($list as $item) {
            Work::create([
                'name' => $item['name'],
                'unit' => $item['unit'],
            ]);
        }
    }
}
