/**
 * Structured data for search engines. Escaped: the texts come from the
 * back-office, and a "</script>" in one must not end the tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
