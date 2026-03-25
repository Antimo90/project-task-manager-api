# Project & Task Manager API

Questa è una REST API sviluppata in **TypeScript** e **Node.js** per la gestione di Progetti e Task. Il sistema permette di creare, visualizzare, aggiornare ed eliminare entità legate da una relazione Many-to-Many.

## 🚀 Tech Stack

- **Linguaggio:** TypeScript
- **Runtime:** Node.js (Express)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Containerizzazione:** Docker & Docker Compose

---

## 🛠️ Installazione e Avvio

Il progetto è completamente containerizzato. Assicurati di avere Docker installato sul tuo sistema.

1.  Clona il repository.
2.  Posizionati nella cartella del progetto.
3.  Esegui il comando:
    `bash
    docker-compose up --build
    `
    L'API sarà disponibile all'indirizzo `http://localhost:3000`.

---

## 📡 Endpoint API

### Progetti (`/api/projects`)

- `GET /` : Recupera tutti i progetti.
- `GET /:id` : Recupera un progetto specifico (con i relativi Task associati).
- `POST /` : Crea un nuovo progetto.
- `PATCH /:id` : Aggiorna un progetto esistente.
- `DELETE /:id` : Elimina un progetto.

### Task (`/api/tasks`)

- `GET /` : Recupera tutti i task.
- `GET /:id` : Recupera un task specifico (con i progetti associati).
- `POST /` : Crea un nuovo task (supporta una lista di stringhe per i `tags`).
- `PATCH /:id` : Aggiorna un task esistente.
- `DELETE /:id` : Elimina un task.

### Filtri e Ricerca

- `GET /api/tasks/tag/:tagName` : Restituisce tutti i task che contengono uno specifico tag.
- `GET /api/tasks/project/:projectId` : Restituisce tutti i task assegnati a un determinato progetto.

---

## 🧠 Decisioni Architetturali

### 1. Relazione Many-to-Many

Ho implementato una relazione **Many-to-Many** tra Progetto e Task. Questa scelta riflette uno scenario reale dove un Task (es: "Configurazione Server") può essere trasversale a più Progetti diversi. TypeORM gestisce questa relazione tramite una tabella di giunzione automatica.

### 2. Gestione dei Tag

Per l'attributo `tags`, ho scelto di gestire i dati come stringhe testuali. Per far funzionare la ricerca ho usato l'operatore `LIKE` nel codice, consentendo di individuare i task che contengono una determinata etichetta all'interno della colonna. Questa scelta semplifica la gestione del database pur garantendo le funzionalità di filtraggio richieste.

### 3. Endpoint di Filtro Dedicati

Sebbene i filtri potessero essere gestiti tramite Query Parameters, ho scelto di creare endpoint semantici dedicati (es: `/tasks/tag/:name`) per rendere l'API più esplicita e intuitiva, come richiesto dai requisiti specifici dell'assignment.

### 4. Validazione e Ottimizzazione

- **Whitelist delle chiavi:** Negli aggiornamenti (`PATCH`), l'API accetta solo i campi definiti nel modello, ignorando dati extra non pertinenti.
- **Smart Update:** Il sistema verifica se i nuovi dati sono identici a quelli già presenti nel DB prima di eseguire un'operazione di salvataggio, ottimizzando le prestazioni.
- **Gestione Errori:** In caso di ricerca senza risultati (tag o ID progetto inesistenti), l'API restituisce un errore **404 Not Found** con un messaggio descrittivo invece di un array vuoto, per una migliore User Experience.

---

## 📝 Assunzioni e Compromessi

- Si assume che i nomi dei progetti siano univoci per semplicità di gestione.
- Non è stato implementato un sistema di autenticazione (JWT) in quanto non richiesto dall'obiettivo dell'assignment per profili junior.
