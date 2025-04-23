# Guide de déploiement via Portainer

## Option 1: Déploiement avec image Docker compressée

1. Télécharge le fichier `wrestling-photos.tar.gz` créé
2. Dans Portainer, va dans **Images** et clique sur **Import**
3. Sélectionne le fichier `wrestling-photos.tar.gz` et clique sur **Upload**
4. Attends la fin du téléchargement (environ 530 Mo)
5. Crée un nouveau stack avec le contenu suivant:

```yaml
version: "3"

services:
  wrestling-photos:
    image: wrestling-photos:latest
    restart: unless-stopped
    volumes:
      - wrestling_photos_data:/app/public
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    networks:
      - traefik-public
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.wrestling.rule=Host(`catch.beben0.com`)"
      - "traefik.http.routers.wrestling.entrypoints=websecure"
      - "traefik.http.routers.wrestling.tls=true"
      - "traefik.http.services.wrestling.loadbalancer.server.port=3000"

volumes:
  wrestling_photos_data:

networks:
  traefik-public:
    external: true
```

## Option 2: Déploiement à partir du référentiel GitHub

1. Dans Portainer, va dans **Stacks** et clique sur **+ Add stack**
2. Choisis **Repository** comme méthode
3. Remplis les informations suivantes:
   - **Name**: catch-wrestling-photos
   - **Repository URL**: https://github.com/Beben0/-wrestling-photos.git
   - **Repository reference**: main
   - **Compose path**: docker-compose.yml
   - **Build method**: Local Builder
4. Clique sur **Deploy the stack**

## Vérification du déploiement

Une fois déployé, tu peux accéder à l'application à l'adresse:

- https://catch.beben0.com (avec configuration Traefik)
- ou via l'IP du serveur et le port 3000

## Dépannage

Si l'image a des problèmes de démarrage:

1. Vérifie les logs du conteneur dans Portainer
2. Assure-toi que les volumes sont correctement montés
3. Si nécessaire, reconstruis l'image avec `docker build -t wrestling-photos:latest .`
