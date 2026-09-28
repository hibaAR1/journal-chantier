<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::create(['name' => 'admin', 'abbreviation' => 'Administrateur']);

        $admin->givePermissionTo([
            'view dashboard',
            'view third parties',
            'view clients', 'store clients', 'update clients', 'delete clients',
            'view suppliers', 'store suppliers', 'update suppliers', 'delete suppliers',
            'view products', 'store products', 'update products', 'delete products',
            'view product categories', 'store product categories', 'update product categories', 'delete product categories',
            'view locations', 'store locations', 'update locations', 'delete locations',
            'view resources', 'store resources', 'update resources', 'delete resources',
            'view works', 'store works', 'update works', 'delete works',
            'view work types', 'store work types', 'update work types', 'delete work types',
            'view workers', 'store workers', 'update workers', 'delete workers', 'export workers', 'import workers',
            'view sites', 'view all sites', 'store sites', 'update sites', 'delete sites',
            'view site locations', 'store site locations', 'update site locations', 'delete site locations',
            'view movements', 'view all movements', 'store movements', 'update movements', 'delete movements',
            'view reports', 'view all reports', 'store reports', 'update reports', 'delete reports', 'validate reports', 'invalidate reports',
            'view report work types', 'store report work types', 'update report work types', 'delete report work types',
            'view report work type workers', 'store report work type workers', 'update report work type workers', 'delete report work type workers',
            'view punches', 'view all punches', 'store punches', 'update punches', 'delete punches',  'export punches', 'import punches', 'validate punches', 'invalidate punches',
            'view assignments', 'view all assignments', 'store assignments', 'update assignments', 'delete assignments', 'export assignments', 'import assignments',
            'view users', 'store users', 'update users', 'delete users', 'toggle users', 'reset password users',
            'view roles', 'store roles', 'delete roles' , 'update roles',
            'view permissions', 'store permissions', 'delete permissions', 'update permissions',
        ]);

        $manager = Role::create(['name' => 'manager', 'abbreviation' => 'Manager']);

        $manager->givePermissionTo([
            'view dashboard',
            'view third parties',
            'view clients',
            'view suppliers',
            'view products',
            'view product categories',
            'view locations',
            'view resources',
            'view works',
            'view work types',
            'view workers',
            'view sites', 'view all sites',
            'view site locations',
            'view punches', 'view all punches',
            'view assignments', 'view all assignments',
            'view movements', 'view all movements',
            'view reports', 'view all reports',
            'view report work types',
            'view report work type workers',
        ]);

        $projectResponsible = Role::create(['name' => 'project_responsible', 'abbreviation' => 'Responsable projets']);

        $projectResponsible->givePermissionTo([
            'view dashboard',
            'view third parties',
            'view clients', 'store clients', 'update clients', 'delete clients',
            'view suppliers',
            'view products', 'store products', 'update products', 'delete products',
            'view product categories', 'store product categories', 'update product categories', 'delete product categories',
            'view locations', 'store locations', 'update locations', 'delete locations',
            'view resources', 'store resources', 'update resources', 'delete resources',
            'view workers',
            'view sites', 'view some sites', 'store sites', 'update sites', 'delete sites',
            'view site locations',
            'view movements', 'view some movements',
            'view punches', 'view some punches',
            'view assignments', 'view some assignments',
            'view reports', 'view some reports',
            'view report work types',
            'view report work type workers',
        ]);

        $estimatingResponsible = Role::create(['name' => 'estimating_responsible', 'abbreviation' => 'Responsable chiffrage']);

        $estimatingResponsible->givePermissionTo([
            'view dashboard',
            'view works', 'store works', 'update works', 'delete works',
            'view work types', 'store work types', 'update work types', 'delete work types',
        ]);

        $humanResourcesResponsible = Role::create(['name' => 'human_resources_responsible', 'abbreviation' => 'Responsable RH']);

        $humanResourcesResponsible->givePermissionTo([
            'view dashboard',
            'view workers', 'store workers', 'update workers', 'delete workers', 'export workers', 'import workers',
            'view resources',
        ]);

        $stockResponsible = Role::create(['name' => 'stock_responsible', 'abbreviation' => 'Responsable stock']);

        $stockResponsible->givePermissionTo([
            'view dashboard',
            'view products', 'store products', 'update products', 'delete products',
            'view product categories', 'store product categories', 'update product categories', 'delete product categories',
            'view resources', 'store resources', 'update resources', 'delete resources',
            'view third parties',
            'view clients',
            'view suppliers', 'store suppliers', 'update suppliers', 'delete suppliers',
            'view movements', 'view all movements', 'store movements', 'update movements', 'delete movements',
        ]);

        $conductor = Role::create(['name' => 'conductor', 'abbreviation' => 'Conducteur']);

        $conductor->givePermissionTo([
            'view dashboard',
            'view site locations', 'store site locations', 'update site locations', 'delete site locations',
            'view punches', 'view some punches',
            'view sites', 'view some sites',
            'view site locations', 'store site locations', 'update site locations', 'delete site locations',
            'view workers',
            'view reports', 'view some reports', 'store reports', 'update reports', 'delete reports', 'validate reports',
            'view report work types', 'store report work types', 'update report work types', 'delete report work types',
            'view report work type workers', 'store report work type workers', 'update report work type workers', 'delete report work type workers',
        ]);

        $worker = Role::create(['name' => 'worker', 'abbreviation' => 'Ouvrier']);

        $worker->givePermissionTo([
            'view dashboard',
            'view some sites',
            'view workers',
            'view punches', 'view some punches', 'store punches', 'update punches', 'delete punches', 'export punches', 'import punches', 'validate punches',
            'view assignments', 'view some assignments', 'store assignments', 'update assignments', 'delete assignments', 'export assignments', 'import assignments',
            'view movements', 'view some movements', 'store movements', 'update movements', 'delete movements',
        ]);
    }
}
