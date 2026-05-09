import express from 'express'
import * as http from "http";
import bodyParser from 'body-parser';
import {Client} from "pg";
import {config} from "./config";
import Controller from "./interfaces/controller.interface";
import cors from "cors"

class App {
    public app: express.Application;
    private server: http.Server;
    private dbClient: Client;

    constructor(dbClient: Client, controllers: Controller[]) {
        this.app = express();
        this.server = http.createServer(this.app);
        this.dbClient = dbClient;
        this.app.use(cors());
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.connectToDatabase();
    }

    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        })
    }

    private async connectToDatabase() {
        try {
            await this.dbClient.connect();
            console.log("Connected with database");
        } catch (error) {
            console.error("Error connecting to database: ", error);
        }

        this.dbClient.on('end', () => {
            console.log('Disconnected from database');
        });

        this.dbClient.on('error', (error: Error) => {
            console.error('Error occured in database: ', error.stack);
        });
    }

    public listen() {
        this.app.listen(config.port, () => {
            console.log(`App listening on the port ${config.port}`);
        })
    }
}

export default App;