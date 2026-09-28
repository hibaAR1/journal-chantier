<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dashboard
        DB::table('permissions')->where('id', 1)->update([
            'module_name' => 'dashboard',
            'module_abbreviation' => 'Tableau de bord'
        ]);

        // Third Parties
        DB::table('permissions')->where('id', 2)->update([
            'module_name' => 'third_parties',
            'module_abbreviation' => 'Tiers'
        ]);

        // Clients
        DB::table('permissions')->whereIn('id', [3,4,5,6])->update([
            'module_name' => 'clients',
            'module_abbreviation' => 'Clients'
        ]);

        // Suppliers
        DB::table('permissions')->whereIn('id', [7,8,9,10])->update([
            'module_name' => 'suppliers',
            'module_abbreviation' => 'Fournisseurs'
        ]);

        // Products
        DB::table('permissions')->whereIn('id', [11,12,13,14])->update([
            'module_name' => 'products',
            'module_abbreviation' => 'Produits'
        ]);

        // Product Categories
        DB::table('permissions')->whereIn('id', [15,16,17,18])->update([
            'module_name' => 'product_categories',
            'module_abbreviation' => 'Catégories de produits'
        ]);

        // Locations
        DB::table('permissions')->whereIn('id', [19,20,21,22])->update([
            'module_name' => 'locations',
            'module_abbreviation' => 'Emplacements'
        ]);

        // Works
        DB::table('permissions')->whereIn('id', [23,24,25,26])->update([
            'module_name' => 'works',
            'module_abbreviation' => 'Travaux'
        ]);

        // Work Types
        DB::table('permissions')->whereIn('id', [27,28,29,30])->update([
            'module_name' => 'work_types',
            'module_abbreviation' => 'Types de travaux'
        ]);

        // Workers
        DB::table('permissions')->whereIn('id', [31,32,33,34,35,36])->update([
            'module_name' => 'workers',
            'module_abbreviation' => 'Ouvriers'
        ]);

        // Sites
        DB::table('permissions')->whereIn('id', [37,38,39,40,41,42])->update([
            'module_name' => 'sites',
            'module_abbreviation' => 'Sites'
        ]);

        // Site Locations
        DB::table('permissions')->whereIn('id', [43,44,45,46])->update([
            'module_name' => 'site_locations',
            'module_abbreviation' => 'Emplacements des sites'
        ]);

        // Resources
        DB::table('permissions')->whereIn('id', [47,48,49,50])->update([
            'module_name' => 'resources',
            'module_abbreviation' => 'Ressources'
        ]);

        // Reports
        DB::table('permissions')->whereIn('id', [51,52,53,54,55,56,87,88,89])->update([
            'module_name' => 'reports',
            'module_abbreviation' => 'Rapports'
        ]);

        // Report Work Types
        DB::table('permissions')->whereIn('id', [57,58,59,60])->update([
            'module_name' => 'report_work_types',
            'module_abbreviation' => 'Types de travaux des rapports'
        ]);

        // Report Work Type Workers
        DB::table('permissions')->whereIn('id', [61,62,63,64])->update([
            'module_name' => 'report_work_type_workers',
            'module_abbreviation' => 'Ouvriers des types de travaux des rapports'
        ]);

        // Assignments
        DB::table('permissions')->whereIn('id', [65,66,67,68,69,70,71,72])->update([
            'module_name' => 'assignments',
            'module_abbreviation' => 'Affectations'
        ]);

        // Punches
        DB::table('permissions')->whereIn('id', [73,74,75,76,77,78,79,80,90,91])->update([
            'module_name' => 'punches',
            'module_abbreviation' => 'Pointages'
        ]);

        // Movements
        DB::table('permissions')->whereIn('id', [81,82,83,84,85,86])->update([
            'module_name' => 'movements',
            'module_abbreviation' => 'Mouvements'
        ]);

        // Users
        DB::table('permissions')->whereIn('id', [92,93,94,95,96,97])->update([
            'module_name' => 'users',
            'module_abbreviation' => 'Utilisateurs'
        ]);

        // Roles
        DB::table('permissions')->whereIn('id', [98,99,100,101])->update([
            'module_name' => 'roles',
            'module_abbreviation' => 'Rôles'
        ]);

        // Permissions
        DB::table('permissions')->whereIn('id', [102,103,104,105])->update([
            'module_name' => 'permissions',
            'module_abbreviation' => 'Permissions'
        ]);
    }
}