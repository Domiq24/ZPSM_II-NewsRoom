import App from './app';
import type Controller from "./interfaces/controller.interface";
import IndexController from "./controllers/index.controller";
import {Client} from "pg";
import {config} from "./config";
import NewsController from "./controllers/news.controller";
import NewsService from "./modules/services/news.service";
import UserController from "./controllers/user.controller";
import UserService from "./modules/services/user.service";
import TokenService from "./modules/services/token.service";

const client = new Client({
    user: config.dbUser,
    password: config.dbPassword,
    host: config.dbHost,
    port: config.dbPort,
    database: config.database
});

function createControllers(): Controller[] {
    const newsService = new NewsService(client);
    const userService = new UserService(client);
    const tokenService = new TokenService(client);

    return [
        new UserController(userService, tokenService),
        new NewsController(newsService),
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