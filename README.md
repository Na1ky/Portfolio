<h1 align="center">
  <br>
  🌐 Dominici Nicolas — Portfolio
  <br>
</h1>

<p align="center">
  <strong>Personal portfolio website built with Angular 21 & Node.js</strong><br>
  <a href="https://nicolas-dominici.it" target="_blank">🔗 nicolas-dominici.it</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 21"/>
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

---

## 📋 Indice / Table of Contents

- [📖 Panoramica](#-panoramica)
- [✨ Funzionalità](#-funzionalità)
- [🏗️ Architettura](#️-architettura)
- [🛠️ Stack Tecnologico](#️-stack-tecnologico)
- [📂 Struttura del Progetto](#-struttura-del-progetto)
- [🚀 Avvio in locale](#-avvio-in-locale)
- [🌍 Deploy](#-deploy)
- [🔌 API Reference](#-api-reference)
- [📐 Scelte Architetturali](#-scelte-architetturali)
- [📬 Contatti](#-contatti)

---

## 📖 Panoramica

Questo è il mio **portfolio personale**, un progetto full-stack che ho progettato e sviluppato interamente da zero per presentare le mie competenze tecniche, i miei progetti e i miei certificati.

Il sito è strutturato come una **Single Page Application (SPA)** con routing client-side, collegata a un backend REST custom che serve i dati dinamici da un database **MongoDB Atlas**.

Il progetto nasce dalla volontà di avere un portfolio non solo "bello da vedere", ma **realmente funzionante**, con un'infrastruttura backend reale, chiamate API, gestione degli errori e un deploy professionale.

> 🏫 Realizzato durante il percorso scolastico presso l'**ITIS**, nel contesto dell'indirizzo **Informatica e Telecomunicazioni**.

---

## ✨ Funzionalità

| Sezione | Descrizione |
|---|---|
| 🏠 **Home** | Presentazione personale con animazioni di caricamento (terminal loader) e statistiche dinamiche (N° progetti, N° certificati) recuperate via API |
| 👤 **About** | Sezione "Chi sono" con dettagli sul percorso di studi e competenze |
| 🗂️ **Portfolio** | Showcase dei progetti con dettagli, tecnologie usate e link alla demo |
| 🏅 **Certificati** | Galleria delle certificazioni conseguite, ordinata per data, con visualizzazione PDF |
| 💻 **Tech Stack** | Lista delle tecnologie padroneggiata, organizzata per categorie, servita dinamicamente dal backend |
| 📬 **Contatti** | Form di contatto funzionante integrato con **EmailJS** |
| 🌐 **i18n** | Supporto multilingua (Italiano / Inglese) tramite `@ngx-translate` |
| 📡 **SEO** | Meta tag dinamici, Open Graph, Twitter Card, sitemap XML, canonical URL e dati strutturati (Schema.org) |

---

## 🏗️ Architettura

Il portfolio è diviso in due applicazioni separate:

```
Portfolio/
├── Portfolio-Frontend/    ← SPA Angular (client)
└── Portfolio-Backend/     ← REST API Node.js/Express (server)
```

```
┌──────────────────────┐        HTTPS/REST        ┌─────────────────────────┐
│                      │  ──────────────────────▶  │                         │
│   Angular 21 SPA     │                           │   Express + TypeScript  │
│   (Vercel / CDN)     │  ◀──────────────────────  │   (Vercel Serverless)   │
│                      │       JSON responses       │                         │
└──────────────────────┘                           └────────────┬────────────┘
                                                                │
                                                                │ Mongoose/MongoDB Driver
                                                                ▼
                                                   ┌─────────────────────────┐
                                                   │     MongoDB Atlas        │
                                                   │  (Cloud Database)        │
                                                   └─────────────────────────┘
```

### Flusso dei dati

1. L'utente accede al sito — Angular carica la SPA.
2. Il `DataService` effettua chiamate `fetch()` verso il backend Express.
3. Il backend recupera i dati da MongoDB Atlas e li restituisce come JSON.
4. I componenti Angular renderizzano i dati ricevuti.

---

## 🛠️ Stack Tecnologico

### Frontend

| Tecnologia | Versione | Ruolo |
|---|---|---|
| **Angular** | 21 | Framework SPA principale |
| **TypeScript** | 5.9 | Linguaggio principale |
| **Bootstrap** | 5.3 | Grid system e componenti UI |
| **Bootstrap Icons** | 1.13 | Iconografia |
| **Font Awesome** | 7.1 | Iconografia aggiuntiva |
| **Anime.js** | 4.2 | Animazioni JavaScript |
| **AOS** | 2.3 | Animazioni on-scroll |
| **@ngx-translate** | 17 | Internazionalizzazione (i18n) |
| **EmailJS** | 3.2 | Invio email lato client |
| **Supabase JS** | 2 | (Integrazione storage) |
| **RxJS** | 7.8 | Gestione stream reattivi |
| **Poppins** | — | Font principale |

### Backend

| Tecnologia | Versione | Ruolo |
|---|---|---|
| **Node.js + Express** | 4.18 | REST API server |
| **TypeScript** | 5.6 | Linguaggio principale |
| **MongoDB** | 7.0 | Database driver nativo |
| **Mongoose** | 9.1 | ODM per MongoDB |
| **dotenv** | — | Gestione variabili d'ambiente |
| **cors** | 2.8 | Gestione CORS |
| **Nodemon** | 3.0 | Hot-reload in sviluppo |

### DevOps & Deploy

| Strumento | Utilizzo |
|---|---|
| **Vercel** | Deploy automatico di frontend e backend |
| **MongoDB Atlas** | Database cloud gestito |
| **Git / GitHub** | Version control |
| **Prettier** | Code formatting |

---

## 📂 Struttura del Progetto

```
Portfolio/
│
├── Portfolio-Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── home/                  # Pagina principale
│   │   │   │   ├── about/                 # Sezione "Chi sono"
│   │   │   │   ├── portfolio-showcase/    # Galleria progetti
│   │   │   │   ├── project-card/          # Card singolo progetto
│   │   │   │   ├── certificate-card/      # Card singolo certificato
│   │   │   │   ├── tech-stack-card/       # Card tecnologia
│   │   │   │   ├── contact/               # Form contatti
│   │   │   │   ├── navbar/                # Navigazione
│   │   │   │   ├── footer/                # Footer
│   │   │   │   ├── loading/               # Spinner di caricamento
│   │   │   │   └── terminal-loader/       # Animazione terminale iniziale
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── data.service.ts        # Chiamate HTTP al backend
│   │   │   │   └── seo.service.ts         # Gestione meta tag dinamici
│   │   │   │
│   │   │   ├── data/
│   │   │   │   ├── projects.ts            # Interfaccia IProject
│   │   │   │   ├── certificates.ts        # Interfaccia ICertificate
│   │   │   │   └── Technologies.ts        # Interfacce ITechnologies, ICategory
│   │   │   │
│   │   │   ├── app.routes.ts              # Definizione routes SPA
│   │   │   └── app.config.ts              # Configurazione providers Angular
│   │   │
│   │   ├── index.html                     # Entry point HTML + Schema.org
│   │   ├── sitemap.xml                    # Sitemap per SEO
│   │   └── styles.css                     # Stili globali
│   │
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
└── Portfolio-Backend/
    ├── server.ts                           # Entry point Express
    ├── src/
    │   ├── config/
    │   │   └── database.ts                # Connessione MongoDB Atlas
    │   │
    │   ├── middleware/
    │   │   └── corsMiddleware.ts          # CORS + global error handler
    │   │
    │   ├── routes/
    │   │   ├── projects.ts                # GET /api/projects
    │   │   ├── certificates.ts            # GET /api/certificates
    │   │   └── technologies.ts            # GET /api/technologies
    │   │
    │   └── services/
    │       ├── projectService.ts          # Business logic progetti
    │       ├── certificateService.ts      # Business logic certificati
    │       └── technologyService.ts       # Business logic tecnologie
    │
    ├── static/                            # Asset statici serviti dal backend
    │   ├── img/
    │   └── cv/
    │
    ├── vercel.json                        # Configurazione deploy Vercel
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 Avvio in locale

### Prerequisiti

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Angular CLI** ≥ 21
- Un cluster **MongoDB Atlas** attivo (o MongoDB locale)

---

### 1. Clona il repository

```bash
git clone https://github.com/<tuo-username>/Portfolio.git
cd Portfolio
```

---

### 2. Avvia il Backend

```bash
cd Portfolio-Backend
npm install
```

Crea il file `.env` nella root del backend:

```env
PORT=3100
MONGO_USER=il_tuo_utente
MONGO_PASS=la_tua_password
MONGO_CLUSTER=cluster0.xxxxx.mongodb.net
MONGO_DB=portfolio
CLIENT_URL=http://localhost:4200
```

Avvia il server in modalità sviluppo:

```bash
npm run dev
```

> Il server sarà disponibile su `http://localhost:3100`  
> Health check: `http://localhost:3100/health`

---

### 3. Avvia il Frontend

```bash
cd ../Portfolio-Frontend
npm install
npm start
```

> Il frontend sarà disponibile su `http://localhost:4200`

---

## 🌍 Deploy

Il progetto è deployato interamente su **Vercel**:

| Componente | URL |
|---|---|
| **Frontend** | [nicolas-dominici.it](https://nicolas-dominici.it) |
| **Backend API** | [portfolio-server-green-beta.vercel.app](https://portfolio-server-green-beta.vercel.app) |

### Backend — Variabili d'ambiente Vercel

Nel pannello Vercel del progetto backend, configura le seguenti environment variables:

```
MONGO_USER       → utente MongoDB Atlas
MONGO_PASS       → password MongoDB Atlas
MONGO_CLUSTER    → hostname cluster (es. cluster0.xxxxx.mongodb.net)
MONGO_DB         → nome database
CLIENT_URL       → https://nicolas-dominici.it
```

---

## 🔌 API Reference

Il backend espone le seguenti API REST:

### Projects

| Method | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/projects` | Restituisce tutti i progetti |
| `GET` | `/api/projects/count` | Restituisce il numero totale di progetti |

### Certificates

| Method | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/certificates` | Restituisce tutti i certificati |
| `GET` | `/api/certificates/count` | Restituisce il numero totale di certificati |

### Technologies

| Method | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/technologies` | Restituisce tutte le tecnologie |
| `GET` | `/api/technologies/categories` | Restituisce le categorie disponibili |

### Health Check

| Method | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/health` | Verifica che il server sia attivo |

#### Esempio risposta `/api/projects`

```json
[
  {
    "_id": 1,
    "title": "Portfolio",
    "description": "Sito portfolio personale full-stack",
    "image_url": ["https://..."],
    "details": "Progetto realizzato con Angular 21 e Node.js...",
    "technologies_used": ["Angular", "TypeScript", "MongoDB"],
    "demo_url": "https://nicolas-dominici.it"
  }
]
```

#### Esempio risposta `/api/certificates`

```json
[
  {
    "_id": 1,
    "name": "Nome Certificato",
    "issuer_name": "Ente Emittente",
    "date_achieved": "2024-05-01",
    "image_url": "https://...",
    "pdf_url": "https://..."
  }
]
```

---

## 📐 Scelte Architetturali

### Perché Angular 21?
Ho scelto Angular per la sua struttura fortemente tipizzata, l'ottimo sistema di routing e la gestione dei componenti. La versione 21 introduce `provideZonelessChangeDetection()`, che ho usato per migliorare le performance eliminando la dipendenza da Zone.js.

### Perché un backend separato?
Avrei potuto usare un semplice headless CMS o Supabase direttamente dal frontend, ma ho preferito costruire un **backend custom in Node.js + Express** per:
- Avere controllo completo sulla logica business.
- Gestire la sicurezza CORS in modo granulare.
- Praticare lo sviluppo lato server in TypeScript.
- Servire gli asset statici (CV, immagini) dallo stesso server.

### Gestione SEO dinamica
Ho implementato un `SeoService` custom che aggiorna dinamicamente **title**, **meta description**, **Open Graph** e **Twitter Card** ad ogni navigazione, garantendo una corretta indicizzazione anche per una SPA.

### Gestione del CORS
Il middleware CORS è configurato con una **whitelist esplicita** di origini autorizzate, con supporto a protocolli alternativi (http/https) e normalizzazione degli URL per evitare errori comuni in produzione.

### Sorting certificati
I certificati vengono ordinati lato backend per data (`date_achieved` o `created_at`) in ordine decrescente, in modo da mostrare sempre i più recenti per primi.

---

## 📬 Contatti

<p>
  <a href="https://nicolas-dominici.it/contact">🌐 nicolas-dominici.it/contact</a><br>
  <a href="https://github.com/NicolasDominici">🐙 GitHub</a><br>
  <a href="https://linkedin.com/in/nicolas-dominici">💼 LinkedIn</a>
</p>

---

<p align="center">
  Fatto con ❤️ da <strong>Dominici Nicolas</strong> · 2024–2026
</p>
