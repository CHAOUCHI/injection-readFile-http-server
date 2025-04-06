const { readFile } = require("fs/promises");
const http = require("http");

/**
 * WARNING!!!! DO NOT USE THIS SERVER FOR PRODUCTION!!!!!
 * 
 * Un serveur HTTP qui possède une faille de sécurité. 
 * 
 * Mon serveur HTTP utilise directement l'URL fournie par le client dans la fonction readFile pour pouvoir ensuite lui envoyer le bon fichier. 
 * 
 * Le client peut procéder à une injection en précisant ../ dans l'url et ainsi accéder au reste de l'ordinateur à partir de la fonction readFile.
 * 
 * Exemple de requete http effectuant une injection
 * 
 * GET ../app.js HTTP/1.1
 * Host : localhost:3050
 * 
 * La plupart des clients HTTP vont sanitariser l'URL, ce qui fait que fetch() ou la barre de recherche de Firefox ne permettront pas d'effectuer cette injection.
 * 
 * Seulement un client http fait main à partir d'un socket TCP, que ce soit en javascript ou en langage C, ne sanitarise pas les données et permet donc d'effectuer librement cette injection. 
 * 
 * Le serveur est donc en danger. !
 * 
 * Author : Massinissa CHAOUCHI
 * GItHub : CHAOUCHI
 * GitLab : ChaouchiM
 * 
 */
http.createServer((req, res) => {
    if (req.url) {
        console.log(req.url);
        
        // Set default content to index.html
        if(req.url == "/")req.url = "/index.html";

        // readFile depending of the HTTP url request
        readFile("public" + req.url, { encoding: "utf8" })
        .then((fileContent) => {
            // File exisit !

            res.write(fileContent);
        })
        .catch(err => {
            // 404 Not FOund
            console.log(err);
            res.statusCode = 404;
            res.write("Not Found\n");
        })
        .finally(() => {
            // Close client connection
            res.end("\n");
        });
    }else{
        res.end();
    }

}).listen(3050, () => {
    console.log("Server listen on http://localhost:3050/");
})