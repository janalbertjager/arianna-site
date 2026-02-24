# ARIANNA

Static website for ARIANNA, ready to deploy on GitHub Pages.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to your default branch (`main` recommended) to trigger deploy.

The workflow at `.github/workflows/deploy-pages.yml` publishes this site's root files to GitHub Pages.

## Nutshell form connection

The site now uses embedded Nutshell forms (form id `2eagLw`, instance `341921`) on these pages:

- `index.html`
- `book-a-demo.html`
- `contact.html`
- `support.html`
- `partners.html`

Each page has its own target container, initialized with the same Nutshell form.

### Verify after deploy

1. Open each page and confirm the Nutshell form renders.
2. Submit a test lead from each page.
3. Confirm records arrive in Nutshell.
