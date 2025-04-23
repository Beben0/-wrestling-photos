# Guide de déploiement via Portainer

## Erreur "exec format error" - Solution

Cette erreur se produit car l'image Docker a été construite pour une architecture différente de celle du serveur. Tu as besoin d'une image multi-architecture qui fonctionne à la fois sur AMD64 (Intel/AMD) et ARM64 (systèmes type Raspberry Pi ou certains serveurs cloud).

## Option 1: Déploiement avec image Docker multi-architecture

1. Télécharge le fichier `wrestling-photos-multiarch.tar.gz` créé (environ 1.3GB)
2. Dans Portainer, va dans **Images** et clique sur **Import**
3. Sélectionne le fichier `wrestling-photos-multiarch.tar.gz` et clique sur **Upload**
4. Attends la fin du téléchargement
5. Crée un nouveau stack avec le contenu suivant:

```yaml
version: "3"

services:
  wrestling-photos:
    image: wrestling-photos:multiarch
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

## Option 2: Déploiement à partir du référentiel GitHub (en spécifiant les plateformes)

Si ton serveur supporte buildx (Docker avancé), tu peux:

1. Dans Portainer, va dans **Stacks** et clique sur **+ Add stack**
2. Choisis **Repository** comme méthode
3. Remplis les informations suivantes:
   - **Name**: catch-wrestling-photos
   - **Repository URL**: https://github.com/Beben0/-wrestling-photos.git
   - **Repository reference**: main
   - **Compose path**: docker-compose.yml
   - **Build method**: Local Builder
4. Dans Options avancées (si disponible), ajoute:
   - **--platform=linux/amd64,linux/arm64**
5. Clique sur **Deploy the stack**

## Vérification du déploiement

Une fois déployé, tu peux accéder à l'application à l'adresse:

- https://catch.beben0.com (avec configuration Traefik)
- ou via l'IP du serveur et le port 3000

## Dépannage

Si l'image a des problèmes de démarrage:

1. Vérifie les logs du conteneur dans Portainer
2. Assure-toi que les volumes sont correctement montés
3. Si nécessaire, vérifie l'architecture de ton serveur avec: `uname -m`
   - x86_64 = AMD64
   - aarch64 ou arm64 = ARM64
