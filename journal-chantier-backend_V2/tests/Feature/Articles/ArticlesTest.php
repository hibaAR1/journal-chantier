<?php

namespace Tests\Feature\Articles;

use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Tests\JcdTestCase;

/**
 * FEATURE — Articles : catégories d'articles et articles (ciment, acier…).
 */
class ArticlesTest extends JcdTestCase
{
    private function admin(): User
    {
        return User::where('username', 'llouktam')->first();
    }

    public function test_on_peut_creer_une_categorie_d_article(): void
    {
        $this->api($this->admin())->postJson('/api/product-categories', ['name' => 'Liants'])->assertStatus(201);

        $this->assertDatabaseHas('product_categories', ['name' => 'Liants']);
    }

    public function test_on_peut_creer_un_article_dans_une_categorie(): void
    {
        $category = ProductCategory::create(['name' => 'Liants']);

        $this->api($this->admin())->postJson('/api/products', [
            'product_category_id' => $category->id,
            'name' => 'Ciment CPJ 45',
            'unit' => 'T',
        ])->assertStatus(201);

        $this->api($this->admin())->getJson('/api/products')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Ciment CPJ 45']);
    }

    public function test_un_article_doit_avoir_une_categorie_existante_un_nom_et_une_unite(): void
    {
        $this->api($this->admin())->postJson('/api/products', ['product_category_id' => 999999])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['product_category_id', 'name', 'unit']);
    }

    public function test_on_peut_modifier_et_supprimer_un_article(): void
    {
        $category = ProductCategory::create(['name' => 'Aciers']);
        $product = Product::create(['product_category_id' => $category->id, 'name' => 'HA 10', 'unit' => 'kg']);

        $this->api($this->admin())->putJson('/api/products/' . $product->id, [
            'product_category_id' => $category->id,
            'name' => 'HA 12',
            'unit' => 'kg',
        ])->assertOk();
        $this->assertEquals('HA 12', $product->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/products/' . $product->id)->assertOk();
        $this->assertSoftDeleted('products', ['id' => $product->id]);
    }

    public function test_on_peut_modifier_et_supprimer_une_categorie(): void
    {
        $category = ProductCategory::create(['name' => 'Divers']);

        $this->api($this->admin())->putJson('/api/product-categories/' . $category->id, ['name' => 'Quincaillerie'])->assertOk();
        $this->assertEquals('Quincaillerie', $category->fresh()->name);

        $this->api($this->admin())->deleteJson('/api/product-categories/' . $category->id)->assertOk();
        $this->assertSoftDeleted('product_categories', ['id' => $category->id]);
    }
}
