<?php

namespace Database\Factories;

use App\Models\Insight;
use App\Models\Knowledge;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Insight>
 */
class InsightFactory extends Factory
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
            'content' => fake()->paragraph(),
        ];
    }
}
