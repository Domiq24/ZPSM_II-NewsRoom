import express from 'express'
import * as http from "http";
import {config} from "./config";
import Controller from "./interfaces/controller.interface";

class App {
    public app: express.Application;
    private server: http.Server;

    constructor(controllers: Controller[]) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.initializeControllers(controllers);
    }

    initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    public listen() {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        })
    }
}

export default App;