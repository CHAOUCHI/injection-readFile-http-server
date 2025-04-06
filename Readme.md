# Démonstration d'une injection

Vous trouverez aussi un serveur HTTP possédant une faille de sécurité Une injection.

1. Pour démarrer le serveur HTTP Faites la commande suivante :

```bash
cd http-server-non-secure
node app.js 
```

2. Pour démarrer le client HTTP pirates, faites les commandes suivantes :

```bash
cd client-http-node
npm run start
```

Rendez-vous dans le code source du client http node. Pour voir comment est-ce que un client HTTP pirate a été fabriqué à partir d'un client TCP.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../app.js");
```

Le client TCP réussi à récupérer le code source du serveur alors qu'il se trouve en dehors du dossier public, ce qui constitue une faille de sécurité pour ce serveur. 

Pour ce faire, il effectue une injection (`"/../app.js"`) en prévoyant à l'avance le fait que readFile va effectuer une commande dans le file system Linux. 