# Blog Editorial Redesign

## Understanding summary

- Upgrade the `/blog` listing page into a polished, premium editorial journal.
- Preserve Boxora's deep teal, lime, pale field, rounded-surface visual identity.
- Improve hierarchy, spacing, typography, card composition, and responsive alignment.
- Preserve featured posts, editor's picks, category filtering, search, article counts, empty states, quote CTA, marquee, and footer.
- Use an editorial direction with magazine-inspired typography, generous whitespace, and refined layouts.
- Avoid new dependencies and changes to blog data or existing behavior.

## Assumptions

- The redesign applies to the blog listing page only.
- Existing routes, data fetching, image sources, and interactions remain unchanged.
- Responsive behavior should be refined across mobile, tablet, and desktop.
- Alignment includes consistent containers, spacing, image ratios, card heights, and controls.
- Accessibility and performance should be preserved or improved.

## Decision log

1. **Visual direction: editorial premium**
   - Chosen over bold conversion and minimal luxury to give the page a distinctive magazine feel while retaining the brand.

2. **Implementation scope: blog listing page only**
   - Keeps the redesign focused and avoids unrelated changes to article detail pages.

3. **Component strategy: reuse existing shared components and data**
   - Avoids new dependencies and preserves established navigation, footer, search, filtering, and quote flows.

4. **Layout strategy: feature-led hierarchy with a consistent article grid**
   - Balances editorial character with predictable responsive alignment.

## Final design

- A restrained teal masthead with strong journal typography and subtle atmosphere.
- A feature-led story card aligned to the main page container.
- Compact, balanced editor's picks cards with consistent metadata and hover states.
- A standardized article library grid with aligned controls and card anatomy.
- Blog article pages use a constrained editorial hero image and a focused reading column.
- The About page uses a distinct warm editorial hero while retaining Boxora's teal/lime system.
- The existing quote CTAs, marquees, and footers remain in place with improved vertical rhythm.
