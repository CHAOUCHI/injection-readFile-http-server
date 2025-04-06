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

## Quelle à été l'attaque ?

**Le client TCP réussi à récupérer le code source du serveur alors qu'il se trouve en dehors du dossier public, ce qui constitue une faille de sécurité pour ce serveur.**

Pour ce faire, il effectue une injection (`"/../app.js"`) en prévoyant à l'avance le fait que readFile va effectuer une commande dans le file system Linux. 

Ici je récupère simplement le code source du serveur mais je pourrais aussi accéder aux fichiers personnels de l'utilisateur qui a lancer le serveur.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../../../../../../../../../../../home/massinissa/.bashrc");
```

> Remplacez massinissa par votre username linux.

Parfois l'utilisateur c'est directement root qui lance les programmes sur le serveur
```bash
cd http-server-non-secure
sudo node app.js 
```

A cause de cette faille, dans ce cas, je peux accéder au dossier personnel de l'utilisateur root.

```js
new CustomHTTPRequest(3050, "127.0.0.1", "/../../../../../../../../../../../root/.bashrc");
```

## Comment se protéger contre une injection ?
Une injection peut se produire quand une entréee utilisateur est fournit à un interpréteur (ici l'interpreteur bash).

Pour se protéger contre une injection il faut sanitariser l'entrée utilisateur, c'est à dire retirer les données dangereuses avant la concaténation du readFile voir même refuser la requete du client si la requete est non-conforme.

Par exemple
```js
req.url = req.url.replaceAll("../","");
```

 > Personnelement, je pense que le mieux est encore d'utiliser une regex pour valider l'uri envoyé par l'utilisateur.

Faite donc très attention à toujours respecter la règle du Least Privileges : https://en.wikipedia.org/wiki/Principle_of_least_privilege
