# Wrestling Photos Scraper & Viewer

Application permettant de scraper et visualiser des photos de catch depuis unevuedemaplace.fr.

## Fonctionnalités

- Scraping automatisé des photos de catch
- Visualisation organisée par événement, rangée et section
- Filtres avancés pour trouver les photos par emplacement

## Déploiement avec Traefik via RunTipi

### Prérequis

- Docker et Docker Compose installés
- RunTipi configuré avec Traefik

### Instructions de déploiement

1. Cloner ce dépôt sur votre serveur:

   ```
   git clone <your-repo-url> catch-photos
   cd catch-photos
   ```

2. Construire et démarrer l'application:

   ```
   docker-compose up -d
   ```

3. L'application sera accessible à l'adresse https://catch.beben0.com

### Configuration RunTipi

Si vous utilisez RunTipi, vous pouvez également déployer cette application en tant qu'app personnalisée:

1. Accédez à l'interface d'administration RunTipi
2. Allez dans la section "Apps > Apps personnalisées"
3. Créez une nouvelle app personnalisée et utilisez ce dépôt Git
4. Configurez les paramètres suivants:
   - Nom: Wrestling Photos
   - Domaine: catch.beben0.com
   - Port interne: 3000
   - Variables d'environnement: NODE_ENV=production
   - Volume: /data/app:/app/public

RunTipi s'occupera automatiquement de la configuration de Traefik et des certificats SSL.

### Configuration DNS

Assurez-vous que le sous-domaine `catch.beben0.com` pointe vers l'IP de votre serveur RunTipi.

### Volumes

Les photos scrapées sont stockées dans le dossier `./public/images` qui est monté comme volume persistant.

### Mises à jour

Pour mettre à jour l'application:

```
git pull
docker-compose down
docker-compose up -d --build
```

## Scraping manuel

Après déploiement, vous pouvez lancer un scraping manuel en visitant:

```
https://catch.beben0.com/scrape
```

Le scraping s'exécutera en arrière-plan et les photos seront automatiquement ajoutées à la base de données.

## Structure du projet

```
.
├── public/                # Fichiers statiques
│   ├── images/            # Photos téléchargées
│   └── photo_data.json    # Métadonnées des photos
├── src/
│   ├── routes/            # Routes de l'application
│   ├── views/             # Templates Handlebars
│   │   └── layouts/       # Layouts des pages
│   ├── index.js           # Point d'entrée de l'application
│   └── scraper.js         # Module de scraping
├── package.json
└── README.md
```

## Comment ça fonctionne

1. Le scraper utilise Puppeteer pour charger la page et extraire les informations sur les photos.
2. Les photos sont téléchargées et stockées dans le dossier `public/images`.
3. Les métadonnées des photos sont sauvegardées dans `public/photo_data.json`.
4. L'application Express sert une interface web qui organise et affiche les photos.

## Remarques

Ce projet est destiné à un usage éducatif uniquement. Assurez-vous de respecter les conditions d'utilisation du site web cible.
