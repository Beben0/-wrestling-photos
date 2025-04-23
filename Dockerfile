FROM node:18-alpine

WORKDIR /app

# Copier les fichiers du projet
COPY . .

# Installer les dépendances
RUN npm install --omit=dev

# Créer le répertoire images
RUN mkdir -p /app/public/images

# Exposer le port
EXPOSE 3000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Commande de démarrage
CMD ["node", "src/index.js"] 