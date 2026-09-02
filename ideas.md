# Saturn — Creative Direction

## Three directions

### Theme Name: Orbital Scrapbook
Very brief intro: A tactile idea wall that feels like a designer's desk viewed from orbit: warm paper, graphite, clipped imagery, and electric annotations. It is intimate, editorial, and slightly strange.
Probability: 0.07

### Theme Name: Signal Garden
Very brief intro: A living archive of ideas treated like specimens in a greenhouse, with translucent panels, soft botanical greens, and slow luminous connections. It is calm, curious, and organic.
Probability: 0.04

### Theme Name: Black Box Playground
Very brief intro: A nocturnal laboratory of raw concepts, rendered in ink-black surfaces with chartreuse signal marks and kinetic node maps. It is urgent, experimental, and high-contrast.
Probability: 0.09

## Chosen direction: Orbital Scrapbook

### Design Movement
Contemporary editorial design fused with analog scrapbook culture and early interface diagramming. Saturn should feel like a premium creative notebook that happens to have a gravitationally coherent digital canvas.

### Core Principles
1. **Capture before structure.** Raw notes, image scraps, odd phrasing, and half-formed questions are welcome.
2. **Tactile precision.** Surfaces feel physical through paper grain, offset shadows, ink lines, clipped corners, and layered objects.
3. **Asymmetric discovery.** The wall avoids dashboard symmetry; cards drift in a considered masonry rhythm with a visual path through the content.
4. **Signals over chrome.** Metadata appears as annotations and stamps rather than utility-heavy control panels.

### Color Philosophy
The base is warm bone paper (#F4F0E8) to make the interface feel held rather than displayed. Graphite (#1E2321) provides confident ink-like contrast. Electric chartreuse (#D5F23F) is Saturn's ownable signal color: it marks action, freshness, and ideas with voltage. Cobalt (#2355E8) and coral (#F26D5B) act as editorial corrections—used sparingly to distinguish categories and connections without becoming a rainbow UI.

### Layout Paradigm
An editorial canvas with a slim left rail, a wide asymmetric idea wall, and occasional floating annotation panels. The primary wall is a CSS masonry-like column system with deliberate variation in card height and offset. The top bar behaves like a studio index, not a standard SaaS header.

### Signature Elements
- A hand-drawn orbital ring motif around the Saturn mark and key active states.
- Tiny catalog labels, issue numbers, and coordinates rendered like archive annotations.
- Paper-cut corner tabs and soft offset shadows that make cards feel movable.

### Interaction Philosophy
Interactions should feel like moving pieces on a desk. Hovering reveals hidden annotations; clicking opens an idea as a sheet sliding over the wall; adding an idea starts with a blank thought field and only reveals structure progressively. Actions are direct, fast, and slightly playful without being noisy.

### Animation
Use short, physical transitions under 280ms with a strong ease-out. Cards lift by a few pixels and rotate back to zero on hover. The detail sheet enters from the clicked card's region with opacity and translate, never from a scale of zero. The orbital logo rotates only on successful capture. Respect reduced-motion preferences and keep keyboard actions instant.

### Typography System
Display: **Space Grotesk**, 700 for page titles and card headlines. Body: **DM Sans**, 400/500 for notes and labels. Annotation: **IBM Plex Mono**, 500 in compact uppercase for tags, metadata, and shortcuts. Headlines use tight tracking and occasional italic emphasis; body copy stays generous and legible.

### Brand Essence
Saturn is the visual thinking space for curious people with more ideas than folders, helping them capture first and connect later. Personality: **restless, tactile, generous**.

### Brand Voice
Headlines are candid and slightly poetic. CTAs are active but never corporate. Microcopy reassures users that unfinished thinking is valuable.

Example lines:
- "Your brain is allowed to be a little messy."
- "Drop the thought. We'll find its orbit later."

### Wordmark & Logo
The mark is an imperfect orbital ring intersecting a compact hand-drawn starburst. The wordmark uses a custom-modified Space Grotesk treatment with a split crossbar in the 'A' and a small chartreuse orbit slash, never plain default text alone.

### Signature Brand Color
**Orbit Chartreuse — #D5F23F.** A bright, slightly acidic yellow-green that reads as an active signal on paper and remains distinctive against graphite, bone, cobalt, and coral.

## Implementation reminders

Every major component should reinforce Orbital Scrapbook: editorial whitespace, paper texture, graphite text, chartreuse signal states, asymmetric composition, and tactile motion. Avoid generic CRUD panels, centered hero layouts, purple gradients, and excessive rounded cards.
