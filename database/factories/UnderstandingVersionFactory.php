<?php

namespace Database\Factories;

use App\Models\Knowledge;
use App\Models\UnderstandingVersion;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UnderstandingVersion>
 */
class UnderstandingVersionFactory extends Factory
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
