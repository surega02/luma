<?php

namespace App\Models;

use Carbon\CarbonImmutable;
use Database\Factories\DefinitionVersionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Immutable snapshot of a Knowledge definition.
 *
 * @property int $id
 * @property int $knowledge_id
 * @property int $version
 * @property string $content
 * @property CarbonImmutable|null $created_at
 * @property-read Knowledge|null $knowledge
 *
 * @method static DefinitionVersionFactory factory()
 */
class DefinitionVersion extends Model
{
    /** @use HasFactory<DefinitionVersionFactory> */
    use HasFactory;

    public const UPDATED_AT = null;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'version',
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
            'version' => 'integer',
            'created_at' => 'datetime',
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
