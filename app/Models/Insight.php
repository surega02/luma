<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\InsightFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $knowledge_id
 * @property string $content
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read Knowledge|null $knowledge
 *
 * @method static InsightFactory factory()
 */
class Insight extends Model
{
    /** @use HasFactory<InsightFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'content',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Knowledge, $this>
     */
    public function knowledge(): BelongsTo
    {
        return $this->belongsTo(Knowledge::class);
    }
}
