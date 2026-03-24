import {INews} from "../models/news.model";
import {Client} from "pg";

class NewsService {
    constructor(private client: Client) {}

    public async getAllNews(): Promise<INews[]> {
        try {
            const data = await this.client.query("SELECT * FROM news_room.news");
            return data.rows.map(row => {
                return {
                    newsID: row.news_id,
                    title: row.title,
                    author: row.author,
                    date: new Date(row.date),
                    topics: [...row.topics],
                    source: row.source,
                    introduction: row.introduction
                };
            });
        } catch (error) {
            console.error("Error while getting news data:", error);
            throw new Error("Error while getting news data");
        }
    }
}

export default NewsService;