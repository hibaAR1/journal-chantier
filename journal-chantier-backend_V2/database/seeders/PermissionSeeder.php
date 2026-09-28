<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Dashboard Module
        Permission::create(['name' => 'view dashboard', 'abbreviation' => 'Voir le tableau de bord']);

        // Third Parties Module
        Permission::create(['name' => 'view third parties', 'abbreviation' => 'Voir les tiers']);

        // Clients Module
        Permission::create(['name' => 'view clients', 'abbreviation' => 'Voir les clients']);
        Permission::create(['name' => 'store clients', 'abbreviation' => 'Ajouter des clients']);
        Permission::create(['name' => 'update clients', 'abbreviation' => 'Modifier des clients']);
        Permission::create(['name' => 'delete clients', 'abbreviation' => 'Supprimer des clients']);

        // Suppliers Module
        Permission::create(['name' => 'view suppliers', 'abbreviation' => 'Voir les fournisseurs']);
        Permission::create(['name' => 'store suppliers', 'abbreviation' => 'Ajouter des fournisseurs']);
        Permission::create(['name' => 'update suppliers', 'abbreviation' => 'Modifier des fournisseurs']);
        Permission::create(['name' => 'delete suppliers', 'abbreviation' => 'Supprimer des fournisseurs']);

        // Products Module
        Permission::create(['name' => 'view products', 'abbreviation' => 'Voir les produits']);
        Permission::create(['name' => 'store products', 'abbreviation' => 'Ajouter des produits']);
        Permission::create(['name' => 'update products', 'abbreviation' => 'Modifier des produits']);
        Permission::create(['name' => 'delete products', 'abbreviation' => 'Supprimer des produits']);

        // Product Categories Module
        Permission::create(['name' => 'view product categories', 'abbreviation' => 'Voir les catégories de produits']);
        Permission::create(['name' => 'store product categories', 'abbreviation' => 'Ajouter des catégories de produits']);
        Permission::create(['name' => 'update product categories', 'abbreviation' => 'Modifier des catégories de produits']);
        Permission::create(['name' => 'delete product categories', 'abbreviation' => 'Supprimer des catégories de produits']);

        // Locations Module
        Permission::create(['name' => 'view locations', 'abbreviation' => 'Voir les emplacements']);
        Permission::create(['name' => 'store locations', 'abbreviation' => 'Ajouter des emplacements']);
        Permission::create(['name' => 'update locations', 'abbreviation' => 'Modifier des emplacements']);
        Permission::create(['name' => 'delete locations', 'abbreviation' => 'Supprimer des emplacements']);

        // Works Module
        Permission::create(['name' => 'view works', 'abbreviation' => 'Voir les travaux']);
        Permission::create(['name' => 'store works', 'abbreviation' => 'Ajouter des travaux']);
        Permission::create(['name' => 'update works', 'abbreviation' => 'Modifier des travaux']);
        Permission::create(['name' => 'delete works', 'abbreviation' => 'Supprimer des travaux']);

        // Work Types Module
        Permission::create(['name' => 'view work types', 'abbreviation' => 'Voir les types de travaux']);
        Permission::create(['name' => 'store work types', 'abbreviation' => 'Ajouter des types de travaux']);
        Permission::create(['name' => 'update work types', 'abbreviation' => 'Modifier des types de travaux']);
        Permission::create(['name' => 'delete work types', 'abbreviation' => 'Supprimer des types de travaux']);

        // Workers Module
        Permission::create(['name' => 'view workers', 'abbreviation' => 'Voir les ouvriers']);
        Permission::create(['name' => 'store workers', 'abbreviation' => 'Ajouter des ouvriers']);
        Permission::create(['name' => 'update workers', 'abbreviation' => 'Modifier des ouvriers']);
        Permission::create(['name' => 'delete workers', 'abbreviation' => 'Supprimer des ouvriers']);
        Permission::create(['name' => 'export workers', 'abbreviation' => 'Exporter les ouvriers']);
        Permission::create(['name' => 'import workers', 'abbreviation' => ' Importer les ouvriers']);

        // Sites Module
        Permission::create(['name' => 'view sites', 'abbreviation' => 'Voir les sites']);
        Permission::create(['name' => 'view all sites', 'abbreviation' => 'Voir tous les sites']);
        Permission::create(['name' => 'view some sites', 'abbreviation' => 'Voir certains sites']);
        Permission::create(['name' => 'store sites', 'abbreviation' => 'Ajouter des sites']);
        Permission::create(['name' => 'update sites', 'abbreviation' => 'Modifier des sites']);
        Permission::create(['name' => 'delete sites', 'abbreviation' => 'Supprimer des sites']);

        // Site Locations Module
        Permission::create(['name' => 'view site locations', 'abbreviation' => 'Voir les emplacements des sites']);
        Permission::create(['name' => 'store site locations', 'abbreviation' => 'Ajouter des emplacements des sites']);
        Permission::create(['name' => 'update site locations', 'abbreviation' => 'Modifier des emplacements des sites']);
        Permission::create(['name' => 'delete site locations', 'abbreviation' => 'Supprimer des emplacements des sites']);

        // Resources Module
        Permission::create(['name' => 'view resources', 'abbreviation' => 'Voir les ressources']);
        Permission::create(['name' => 'store resources', 'abbreviation' => 'Ajouter des ressources']);
        Permission::create(['name' => 'update resources', 'abbreviation' => 'Modifier des ressources']);
        Permission::create(['name' => 'delete resources', 'abbreviation' => 'Supprimer des ressources']);

        // Reports Module
        Permission::create(['name' => 'view reports', 'abbreviation' => 'Voir les rapports']);
        Permission::create(['name' => 'view all reports', 'abbreviation' => 'Voir tous les rapports']);
        Permission::create(['name' => 'view some reports', 'abbreviation' => 'Voir certains rapports']);
        Permission::create(['name' => 'store reports', 'abbreviation' => 'Ajouter des rapports']);
        Permission::create(['name' => 'update reports', 'abbreviation' => 'Modifier des rapports']);
        Permission::create(['name' => 'delete reports', 'abbreviation' => 'Supprimer des rapports']);
        Permission::create(['name' => 'validate reports', 'abbreviation' => 'Valider des journaux']);
        Permission::create(['name' => 'invalidate reports', 'abbreviation' => 'Dévalidation les rapports']);
        Permission::create(['name' => 'download reports', 'abbreviation' => 'Telecharger les journals de chantier']);

        // Report Work Types Module
        Permission::create(['name' => 'view report work types', 'abbreviation' => 'Voir les types de travaux des rapports']);
        Permission::create(['name' => 'store report work types', 'abbreviation' => 'Ajouter des types de travaux des rapports']);
        Permission::create(['name' => 'update report work types', 'abbreviation' => 'Modifier des types de travaux des rapports']);
        Permission::create(['name' => 'delete report work types', 'abbreviation' => 'Supprimer des types de travaux des rapports']);

        // Report Work Type Workers Module
        Permission::create(['name' => 'view report work type workers', 'abbreviation' => 'Voir les ouvriers des types de travaux des rapports']);
        Permission::create(['name' => 'store report work type workers', 'abbreviation' => 'Ajouter des ouvriers des types de travaux des rapports']);
        Permission::create(['name' => 'update report work type workers', 'abbreviation' => 'Modifier des ouvriers des types de travaux des rapports']);
        Permission::create(['name' => 'delete report work type workers', 'abbreviation' => 'Supprimer des ouvriers des types de travaux des rapports']);

        // Assignments Module
        Permission::create(['name' => 'view assignments', 'abbreviation' => 'Voir les affectations']);
        Permission::create(['name' => 'view all assignments', 'abbreviation' => 'Voir toutes les affectations']);
        Permission::create(['name' => 'view some assignments', 'abbreviation' => 'Voir certaines affectations']);
        Permission::create(['name' => 'store assignments', 'abbreviation' => 'Ajouter des affectations']);
        Permission::create(['name' => 'update assignments', 'abbreviation' => 'Modifier des affectations']);
        Permission::create(['name' => 'delete assignments', 'abbreviation' => 'Supprimer des affectations']);
        Permission::create(['name' => 'export assignments', 'abbreviation' => 'Exporter les affectations']);
        Permission::create(['name' => 'import assignments', 'abbreviation' => ' Importer les affectations']);

        // Punches Module
        Permission::create(['name' => 'view punches', 'abbreviation' => 'Voir les pointages']);
        Permission::create(['name' => 'view all punches', 'abbreviation' => 'Voir tous les pointages']);
        Permission::create(['name' => 'view some punches', 'abbreviation' => 'Voir certains pointages']);
        Permission::create(['name' => 'store punches', 'abbreviation' => 'Ajouter des pointages']);
        Permission::create(['name' => 'update punches', 'abbreviation' => 'Modifier des pointages']);
        Permission::create(['name' => 'delete punches', 'abbreviation' => 'Supprimer des pointages']);
        Permission::create(['name' => 'export punches', 'abbreviation' => 'Exporter les pointages']);
        Permission::create(['name' => 'import punches', 'abbreviation' => ' Importer les pointages']);
        Permission::create(['name' => 'validate punches', 'abbreviation' => 'Valider des pointages']);
        Permission::create(['name' => 'invalidate punches', 'abbreviation' => 'Dévalider des pointages']);

        // Movements Module
        Permission::create(['name' => 'view movements', 'abbreviation' => 'Voir les mouvements']);
        Permission::create(['name' => 'view all movements', 'abbreviation' => 'Voir tous les mouvements']);
        Permission::create(['name' => 'view some movements', 'abbreviation' => 'Voir certains mouvements']);
        Permission::create(['name' => 'store movements', 'abbreviation' => 'Ajouter des mouvements']);
        Permission::create(['name' => 'update movements', 'abbreviation' => 'Modifier des mouvements']);
        Permission::create(['name' => 'delete movements', 'abbreviation' => 'Supprimer des mouvements']);

        // Users Module
        Permission::create(['name' => 'view users', 'abbreviation' => 'Voir les utilisateurs']);
        Permission::create(['name' => 'store users', 'abbreviation' => 'Ajouter des utilisateurs']);
        Permission::create(['name' => 'update users', 'abbreviation' => 'Modifier des utilisateurs']);
        Permission::create(['name' => 'delete users', 'abbreviation' => 'Supprimer des utilisateurs']);
        Permission::create(['name' => 'toggle users', 'abbreviation' => 'Activer/Désactiver des utilisateurs']);
        Permission::create(['name' => 'reset password users', 'abbreviation' => 'Rénitilisation des mots de passe des utilisateurs']);

        // Role Module:
        Permission::create(['name' => 'view roles', 'abbreviation' => 'Voir les roles ']);
        Permission::create(['name' => 'store roles', 'abbreviation' => 'Ajouter des roles']);
        Permission::create(['name' => 'update roles', 'abbreviation' => 'Modifier des roles']);
        Permission::create(['name' => 'delete roles', 'abbreviation' => 'Supprimer des roles']);

        // Permissions Module:
        Permission::create(['name' => 'view permissions', 'abbreviation' => 'Voir les permissions ']);
        Permission::create(['name' => 'store permissions', 'abbreviation' => 'Ajouter des permissions']);
        Permission::create(['name' => 'update permissions', 'abbreviation' => 'Modifier des permissions']);
        Permission::create(['name' => 'delete permissions', 'abbreviation' => 'Supprimer des permissions']);
    }
}
