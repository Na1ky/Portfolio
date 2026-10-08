# Configurazione accesso admin

L'admin usa una sessione JWT firmata dal backend e salvata in un cookie `httpOnly`. Il cookie vale 8 ore; non è leggibile da JavaScript. `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` e `JWT_SECRET` devono esistere solo nell'ambiente del backend.

## Setup locale

```powershell
Copy-Item .env.example .env
node scripts/hash-admin-password.cjs
```

In `.env`, configura i parametri MongoDB e sostituisci `ADMIN_EMAIL` e `ADMIN_PASSWORD_HASH` con i valori desiderati. Genera il segreto JWT con:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Imposta il risultato in `JWT_SECRET`, poi avvia il backend con `npm run dev` e il frontend con `npm start`. Apri `/admin/login`; dopo l'accesso, `/admin` offre liste paginated con ricerca e operazioni di creazione, modifica ed eliminazione. Le operazioni di scrittura richiedono sessione valida e origine ammessa.

## Deploy Vercel

Configura queste variabili nel progetto Vercel del backend per ogni ambiente di deploy:

- `MONGO_USER`, `MONGO_PASS`, `MONGO_CLUSTER`, `MONGO_DB`
- `CLIENT_URL=https://nicolas-dominici.it`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD_HASH` (formato `scrypt:salt:hash` generato dallo script)
- `JWT_SECRET` (almeno 32 caratteri, diverso per ambiente)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Non inserire questi valori nelle environment del frontend. Il frontend usa URL relativi `/api/...`, instradati al backend tramite il rewrite Vercel.

## API admin

- `POST /api/admin/auth/login` — email/password, crea il cookie
- `GET /api/admin/auth/session` — verifica la sessione
- `POST /api/admin/auth/logout` — elimina il cookie
- `GET /api/admin/{projects|certificates|technologies}?page=1&limit=10&search=...`
- `POST /api/admin/{projects|certificates|technologies}`
- `PUT /api/admin/{projects|certificates|technologies}/:id`
- `DELETE /api/admin/{projects|certificates|technologies}/:id`

Gli oggetti ammessi sono filtrati per i campi noti ai modelli del frontend. Gli array `image_url` e `technologies_used` nei progetti sono inseriti separando i valori con virgole. Il campo `category` delle tecnologie è JSON. Le immagini vengono caricate direttamente su Cloudinary con firma temporanea generata dal backend; l'API secret non esce mai dal backend. Se l'upload non è configurato, le altre funzioni admin restano disponibili.
