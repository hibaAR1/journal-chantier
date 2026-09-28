<?php

namespace Database\Seeders;

use App\Models\Location;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $list = [
            'Fond',
            'Ss-Sol',
            'Piscine',
            'Lcl T',
        ];

        foreach ($list as $item) {
            Location::create([
                'name' => $item,
            ]);
        }
    }
}
