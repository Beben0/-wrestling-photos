#!/bin/bash

echo "Installation de l'application de photos de catch"
echo "==============================================="

# Créer le répertoire de données
mkdir -p ./public/images
echo "✅ Répertoire des images créé"

# Installer les dépendances
npm install
echo "✅ Dépendances installées"

# Démarrer l'application
echo "🚀 Démarrage de l'application sur le port 3000"
node src/index.js 