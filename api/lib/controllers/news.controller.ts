import Controller from '../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import {Client} from "pg";
import NewsService from "../modules/services/news.service";
import {INews} from "../modules/models/news.model";

class IndexController implements Controller {
    public path = '/news';
    public router = Router();

    constructor(private newsService: NewsService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.returnAllNews);
    }

    private returnAllNews = async (request: Request, response: Response) => {
        try {
            const news: INews[] = await this.newsService.getAllNews();
            return response.status(200).send(news);
        } catch (error) {
            console.log("Error while requesting news data:", error);
            return response.status(403).send({error: error});
        }
    }
}

export default IndexController;