<h1 align="center" style="border-bottom: none;"><img src="public/favicon.svg" width="24" style="vertical-align: middle; margin-right: 8px;" /> Transmission Next UI</h1>
<h3 align="center"> Une interface web tierce et moderne pour Transmission, élégante et responsive, pour gérer vos torrents facilement, construite avec shadcn/ui et Vite. </h3>

## Stack technique

- **Framework** : [React 19](https://react.dev/) + [Vite 7](https://vite.dev/)
- **Style** : [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Composants** : [shadcn/ui](https://ui.shadcn.com/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Routage** : [React Router 7](https://reactrouter.com/)

---

Français | [English](README.md) | [简体中文](README.ch.md)

## Aperçu

[**Démo en ligne**](https://transmission-next-ui-demo.pages.dev)

| Mode clair | Mode sombre |
| :---: | :---: |
| ![dashboard_light_en.png](pic/dashboard_light_en.png) | ![dashboard_dark_en.png](pic/dashboard_dark_en.png) |

| Détails d'un torrent | Paramètres |
| :---: | :---: |
| ![torrent_details_en.png](pic/torrent_details_en.png) | ![settings_en.png](pic/settings_en.png) |

## Fonctionnalités

- Design d'interface moderne
- Affichage responsive, adapté à tous les appareils
- Propulsé par Vite et Tailwind CSS 4.0
- [x] Gestion des torrents et consultation des informations
- [x] Configuration des paramètres
- [x] Ajout de torrents par glisser-déposer ou collage
- [x] Mode sombre
- [x] Filtre par tracker
- [x] Prise en charge des étiquettes de torrents
- [x] Remplacement de trackers en masse
- [x] Déplacement du dossier de téléchargement en masse
- [x] Définition des étiquettes en masse

⚠️**Avertissement** : ce projet en est à une version précoce et n'a pas encore été entièrement testé. Vérifiez son fonctionnement avant de l'utiliser en production.

## Démarrage rapide

Vous pouvez déployer Transmission Next UI de trois façons :

### 1. Installation facile

> Prérequis : `docker`, `docker-compose` et `curl`

> [!TIP]
> Il est recommandé de créer d'abord un dossier dédié :
> ```bash
> mkdir -p ~/transmission && cd ~/transmission
> ```

Pour installer l'interface web ou passer à la dernière version, exécutez la commande suivante :

```bash
curl -fsSL https://raw.githubusercontent.com/hisproc/transmission-next-ui/main/download.sh | bash
```

Cela télécharge la dernière version et crée un fichier `docker-compose.yml` dans votre dossier courant.

Modifiez ensuite ce fichier pour définir votre **nom d'utilisateur**, votre **mot de passe** et votre **fuseau horaire** Transmission :

```yaml
environment:
  - USER=your-username
  - PASS=your-password
  - TZ=Asia/Shanghai
```

Utilisez ensuite les commandes suivantes pour démarrer ou arrêter le service :

```bash
docker-compose up -d   # démarrer en arrière-plan
docker-compose down    # arrêter et supprimer le conteneur
```

Les ports suivants sont mappés par défaut :

| Port | Protocole | Usage |
| --- | --- | --- |
| `9091` | TCP | Interface web et API RPC — accédez à l'interface sur `http://localhost:9091` |
| `51413` | TCP/UDP | Transferts BitTorrent — utilisé pour les connexions entre pairs ; garder ce port ouvert améliore les performances de téléchargement |

Si vous avez modifié les ports dans le fichier de configuration de Transmission (dossier `config`), pensez à adapter en conséquence les mappages de ports dans `docker-compose.yml`.

### 2. Installation manuelle

1. Rendez-vous sur la page des [Releases](https://github.com/hisproc/transmission-next-ui/releases)
2. Téléchargez la dernière version ou une version stable (par ex. `transmission-next-ui-v1.0.0.zip`)
3. Décompressez l'archive et copiez son contenu dans le dossier web de Transmission (par ex. transmission/web/src)

### 3. Compilation depuis les sources

```bash
git clone git@github.com:hisproc/transmission-next-ui.git
cd transmission-next-ui
pnpm install
pnpm build
```

Copiez ensuite le contenu du dossier `dist/` dans le dossier web de Transmission.

## Licence

Ce projet est distribué sous [licence MIT](LICENSE).
