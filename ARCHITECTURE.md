# Technology & UI Architecture

| Area | Observed implementation |
|------|------------------------|
| Framework | React 18.2 + TypeScript; Vite 5 as build tool; React Router DOM v6 for page routing |
| Styling | Tailwind CSS v3.4 utility classes; `src/styles/index.css` contains only `@tailwind base/components/utilities` directives (no custom design tokens) |
| UI component approach | Flat component structure in `src/components/` — DataTable, ModuleCard, Navbar, Sidebar. No `src/components/ui/` directory; no reusable component library |
| Icons | Lucide React icons throughout the interface |
| Animation | No custom animation components; only standard Tailwind CSS transitions (`hover:shadow-lg`, `transition`, `duration-300`) |
| Application shell | Simple flex layout (`flex` + `flex-1`) with collapsible Sidebar, Navbar, and scrollable main content. No AppLayout component, no AIChatWidget, no sticky Header |
| Theme | Single emerald-green theme; no light/dark theme tokens; no ThemeToggle |
| Accessibility/interaction | Basic focus rings (`focus:ring-2`), hover states, responsive mobile sidebar toggle; semantic `<nav>` and `<Link>` elements; no tooltips |

## Typography / Fonts

| Font | Role | Observed usage |
|------|------|----------------|
| (none — system default) | Body/UI font | No custom font imports; browser default sans-serif stack is used via Tailwind CSS v3.4 default `sans` font family |
| (none — system default) | Headings | No heading-specific font family is defined; headings use the same browser default sans-serif stack |

No Google Fonts (Inter, Plus Jakarta Sans, or otherwise) are imported in any source file or `index.html`. Neither `tailwind.config.js` defines a custom `fontFamily` in its `theme.extend` block. The `src/styles/index.css` file contains only `@tailwind base/components/utilities` directives with no `@import` or `@font-face` rules. The `health-sanitation-system` variant's `src/index.css` defines a `@theme` block with custom color tokens but contains no font configuration. The `font-display` utility referenced in the sidebar description has no corresponding Tailwind configuration in either project.

## Typography Size Scale

| Element / location | Tailwind class | Approx. CSS size | Weight / notes |
|--------------------|---------------|-------------------|----------------|
| Page title (h1) — all pages | `text-3xl` | 30px | `font-bold` |
| Section heading (h2) — Dashboard modules | `text-2xl` | 24px | `font-bold` |
| Card title (h2) — ModuleCard | `text-xl` | 20px | `font-semibold`, emerald-700 |
| Chart title (h2) — Dashboard charts | `text-lg` | 18px | `font-semibold`, gray-800 |
| Stat card label | `text-sm` | 14px | `font-medium`, gray-500 |
| Stat card value | `text-2xl` | 24px | `font-bold`, gray-800 |
| Stat change indicator | `text-sm` | 14px | emerald-600 or red-500 |
| Pagination metadata | `text-sm` | 14px | gray-500 |
| User name (navbar) | `text-sm` | 14px | `font-medium`, gray-800 |
| User role (navbar) | `text-xs` | 12px | gray-500 |
| App title (sidebar) | `text-xl` | 20px | `font-bold`, white |
| Form labels (LoginPage) | `text-sm` | 14px | `font-semibold`, emerald-800 |
| Login button | `text-lg` | 18px | semibold, white |
| Filter buttons (HealthCenter) | `text-sm` | 14px | medium |
| Footer descriptions (LoginPage) | `text-xs` | 12px | emerald-300 |
| Landing "SANISYSTEM" heading | `text-3xl` | 30px | `font-bold`, emerald-800 |
| Landing "Welcome Back" | `text-lg` | 18px | medium, emerald-600 |
| Body / description text | (default) | 16px | normal, gray-600 |
| DataTable cell text | `text-sm` | 14px | gray-700 |
| Export button | `text-sm` | 14px | white |

## Global Color & Surface System

No CSS custom properties, HSL tokens, or design-token system exists in the codebase. Colors are applied directly via Tailwind CSS utility classes. There is no light/dark theme toggle — a single emerald-green theme is used throughout.

### Color Usage by Component

| Color token | Tailwind class | Where used |
|-------------|---------------|------------|
| Emerald-700 | `bg-emerald-700` | Sidebar background |
| Emerald-600 | `bg-emerald-600` | Buttons, active filter, primary actions |
| Emerald-500 | `focus:ring-emerald-500` | Focus rings on inputs |
| Emerald-200 | `focus:ring-emerald-200` | Focus ring offset on inputs |
| Emerald-100 | `bg-emerald-100` | User avatar background |
| Emerald-300 | `text-emerald-300` | Footer description text |
| Emerald-600 | `text-emerald-600` | Links, stat change indicators |
| Emerald-700 | `text-emerald-700` | ModuleCard title, footer headings |
| Emerald-800 | `text-emerald-800` | LoginPage heading, form labels |
| Emerald-900 | `bg-emerald-900` | Footer background |
| Emerald-950 | `text-emerald-950` | LoginPage hero heading |
| Gray-50 | `bg-gray-50` | Table header row, hover surfaces |
| Gray-100 | `bg-gray-100` | Page background, navbar hover |
| Gray-200 | `border-gray-200` | Input borders (LoginPage) |
| Gray-300 | `border-gray-300` | Input borders (HSS variant) |
| Gray-400 | `text-gray-400` | Search icon color |
| Gray-500 | `text-gray-500` | Muted text, pagination metadata |
| Gray-600 | `text-gray-600` | Description text, secondary labels |
| Gray-700 | `text-gray-700` | Table cell text |
| Gray-800 | `text-gray-800` | User name in navbar |
| Red-500 | `bg-red-500` | Notification badge |
| Red-600 | `bg-red-600` | Danger button variant (HSS) |
| White | `bg-white`, `text-white` | Cards, navbar, button text |
| Slate-50 | `bg-slate-50` | (HSS variant only) |
| Slate-200 | `border-slate-200` | (HSS variant only) |
| Slate-600 | `text-slate-600` | (HSS variant only) |
| Slate-700 | `text-slate-700` | (HSS variant only) |
| Slate-900 | `text-slate-900` | (HSS variant only) |
| Teal-100 | `from-teal-100` | LoginPage gradient background |
| Emerald-50 | `via-emerald-50` | LoginPage gradient background |
| Orange-50 | `to-orange-50` | LoginPage gradient background |

### Tailwind Config

Neither `tailwind.config.js` (root nor HSS variant) extends the default theme with custom colors. The `theme.extend` block is empty in both projects. The HSS variant's `src/index.css` defines a `@theme` block with custom color tokens for emerald, teal, and slate palettes, but these are Tailwind theme extensions — not CSS custom properties or HSL-based design tokens.

## Border Radius, Shadows & Effects

No CSS custom properties (`--radius`, `--shadow`, `--ring`, etc.) exist in the codebase. All visual effects are applied directly via Tailwind utility classes.

### Border Radius

| Pattern | Tailwind class | Where used |
|---------|---------------|------------|
| Card surfaces | `rounded-xl` | DataTable, ModuleCard, Dashboard stat cards, chart containers, HSS Card |
| Form inputs | `rounded-lg` | DataTable search input, HealthCenter filter buttons, LoginPage inputs, HSS Input |
| Buttons (primary) | `rounded-lg` | HealthCenter filter buttons, DataTable export button |
| Buttons (action) | `rounded-xl` | ModuleCard "Open Module" button |
| Sidebar toggle | `rounded-lg` | Sidebar mobile menu button |
| Avatars / badges | `rounded-full` | Notification badge, user avatar |
| Login card | `rounded-3xl` | LoginPage auth card |
| Footer icons | `rounded-xl` | LoginPage footer icon containers |
| HSS buttons | `rounded-lg` | HSS Button component |
| HSS inputs | `rounded-lg` | HSS Input component |

No `--radius` CSS custom property or `1rem` base radius token exists. Border radius values are applied directly via Tailwind's `rounded-{size}` utilities.

### Shadows

| Pattern | Tailwind class | Where used | Design intent |
|---------|---------------|------------|---------------|
| Default elevation | `shadow` | Navbar, DataTable, ModuleCard, Dashboard stat cards, LoginPage card | Subtle surface elevation |
| Hover elevation | `hover:shadow-lg` | ModuleCard, Dashboard stat cards | Interactive surface lift on hover |
| High elevation | `shadow-2xl` | LoginPage card (`shadow-2xl shadow-emerald-900/10`) | Prominent floating surface |
| No shadow | (none) | Sidebar, page backgrounds | Flat surfaces |

No `--shadow-soft`, `--shadow-medium`, or `--shadow-large` CSS custom property tokens exist. Shadow values are applied directly via Tailwind's `shadow` and `shadow-{size}` utilities.

### Backdrop Blur

| Pattern | Tailwind class | Where used |
|---------|---------------|------------|
| Glass surface | `backdrop-blur-2xl` | LoginPage auth card (`backdrop-blur-2xl rounded-3xl border border-white/70`) |
| No blur | (none) | All other surfaces |

No `backdrop-blur-sm` or other blur variants are used. No CSS custom property for backdrop blur exists.

### Hover & Interactive Effects

| Pattern | Tailwind class | Where used |
|---------|---------------|------------|
| Shadow lift on hover | `hover:shadow-lg` | ModuleCard, Dashboard stat cards |
| Color shift on hover | `hover:bg-emerald-700`, `hover:bg-gray-100`, `hover:bg-emerald-600` | Buttons, sidebar links, navbar icons |
| Transition | `transition` | Sidebar width, button color shifts, card shadows |
| Duration | `duration-300` | Sidebar collapse/expand animation |
| Focus ring | `focus:ring-2 focus:ring-emerald-500` | All text inputs |
| Focus outline | `focus:outline-none` | All text inputs |
| Disabled state | `disabled:opacity-40 disabled:cursor-not-allowed` | Pagination buttons |

No `-translate-y-0.5` or `-translate-y-1` hover lift effects exist. No CSS custom properties for hover effects exist.

### Tailwind Config (Effects)

Neither `tailwind.config.js` extends the default theme with custom shadow, ring, or border-radius values. The `theme.extend` block is empty in both projects.
