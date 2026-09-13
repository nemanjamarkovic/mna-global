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
├── js/form-config.js       Contact form endpoint note
├── js/main.js              Navigation, partials, scroll animations
├── php/send-quote.php      Contact form mail handler (cPanel only)
├── php/mail-config.php     Mail settings (create on server, not in git)
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
- **Contact form:** Sends email via PHP on cPanel (`mnaglobal.rs`) — see Contact Form Setup below

## Contact Form Setup

The quote form on `contact.html` sends emails through a PHP script on **oblak+ cPanel**. It does **not** work on GitHub Pages (preview only shows a message to use the live site).

### One-time cPanel setup

1. cPanel → **Email Accounts** → create a domain mailbox (e.g. `info@mnaglobal.rs`)
2. Copy [`php/mail-config.example.php`](php/mail-config.example.php) to `php/mail-config.php` on the server
3. Edit `mail-config.php` with your addresses:

```php
return [
    "to_emails" => [
        "info@mnaglobal.rs",
        "sales@mnaglobal.rs",
    ],
    "from_email" => "noreply@mnaglobal.rs",
    "from_name" => "MNA Global Trading",
    "subject_prefix" => "MNA Global Trading — New Quote Request",
];
```

For a single recipient, you can use `"to_email" => "info@mnaglobal.rs"` instead of `to_emails`.

4. Upload to `public_html/php/`:
   - `send-quote.php`
   - `mail-config.php` (your copy — do not commit to git)
5. Upload updated `js/main-v3.js` and HTML pages that reference it

### Testing

1. Open [https://mnaglobal.rs/contact](https://mnaglobal.rs/contact)
2. Fill in Name, Email, Product (required) and submit
3. Check the inbox configured in `mail-config.php` (and spam folder on first send)
4. Reply to the email — it should go to the visitor via `Reply-To`

### Notes

- Required fields: Name, Email, Product
- All other quote fields are included in the email when provided
- GitHub Pages preview disables the submit button and shows a message to use the live site
- If emails land in spam, ask oblak+ to verify SPF/DKIM for `mnaglobal.rs`, or switch the PHP script to SMTP later

## Design

- Ecology-inspired palette: light blue + green
- Mobile-first responsive layout
- Subtle scroll-reveal animations (disabled when `prefers-reduced-motion` is set)

## Browser Support

Modern browsers (Chrome, Firefox, Edge, Safari). Requires JavaScript for navigation partials.
