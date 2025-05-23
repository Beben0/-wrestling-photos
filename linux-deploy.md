# Déploiement avec image Linux (amd64)

J'ai créé une image spécifique pour les serveurs Linux standards (architecture amd64/x86_64) et l'ai publiée sur GitHub Container Registry.

## Instructions pour Portainer

### Option 1: Utiliser directement l'image distante

#### Authentification GitHub Container Registry

GitHub Container Registry exige une authentification. Voici comment procéder:

1. Crée un token d'accès personnel sur GitHub:

   - Va sur github.com → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Crée un nouveau token avec les permissions "read" pour "Packages"
   - Copie le token généré

2. Dans Portainer, va dans **Registries**:

   - Clique sur **Add registry**
   - Choisis **Custom registry**
   - URL: `ghcr.io`
   - Nom d'utilisateur: ton nom d'utilisateur GitHub
   - Mot de passe: le token d'accès créé précédemment
   - Clique sur **Add registry**

3. Crée un nouveau stack avec le contenu suivant:

```yaml
version: "3"

services:
  wrestling-photos:
    image: ghcr.io/beben0/wrestling-photos:linux-amd64
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

### Option 2: Utiliser le fichier .tar.gz (Recommandé)

Cette option évite les problèmes d'authentification:

1. Télécharge le fichier `wrestling-photos-linux.tar.gz` que je t'ai fourni
2. Dans Portainer, va dans **Images** et clique sur **Import**
3. Sélectionne le fichier et clique sur **Upload**
4. Attends la fin du téléchargement
5. Crée un stack avec la même configuration que l'option 1, mais utilise `wrestling-photos:linux-amd64` comme nom d'image

## Vérification architecture du serveur

Pour vérifier que ton serveur utilise bien amd64/x86_64:

```bash
uname -m
```

Le résultat doit être `x86_64` pour que cette image fonctionne.

## Accès à l'application

Une fois déployée, ton application sera disponible à:

- https://catch.beben0.com
- ou http://IP-DU-SERVEUR:3000
