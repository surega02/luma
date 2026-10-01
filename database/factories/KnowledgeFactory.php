<?php

namespace Database\Factories;

use App\Enums\KnowledgeStatus;
use App\Models\Knowledge;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Knowledge>
 */
class KnowledgeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'definition' => fake()->paragraph(),
            'my_understanding' => null,
            'source' => null,
            'url' => null,
            'status' => KnowledgeStatus::CAPTURED,
        ];
    }

    /**
     * Knowledge that has My Understanding but no insight yet.
     */
    public function understood(): static
    {
        return $this->state(fn (array $attributes) => [
            'my_understanding' => fake()->paragraph(),
            'status' => KnowledgeStatus::UNDERSTOOD,
        ]);
    }

    /**
     * Knowledge that has both My Understanding and at least one insight.
     */
    public function complete(): static
    {
        return $this->state(fn (array $attributes) => [
            'my_understanding' => fake()->paragraph(),
            'status' => KnowledgeStatus::COMPLETE,
        ]);
    }

    /**
     * Knowledge currently in Trash.
     */
    public function trashed(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => now(),
        ]);
    }
}
