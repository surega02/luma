<?php

namespace App\Support;

use DOMDocument;
use DOMElement;
use DOMNode;

/**
 * Restricts Tiptap HTML to the MVP toolbar allowlist before it is stored.
 *
 * Tech design §29: the browser is never trusted, only `<strong>`, `<em>`,
 * lists, links and paragraph/line-break markup survive the round trip.
 */
class HtmlSanitizer
{
    /**
     * Tags that are kept and rendered back to the client.
     *
     * @var list<string>
     */
    private const ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a'];

    /**
     * Tags whose text content must not survive sanitization either.
     *
     * @var list<string>
     */
    private const DROPPED_TAGS = [
        'script', 'style', 'iframe', 'object', 'embed', 'noscript', 'template',
        'svg', 'math', 'head', 'title', 'meta', 'link', 'base', 'form', 'input',
        'button', 'select', 'textarea', 'img', 'video', 'audio', 'canvas', 'applet',
        'frame', 'frameset', 'html', 'body',
    ];

    /**
     * Protocols that may appear in an anchor href.
     *
     * @var list<string>
     */
    private const SAFE_PROTOCOLS = ['http', 'https', 'mailto'];

    /**
     * Sanitize rich text HTML coming from the editor.
     */
    public function sanitize(?string $html): string
    {
        $html = trim((string) $html);

        if ($html === '') {
            return '';
        }

        $document = new DOMDocument;

        // No LIBXML_HTML_NOIMPLIED here: the sanitizer walks <body>, and
        // implied-mode parsing drops it for fragments like "<p>text</p>".
        $previous = libxml_use_internal_errors(true);
        $document->loadHTML('<?xml encoding="UTF-8">'.$html);
        libxml_clear_errors();
        libxml_use_internal_errors($previous);

        $body = $document->getElementsByTagName('body')->item(0);

        if ($body === null) {
            return '';
        }

        $this->clean($body);

        $result = '';

        foreach ($body->childNodes as $child) {
            $result .= $document->saveHTML($child) ?: '';
        }

        return trim($result);
    }

    /**
     * Sanitize markup and treat documents with no visible text as empty.
     *
     * An empty Tiptap document serializes to `<p></p>`, which must not count
     * as content when deciding whether a field was filled in.
     */
    public function content(?string $html): ?string
    {
        $sanitized = $this->sanitize($html);

        if (trim(strip_tags($sanitized)) === '') {
            return null;
        }

        return $sanitized;
    }

    /**
     * Strip every node the allowlist does not permit.
     */
    private function clean(DOMNode $node): void
    {
        $children = [];

        foreach ($node->childNodes as $child) {
            $children[] = $child;
        }

        $dirty = false;

        foreach ($children as $child) {
            if ($child->nodeType === XML_TEXT_NODE || $child->nodeType === XML_CDATA_SECTION_NODE) {
                continue;
            }

            if ($child->nodeType !== XML_ELEMENT_NODE) {
                $node->removeChild($child);

                continue;
            }

            $tag = strtolower($child->nodeName);

            if (in_array($tag, self::DROPPED_TAGS, true)) {
                $node->removeChild($child);

                continue;
            }

            if (! in_array($tag, self::ALLOWED_TAGS, true)) {
                $this->unwrap($node, $child);
                $dirty = true;

                continue;
            }

            $this->filterAttributes($child);
            $this->clean($child);
        }

        if ($dirty) {
            $this->clean($node);
        }
    }

    /**
     * Replace a disallowed element with its (already sanitized) children.
     */
    private function unwrap(DOMNode $parent, DOMNode $child): void
    {
        while ($child->firstChild !== null) {
            $parent->insertBefore($child->firstChild, $child);
        }

        $parent->removeChild($child);
    }

    /**
     * Keep only the attributes each allowed tag needs.
     */
    private function filterAttributes(DOMNode $node): void
    {
        if (! $node instanceof DOMElement) {
            return;
        }

        $tag = strtolower($node->nodeName);

        if ($tag !== 'a') {
            foreach (iterator_to_array($node->attributes) as $attribute) {
                $node->removeAttribute($attribute->nodeName);
            }

            return;
        }

        $href = $node->getAttribute('href');

        if (! $this->isSafeHref($href)) {
            $node->removeAttribute('href');
        }

        foreach (iterator_to_array($node->attributes) as $attribute) {
            if (strtolower($attribute->nodeName) !== 'href') {
                $node->removeAttribute($attribute->nodeName);
            }
        }

        if ($node->hasAttribute('href')) {
            $node->setAttribute('rel', 'noopener noreferrer');
            $node->setAttribute('target', '_blank');
        }
    }

    /**
     * Allow only absolute http(s)/mailto links; relative hrefs stay text.
     */
    private function isSafeHref(string $href): bool
    {
        if ($href === '') {
            return false;
        }

        $scheme = strtolower((string) parse_url($href, PHP_URL_SCHEME));

        return in_array($scheme, self::SAFE_PROTOCOLS, true);
    }
}
