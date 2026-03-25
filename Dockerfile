# Usa l'immagine ufficiale di Node.js
FROM node:20

# Crea la cartella di lavoro nel container
WORKDIR /usr/src/app

# Copia i file dei pacchetti
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Copia tutto il resto del codice
COPY . .

# Compila il codice TypeScript in JavaScript
RUN npm run build

# Espone la porta 3000
EXPOSE 3000

# Comando per avviare l'app
CMD ["node", "dist/index.js"]