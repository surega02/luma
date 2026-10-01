<?php

namespace App\Http\Requests\Knowledge;

use App\Concerns\KnowledgeValidationRules;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateKnowledgeRequest extends FormRequest
{
    use KnowledgeValidationRules;

    /**
     * A Tiptap document with no text still serializes to markup; collapse it
     * so the required rule reports the field as empty.
     */
    public function prepareForValidation(): void
    {
        $definition = $this->input('definition');

        if (is_string($definition) && trim(strip_tags($definition)) === '') {
            $this->merge(['definition' => null]);
        }
    }

    /**
     * Determine if the user is authorized to make this request.
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
        return $this->knowledgeRules($this->user()?->id);
    }
}
