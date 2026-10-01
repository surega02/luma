<?php

namespace App\Models;

use App\Enums\KnowledgeStatus;
use Carbon\CarbonImmutable;
use Database\Factories\KnowledgeFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $definition
 * @property string|null $my_understanding
 * @property string|null $source
 * @property string|null $url
 * @property KnowledgeStatus $status
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property CarbonImmutable|null $deleted_at
 * @property-read string $definition_snippet
 * @property-read User|null $user
 *
 * @method static KnowledgeFactory factory()
 */
class Knowledge extends Model
{
    /** @use HasFactory<KnowledgeFactory> */
    use HasFactory, SoftDeletes;

    /**
     * "Knowledge" is uncountable to the inflector, so the table name is explicit.
     */
    protected $table = 'knowledges';

    /**
     * Status is system-owned and must never be mass assigned.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'definition',
        'my_understanding',
        'source',
        'url',
    ];

    /**
     * Every response carries the card preview, so the list needs no
     * extra projection.
     *
     * @var list<string>
     */
    protected $appends = ['definition_snippet'];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => KnowledgeStatus::class,
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Plain-text preview of the definition, used by Knowledge cards.
     *
     * @return Attribute<string, string>
     */
    protected function definitionSnippet(): Attribute
    {
        $text = trim(preg_replace('/\s+/u', ' ', strip_tags($this->definition)) ?? '');

        return Attribute::get(fn (): string => Str::limit($text, 200, '…'));
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsToMany<Category, $this>
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class)->withTimestamps();
    }

    /**
     * @return HasMany<Insight, $this>
     */
    public function insights(): HasMany
    {
        return $this->hasMany(Insight::class);
    }

    /**
     * @return HasMany<DefinitionVersion, $this>
     */
    public function definitionVersions(): HasMany
    {
        return $this->hasMany(DefinitionVersion::class);
    }

    /**
     * @return HasMany<UnderstandingVersion, $this>
     */
    public function understandingVersions(): HasMany
    {
        return $this->hasMany(UnderstandingVersion::class);
    }

    /**
     * Knowledge owned by the given user, active records only.
     */
    public function scopeOwnedBy(mixed $query, ?int $userId): void
    {
        $query->where('user_id', $userId);
    }
}
