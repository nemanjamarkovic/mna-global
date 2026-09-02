# MNA Global Trading — Website

Static multi-page website for MNA Global Trading. Built with HTML, CSS, and minimal vanilla JavaScript.

## Run Locally

A local server is required because the header and footer are loaded via JavaScript (`fetch`). Opening HTML files directly in the browser (`file://`) will not load navigation correctly.

### Option A — Python (recommended)

```bash
cd mna-global
python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080)

### Option B — Node.js serve

```bash
npx serve .
```

## Project Structure

```
├── index.html              Homepage
├── about.html
├── markets.html
├── trading-supply.html
├── logistics.html
├── quality-compliance.html
├── contact.html
├── products/               Product pages (8 products + index)
├── partials/               Shared header & footer
├── css/                    Stylesheets (design tokens in variables.css)
├── js/main.js              Navigation, partials, scroll animations
└── assets/images/          Drop real images here
```

## Pages (16 total)

| Page | File |
|------|------|
| Home | `index.html` |
| About Us | `about.html` |
| Products overview | `products/index.html` |
| Automotive Grade Urea | `products/automotive-grade-urea.html` |
| Agricultural Urea | `products/agricultural-urea.html` |
| NPK | `products/npk.html` |
| MAP | `products/map.html` |
| DAP | `products/dap.html` |
| Sulfur | `products/sulfur.html` |
| MEG | `products/meg.html` |
| Base Oils | `products/base-oils.html` |
| Markets | `markets.html` |
| Trading & Supply | `trading-supply.html` |
| Logistics | `logistics.html` |
| Quality & Compliance | `quality-compliance.html` |
| Contact | `contact.html` |

## Adding Images

Place image files in `assets/images/`. Each placeholder has a `data-src` attribute showing the intended filename.

**Example — replace a placeholder:**

Before:
```html
<div class="image-placeholder" data-src="assets/images/hero-home.jpg" ...>
  <span class="image-placeholder__label">Hero image — add later</span>
</div>
```

After:
```html
<img src="assets/images/hero-home.jpg" alt="Global commodity trading" loading="lazy">
```

### Image mapping

| Placeholder file | Used on |
|------------------|---------|
| `hero-home.jpg` | Homepage hero |
| `intro-trading.jpg` | Homepage intro |
| `trading-supply.jpg` | Homepage & Trading page |
| `markets-map.jpg` | Markets page |
| `about-company.jpg` | About page |
| `logistics.jpg` | Logistics page |
| `quality-compliance.jpg` | Quality page |
| `trading-process.jpg` | Trading & Supply page |
| `product-automotive-urea.jpg` | Automotive urea |
| `product-urea.jpg` | Agricultural urea |
| `product-npk.jpg` | NPK |
| `product-map.jpg` | MAP |
| `product-dap.jpg` | DAP |
| `product-sulfur.jpg` | Sulfur |
| `product-meg.jpg` | MEG |
| `product-base-oils.jpg` | Base oils |

## Customization

- **Colors:** Edit `css/variables.css` — all theme colors are CSS custom properties
- **Navigation / footer:** Edit `partials/header.html` and `partials/footer.html`
- **Content:** HTML files contain `<!-- CONTENT: ... -->` comments marking editable sections
- **Contact form:** UI-only in v1; wire `contact.html` form to Formspree or a backend when ready

## Design

- Ecology-inspired palette: light blue + green
- Mobile-first responsive layout
- Subtle scroll-reveal animations (disabled when `prefers-reduced-motion` is set)

## Browser Support

Modern browsers (Chrome, Firefox, Edge, Safari). Requires JavaScript for navigation partials.
