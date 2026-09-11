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
├── js/form-config.js       Web3Forms access key (contact form)
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

Product images live in `images/` at the project root. Other page images can go in `assets/images/`.

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
| `automotive-grade-urea.jpeg` | Automotive urea |
| `agro-urea.jpeg` | Agricultural urea |
| `NPK.jpeg` | NPK |
| `MAP.jpeg` | MAP |
| `DAP.jpeg` | DAP |
| *(not yet added)* | Sulfur |
| `MEG.jpeg` | MEG |
| `base-oil.jpeg` | Base oils |

## Customization

- **Colors:** Edit `css/variables.css` — all theme colors are CSS custom properties
- **Navigation / footer:** Edit `partials/header.html` and `partials/footer.html`
- **Content:** HTML files contain `<!-- CONTENT: ... -->` comments marking editable sections
- **Contact form:** Configured via Web3Forms — see Contact Form Setup below

## Contact Form Setup

The quote form on `contact.html` sends emails through [Web3Forms](https://web3forms.com/) (works with GitHub Pages).

### One-time setup

1. Go to [web3forms.com](https://web3forms.com/) and create a free account
2. Create an access key linked to **nemanja_markovic198@hotmail.com**
3. In Web3Forms settings, restrict allowed domains to:
   - `mnaglobal.rs`
   - `www.mnaglobal.rs`
   - Your GitHub Pages URL (e.g. `nemanjamarkovic.github.io`)
   - `localhost` (for local testing)
4. Copy your access key into [`js/form-config.js`](js/form-config.js):

```js
window.MNA_FORM_CONFIG = {
  accessKey: "paste-your-key-here",
  recipientLabel: "nemanja_markovic198@hotmail.com",
  subject: "MNA Global Trading — New Quote Request",
};
```

5. Commit and push to GitHub Pages

### Testing

1. Run locally: `python -m http.server 8080`
2. Open [http://localhost:8080/contact.html](http://localhost:8080/contact.html)
3. Fill in Name, Email, Product (required) and submit
4. Check **nemanja_markovic198@hotmail.com** for the quote email

### Notes

- The access key is visible in frontend JavaScript — this is normal for static sites. Use Web3Forms domain restrictions to prevent abuse.
- Required fields: Name, Email, Product
- All other quote fields (quantity, specification, origin, etc.) are included in the email when provided

## Design

- Ecology-inspired palette: light blue + green
- Mobile-first responsive layout
- Subtle scroll-reveal animations (disabled when `prefers-reduced-motion` is set)

## Browser Support

Modern browsers (Chrome, Firefox, Edge, Safari). Requires JavaScript for navigation partials.
