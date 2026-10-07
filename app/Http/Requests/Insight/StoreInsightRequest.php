<?php

namespace App\Http\Requests\Insight;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreInsightRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Ownership of the parent Knowledge runs in the controller through
     * KnowledgePolicy@update.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => ['required', 'string'],
        ];
    }
}
