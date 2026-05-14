import Controller from '../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import NewsService from "../modules/services/news.service";
import {INews} from "../modules/models/news.model";
import {auth} from "../middlewares/auth.middleware";

class NewsController implements Controller {
    public path = '/news';
    public router = Router();

    constructor(private newsService: NewsService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.returnAllNews);
        this.router.get(`${this.path}/saved`, auth, this.returnSavedNews);
        this.router.get(`${this.path}/rating/:newsID`, auth, this.returnUserNewsRating);
        this.router.post(`${this.path}/saved/:newsID`, auth, this.saveNews);
        this.router.post(`${this.path}/rating/:newsID`, auth, this.rateNews);
        this.router.delete(`${this.path}/saved/:newsID`, auth, this.removeSavedNews);
    }

    private returnAllNews = async (request: Request, response: Response) => {
        try {
            const news: INews[] = await this.newsService.getAllNews();
            if(news)
                return response.status(200).send(news);
            return response.status(404).send("Could not find news.");
        } catch (error) {
            console.log("Error while requesting news data: ", error);
            return response.status(500).send({error: error});
        }
    }

    private returnSavedNews = async (request: Request, response: Response) => {
        const { token } = request.body;

        try {
            const news: INews[] = await this.newsService.getSavedNews(token.userID);
            return response.status(200).send(news);
        } catch (e) {
            console.log("Error while requesting saved news data: ", e);
            return response.status(500).send(e.message);
        }
    }

    private returnNewsRating = async (request: Request, response: Response) => {
        const { newsID } = request.params;

        try {
            const rating = await this.newsService.getNewsRating(Number(newsID));
            if(rating)
                return response.status(200).send(rating);
            else
                return response.status(200).send({value: 0});
        } catch (e) {
            console.log("Error while requesting news rating: ", e);
            return response.status(500).send(e.message)
        }
    }

    private returnUserNewsRating = async (request: Request, response: Response) => {
        const { newsID } = request.params;
        const { token } = request.body;

        try {
            const rating = await this.newsService.getUserNewsRating(token.userID, Number(newsID));
            if(rating)
                return response.status(200).send(rating);
            else
                return response.status(200).send({value: 0});
        } catch (e) {
            console.log("Error while requesting user's news rating: ", e);
            return response.status(500).send(e.message)
        }
    }

    private saveNews = async (request: Request, response: Response) => {
        const { newsID } = request.params;
        const { token } = request.body;

        try {
            if(await this.newsService.insertSavedNews(token.userID, Number(newsID)))
                return response.status(200).send("News saved.");
            else
                return response.status(404).send("Wrong news id.");
        } catch (e) {
            console.log("Error while saving news: ", e);
            return response.status(500).send(e.message);
        }
    }

    private rateNews = async (request: Request, response: Response) => {
        const {newsID} = request.params;
        const {token, value} = request.body;

        try {
            if(await this.newsService.insertOrUpdateRating(token.userID, Number(newsID), value))
                return response.status(200).send("Rating added.");
            else
                return response.status(400).send("Wrong news id.");
        } catch (e) {
            console.log("Error while rating news: ", e);
            return response.status(500).send(e.message);
        }
    }

    private removeSavedNews = async (request: Request, response: Response) => {
        const { newsID } = request.params;
        const { token } = request.body;

        try {
            if(await this.newsService.deleteSavedNews(token.userID, Number(newsID)))
                return response.status(200).send("News removed from saved.");
            return response.status(404).send("Wrong news id.");
        } catch (e) {
            console.log("Error while deleting saved news: ", e);
            return response.status(500).send(e.message);
        }
    }

}

export default NewsController;