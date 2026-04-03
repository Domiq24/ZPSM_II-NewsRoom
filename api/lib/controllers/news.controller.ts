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
        this.router.get(`${this.path}/saved/:userID`, this.returnSavedNews);
        this.router.get(`${this.path}/rating/:userID/:newsID`, this.returnUserNewsRating);
        this.router.post(`${this.path}/saved/:userID`, this.saveNews);
        this.router.post(`${this.path}/rating/:userID`, this.rateNews);
        this.router.delete(`${this.path}/saved/:userID/:newsID`, this.deleteSavedNews);
    }

    private returnAllNews = async (request: Request, response: Response) => {
        try {
            const news: INews[] = await this.newsService.getAllNews();
            return response.status(200).send(news);
        } catch (error) {
            console.log("Error while requesting news data: ", error);
            return response.status(500).send({error: error});
        }
    }

    private returnSavedNews = async (request: Request, response: Response) => {
        const { userID } = request.params;

        try {
            const news: INews[] = await this.newsService.getSavedNews(Number(userID));
            return response.status(200).send(news);
        } catch (error) {
            console.log("Error while requesting saved news data: ", error);
            return response.status(500).send({error: error});
        }
    }

    private returnUserNewsRating = async (request: Request, response: Response) => {
        const {userID, newsID} = request.params;

        try {
            const rating = await this.newsService.getUserNewsRating(Number(userID), Number(newsID));
            if(rating)
                return response.status(200).send(rating);
            else
                return response.status(200).send({value: 0});
        } catch (error) {
            console.log("Error while requesting user's news rating", error);
            return response.status(500).send({error: error})
        }
    }

    private saveNews = async (request: Request, response: Response) => {
        const {userID} = request.params;
        const {newsID} = request.body;

        try {
            if(await this.newsService.insertSavedNews(Number(userID), Number(newsID)))
                return response.status(200).send({message: "News saved"});
            else
                return response.status(404).send({error: "News not found"});
        } catch (error) {
            console.log("Error while saving news: ", error);
            return response.status(500).send({error: error});
        }
    }

    private rateNews = async (request: Request, response: Response) => {
        const {userID} = request.params;
        const {newsID, value} = request.body;

        try {
            if(await this.newsService.insertOrUpdateRating(Number(userID), Number(newsID), Number(value)))
                return response.status(200).send({message: "Rating added"});
            else
                return response.status(404).send({error: "News not found"});
        } catch (error) {
            console.log("Error while rating news: ", error);
            return response.status(500).send({error: error.stack});
        }
    }

    private deleteSavedNews = async (request: Request, response: Response) => {
        const {userID, newsID} = request.params;

        try {
            if(await this.newsService.deleteSavedNews(Number(userID), Number(newsID)))
                return response.status(200).send({message: "Saved news deleted"});
            else
                return response.status(404).send({error: "News not found"});
        } catch (error) {
            console.log("Error while deleting saved news: ", error);
            return response.status(500).send({error: error});
        }
    }

}

export default IndexController;