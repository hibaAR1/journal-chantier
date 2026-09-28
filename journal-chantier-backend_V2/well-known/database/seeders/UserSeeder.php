<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Lamiaa Louktam',
            'email' => 'lamia09louktam@gmail:com',
            'password' => Hash::make('Louktam@09'),
            'job' => 'CHEF DE PROJET DÉVELOPPEMENT',
            'username' => 'llouktam',
            'registration_number' => 'P02131',
        ]);

        $admin->assignRole('admin');

        $manager = User::create([
            'name' => 'Youness EL OUAROUARI',
            'email' => 'y.elouarouari@tcgm.ma',
            'password' => Hash::make('dk&HH7h8'),
            'job' => 'DIRECTEUR D’EXPLOITATION',
            'username' => 'yelouarouari',
            'registration_number' => 'V00001',
        ]);

        $manager->assignRole('manager');

        $humanResourcesResponsible = User::create([
            'name' => 'Mohcine LHIRCHE',
            'email' => 'm.lhirche@tcgm.ma',
            'password' => Hash::make('mps982#P'),
            'job' => 'CHARGE ADMINISTRATION DU PERSONNEL',
            'username' => 'mlhirche',
            'registration_number' => 'V00057',
        ]);

        $humanResourcesResponsible->assignRole('human_resources_responsible');

        $stockResponsible = User::create([
            'name' => 'Mohamed Jad FARNAOUI',
            'email' => 'm.farnaoui@tcgm.ma',
            'password' => Hash::make('ntSs972@'),
            'job' => 'RESPONSABLE APPROVISIONNEMENT ET GESTION DE STOCK',
            'username' => 'jfarnaoui',
            'registration_number' => 'V00050',
        ]);

        $stockResponsible->assignRole('stock_responsible');

        $estimatingResponsible = User::create([
            'name' => 'Abdelali SIBTI',
            'email' => 'a.sibti@tcgm.ma',
            'password' => Hash::make('PsM65@1f'),
            'job' => 'RESPONSABLE DE CHIFFRAGE',
            'username' => 'asibti',
            'registration_number' => 'V00039',
        ]);

        $estimatingResponsible->assignRole('estimating_responsible');

        $projectResponsibles = [
            [
                'name' => 'Aissam HAOUF',
                'email' => 'a.haouf@tcgm.ma',
                'password' => Hash::make('TyG$6Q7q'),
                'job' => 'RESPONSABLE PROJETS DE CONSTRUCTION',
                'username' => 'ahaouf',
                'registration_number' => 'V00045',
            ],
            [
                'name' => 'Mustapha OUAKHROUNE',
                'email' => 'm.ouakhroune@tcgm.ma',
                'password' => Hash::make('8Ha&S&Rp'),
                'job' => 'RESPONSABLE DE PROJET ET METHODE',
                'username' => 'mouakhroune',
                'registration_number' => 'V00005',
            ]
        ];

        foreach ($projectResponsibles as $projectResponsible) {
            $projectResponsible = User::create($projectResponsible);
            $projectResponsible->assignRole('project_responsible');
        }

        $conductors = [
            [
                'name' => 'Othmane BOUJADI',
                'email' => 'o.boujadi@tcgm.ma',
                'password' => Hash::make('8pK88Tpd'),
                'job' => 'CONDUCTEUR DES TRAVAUX',
                'username' => 'oboujadi',
                'registration_number' => 'V00087',
            ],
            [
                'name' => 'Abdelouahab HIDOUR',
                'email' => 'a.hidour@tcgm.ma',
                'password' => Hash::make('o383YAt6'),
                'job' => 'CONDUCTEUR DES TRAVAUX',
                'username' => 'ahidour',
                'registration_number' => 'V00044',
            ],
            [
                'name' => 'Nabil HAOUF',
                'email' => 'n.haouf@tcgm.ma',
                'password' => Hash::make('S3HiH94X'),
                'job' => 'CONDUCTEUR DES TRAVAUX',
                'username' => 'nhaouf',
                'registration_number' => 'V00053',
            ],
            [
                'name' => 'Khalil AMMARI',
                'email' => 'k.ammari@tcgm.ma',
                'password' => Hash::make('HLhNYD5x'),
                'job' => 'CONDUCTEUR DES TRAVAUX',
                'username' => 'kaammari',
                'registration_number' => 'V0009',
            ]
        ];

        foreach ($conductors as $conductor) {
            $conductor = User::create($conductor);
            $conductor->assignRole('conductor');
        }

        $workers = [
            [
                'name' => 'Youssef NABIL',
                'email' => 'y.nabil@tcgm.ma',
                'password' => Hash::make('GP9ShQNk'),
                'job' => 'CHEF MAGASINIER',
                'username' => 'ynabil',
                'registration_number' => 'V00056',
            ],
            [
                'name' => 'Khalid AIT JILALI',
                'password' => Hash::make('LiL65N7L'),
                'job' => 'MAGASINIER',
                'username' => 'kaitjilali',
                'registration_number' => 'V00088',
            ], [
                'name' => 'Oussama ESSAFOURI',
                'password' => Hash::make('4S65d5jn'),
                'job' => 'MAGASINIER',
                'username' => 'oessafouri',
                'registration_number' => 'I35069',
            ], [
                'name' => 'Abdelati EL MEJJAD',
                'password' => Hash::make('3Xk9mDxc'),
                'job' => 'MAGASINIER',
                'username' => 'aelmejjad',
                'registration_number' => 'I28871',
            ], [
                'name' => 'Azzedine BERNAN',
                'password' => Hash::make('sMFa7eg4'),
                'job' => 'MAGASINIER',
                'username' => 'abernan',
                'registration_number' => 'I24033',
            ], [
                'name' => 'Ayoub OUAKKA',
                'password' => Hash::make('r7XARd4N'),
                'job' => 'MAGASINIER',
                'username' => 'aouakka',
                'registration_number' => 'I34366',
            ], [
                'name' => 'Kamal BAYFOU',
                'password' => Hash::make('A85GqqSt'),
                'job' => 'MAGASINIER',
                'username' => 'kbayfou',
                'registration_number' => 'V00234',
            ],
        ];

        foreach ($workers as $worker) {
            $worker = User::create($worker);
            $worker->assignRole('worker');
        }
    }
}
