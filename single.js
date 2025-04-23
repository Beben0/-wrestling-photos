// Script pour explorer les fichiers et lancer l'application
const fs = require("fs");
const { execSync } = require("child_process");

console.log("=== DIAGNOSTIC ===");

// Listage des répertoires
console.log("Contenu de /tmp :");
try {
  console.log(fs.readdirSync("/tmp"));
} catch (e) {
  console.log("Erreur:", e.message);
}

console.log("\nContenu de /tmp/repo :");
try {
  console.log(fs.readdirSync("/tmp/repo"));
} catch (e) {
  console.log("Erreur:", e.message);
}

console.log("\nContenu de /tmp/repo/src :");
try {
  console.log(fs.readdirSync("/tmp/repo/src"));
} catch (e) {
  console.log("Erreur:", e.message);
}

console.log("\nContenu de /app :");
try {
  console.log(fs.readdirSync("/app"));
} catch (e) {
  console.log("Erreur:", e.message);
}

// Copie des fichiers
console.log("\n=== COPIE DES FICHIERS ===");
try {
  // Nettoyer le répertoire de destination
  execSync("rm -rf /app/*");
  console.log("Répertoire /app nettoyé");

  // Copier les fichiers du repo
  execSync("cp -rv /tmp/repo/src /app/");
  execSync("cp -rv /tmp/repo/package.json /app/");
  console.log("Fichiers copiés vers /app");

  // Créer un répertoire pour les images
  execSync("mkdir -p /app/public/images");
  console.log("Dossier public/images créé");

  // Installer les dépendances
  console.log("Installation des dépendances...");
  process.chdir("/app");
  execSync("npm install --omit=dev");
} catch (e) {
  console.log("Erreur lors de la préparation:", e.message);
}

// Liste le contenu après la copie
console.log("\nContenu de /app après copie:");
try {
  console.log(fs.readdirSync("/app"));
} catch (e) {
  console.log("Erreur:", e.message);
}

// Lancer l'application
console.log("\n=== LANCEMENT DE L'APPLICATION ===");
try {
  // Essayer de lancer avec différents chemins
  const paths = [
    "/app/src/index.js",
    "/tmp/repo/src/index.js",
    "/app/index.js",
    "/tmp/repo/index.js",
  ];

  let success = false;

  for (const path of paths) {
    try {
      if (fs.existsSync(path)) {
        console.log(`Fichier trouvé: ${path}, tentative de lancement`);
        process.chdir(path.substring(0, path.lastIndexOf("/")));

        // Au lieu de lancer directement, nous allons utiliser require() si c'est un module Node
        console.log(`Launching: node ${path}`);
        require(path);

        success = true;
        console.log(`Application lancée avec succès depuis: ${path}`);
        break;
      } else {
        console.log(`Fichier non trouvé: ${path}`);
      }
    } catch (e) {
      console.log(`Erreur lors du lancement de ${path}:`, e.message);
    }
  }

  if (!success) {
    console.log("Impossible de lancer l'application avec les chemins testés");
  }
} catch (e) {
  console.log("Erreur générale:", e.message);
}
