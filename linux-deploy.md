# Déploiement avec image Linux (amd64)

J'ai créé une image spécifique pour les serveurs Linux standards (architecture amd64/x86_64).

## Instructions pour Portainer

1. Télécharge le fichier `wrestling-photos-linux.tar.gz`
2. Dans Portainer, va dans **Images** et clique sur **Import**
3. Sélectionne le fichier et clique sur **Upload**
4. Attends la fin du téléchargement
5. Crée un nouveau stack avec le contenu suivant:

```yaml
version: "3"

services:
  wrestling-photos:
    image: wrestling-photos:linux-amd64
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
