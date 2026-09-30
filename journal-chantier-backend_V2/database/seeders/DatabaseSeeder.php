<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();


        $this->call(PermissionSeeder::class);
        $this->call(PermissionModuleSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(DashboardPermissionSeeder::class);
        $this->call(UserSeeder::class);

        $this->call(LocationSeeder::class);
        $this->call(ProductCategorySeeder::class);
        $this->call(ResourceSeeder::class);
        $this->call(WorkSeeder::class);
        $this->call(WorkTypeSeeder::class);
    }
}
