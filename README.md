# ARIANNA

Static website for ARIANNA, ready to deploy on GitHub Pages.

## GitHub Pages setup

1. Push this repository to GitHub.
2. In GitHub, open `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to your default branch (`main` recommended) to trigger deploy.

The workflow at `.github/workflows/deploy-pages.yml` publishes this site's root files to GitHub Pages.
