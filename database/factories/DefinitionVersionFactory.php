<?php

namespace Database\Factories;

use App\Models\DefinitionVersion;
use App\Models\Knowledge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DefinitionVersion>
 */
class DefinitionVersionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'knowledge_id' => Knowledge::factory(),
            'version' => 1,
            'content' => fake()->paragraph(),
        ];
    }
}
