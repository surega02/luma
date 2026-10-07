<?php

namespace App\Http\Requests\Insight;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInsightRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * Ownership runs in the controller through InsightPolicy@update.
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
