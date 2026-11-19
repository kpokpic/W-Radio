# W. Radio — Guide macOS gratuit

Cette application utilise uniquement des technologies gratuites et open source :

- React
- Vite
- TypeScript
- Tailwind CSS
- pnpm
- Node.js

## 1. Installer les outils

Ouvrez l’application **Terminal** sur votre Mac.

### Installer Homebrew

Si Homebrew n’est pas encore installé :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Installer Node.js et pnpm

```bash
brew install node pnpm
```

Vérifiez les installations :

```bash
node --version
pnpm --version
```

## 2. Ouvrir le projet

Décompressez `W-Radio.zip`, puis placez-vous dans le dossier depuis le Terminal :

```bash
cd ~/Downloads/W-Radio
```

Adaptez le chemin si le dossier se trouve ailleurs.

## 3. Installer les dépendances

```bash
pnpm install
```

## 4. Lancer l’application

```bash
pnpm dev
```

Ouvrez ensuite l’adresse indiquée dans le Terminal, généralement :

```text
http://localhost:5173
```

## 5. Modifier l’application

Les principaux fichiers sont :

- `src/App.tsx` : écrans, contenus et interactions
- `src/index.css` : identité visuelle, responsive et animations
- `public/assets/` : logo Watwaniya

Vous pouvez modifier les fichiers avec un éditeur gratuit :

- Visual Studio Code
- Zed
- VSCodium
- Neovim dans le Terminal

Pour ouvrir le dossier avec Visual Studio Code :

```bash
code .
```

## 6. Vérifier et exporter

Formater le code :

```bash
pnpm format
```

Créer une version de production :

```bash
pnpm build
```

Les fichiers optimisés seront générés dans le dossier `dist`.

## Important

L’interface et les interactions du player sont prêtes. Pour diffuser une vraie radio,
il faudra ensuite connecter une URL de flux audio publique ou fournie par votre
hébergeur radio. Le projet actuel n’exige aucun abonnement payant pour être modifié,
lancé ou compilé localement.
