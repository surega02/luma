<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait KnowledgeValidationRules
{
    /**
     * Get the validation rules used to persist Knowledge.
     *
     * Rich text fields are required when their rendered text is blank, which
     * is normalized to null before validation so `required` reports the error
     * on the field the user actually sees.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function knowledgeRules(?int $userId = null): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'definition' => ['required', 'string'],
            'my_understanding' => ['nullable', 'string'],
            'source' => ['nullable', 'string', 'max:255'],
            // Only http(s) links are accepted: the UI renders this as an
            // anchor, so javascript:/data: schemes must never reach storage.
            'url' => ['nullable', 'string', 'max:2048', 'url:http,https'],
            'category_ids' => ['nullable', 'array'],
            'category_ids.*' => [
                'integer',
                Rule::exists('categories', 'id')->where('user_id', $userId),
            ],
        ];
    }
}
