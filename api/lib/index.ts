import App from './app';
import type Controller from "./interfaces/controller.interface";
import IndexController from "./controllers/index.controller";
import {Client} from "pg";
import {config} from "./config";

const client = new Client({
    user: config.dbUser,
    password: config.dbPassword,
    host: config.dbHost,
    port: config.dbPort,
    database: config.database
});

function createControllers(): Controller[] {
    return [
        new IndexController(),
    ]
}

const controllers: Controller[] = createControllers();

const app: App = new App(client, controllers);

app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    next();
});

app.listen();