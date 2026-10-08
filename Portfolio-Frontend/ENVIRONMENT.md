# Frontend environment

The Angular app calls the API through the same-origin path `/api` in every environment. This is public routing configuration, not a secret.

- Local: `ng serve` proxies `/api/*` to `http://localhost:3100` using `proxy.conf.json`.
- Vercel: `vercel.json` rewrites `/api/*` to the backend project before the SPA fallback.
- Angular selects `environment.development.ts` for development builds and `environment.production.ts` for production builds via `angular.json`.

No `.env` file is needed in `Portfolio-Frontend`. Do not put admin credentials, JWT secrets, MongoDB credentials, or Cloudinary API secrets in Angular environments; Angular values are compiled into public browser code. Keep those values in the backend's local `.env` or the backend Vercel project's environment settings.
