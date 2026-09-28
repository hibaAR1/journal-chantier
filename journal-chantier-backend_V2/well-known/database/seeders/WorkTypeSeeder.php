<?php

namespace Database\Seeders;

use App\Models\WorkType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WorkTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $list = [
            ["name" => "Déblais", "work_id" => 1],
            ["name" => "Remblais", "work_id" => 1],
            ["name" => "COFF", "work_id" => 2],
            ["name" => "DECOFF", "work_id" => 2],
            ["name" => "Faç et Montage", "work_id" => 3],
            ["name" => "Pose", "work_id" => 3],
            ["name" => "Bétonnage", "work_id" => 4],
            ["name" => "Maçonnerie", "work_id" => 5],
            ["name" => "Enduit", "work_id" => 5],
        ];

        foreach ($list as $item) {
            WorkType::create([
                'name' => $item['name'],
                'work_id' => $item['work_id'],
            ]);
        }
    }
}
