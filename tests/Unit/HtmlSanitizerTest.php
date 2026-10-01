<?php

namespace Tests\Unit;

use App\Support\HtmlSanitizer;
use PHPUnit\Framework\TestCase;

class HtmlSanitizerTest extends TestCase
{
    private HtmlSanitizer $sanitizer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->sanitizer = new HtmlSanitizer;
    }

    public function test_markup_only_documents_are_treated_as_empty(): void
    {
        $this->assertNull($this->sanitizer->content('<p></p>'));
        $this->assertNull($this->sanitizer->content('   '));
        $this->assertNull($this->sanitizer->content(null));
        $this->assertNull($this->sanitizer->content('<p><br></p>'));
    }

    public function test_allowed_formatting_is_preserved(): void
    {
        $html = '<p>The <strong>event loop</strong> <em>drains</em> the queue.</p><ul><li>tick</li></ul>';

        $this->assertSame($html, $this->sanitizer->sanitize($html));
    }

    public function test_dangerous_elements_are_removed_entirely(): void
    {
        $result = $this->sanitizer->sanitize('<p>before</p><script>alert(1)</script><p>after</p>');

        $this->assertStringNotContainsString('script', $result);
        $this->assertStringNotContainsString('alert(1)', $result);
        $this->assertStringContainsString('before', $result);
        $this->assertStringContainsString('after', $result);
    }

    public function test_disallowed_but_harmless_elements_are_unwrapped(): void
    {
        $result = $this->sanitizer->sanitize('<span class="x">kept text</span>');

        $this->assertSame('kept text', $result);
        $this->assertStringNotContainsString('span', $result);
    }

    public function test_only_safe_link_protocols_survive(): void
    {
        $result = $this->sanitizer->sanitize('<a href="javascript:alert(1)">bad</a>');

        $this->assertStringNotContainsString('javascript:', $result);

        $result = $this->sanitizer->sanitize('<a href="https://example.com" title="x">good</a>');

        $this->assertStringContainsString('https://example.com', $result);
        $this->assertStringContainsString('rel="noopener noreferrer"', $result);
        $this->assertStringContainsString('target="_blank"', $result);
        $this->assertStringNotContainsString('title=', $result);
    }

    public function test_content_returns_sanitized_html_when_text_exists(): void
    {
        $this->assertSame(
            '<p>real <strong>content</strong></p>',
            $this->sanitizer->content('<p>real <strong>content</strong></p>'),
        );
    }
}
