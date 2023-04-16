# Simplon_brief6
## Pré requis

Installer Node sur votre machine

```node --version # pour voir si node est installé, si non exécuter les commandes suivantes
sudo apt update
sudo apt upgrade
sudo apt install nodejs
sudo apt install npm
```
Assurez-vous d'avoir Parcel d'installé sur votre machine

```
parcel --version

```

Si Parcel n'est pas installé sur votre machine, puis vérifier avec la commande précédente

```
sudo npm install -g parcel-bundler

```

## API KEY
Pour rentrer votre clé api, utiliser la commande suivante dans votre terminal à la racine du projet.

```
cd script
cp api_key.exemple.ts api_key.ts

```
Penser ensuite à ajouter votre clé dans le fichier api_key.ts