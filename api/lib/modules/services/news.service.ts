import {INews} from "../models/news.model";
import {Client} from "pg";

class NewsService {
    constructor(private client: Client) {}

    public async getAllNews(): Promise<INews[]> {
        try {
            const data = await this.client.query(
                "SELECT n.*, AVG(r.value) AS rating " +
                "FROM news_room.news n " +
                "INNER JOIN news_room.ratings r " +
                "ON n.news_id = r.news_id " +
                "GROUP BY n.news_id"
            );
            return this.formatNews(data);
        } catch (error) {
            console.error("Error while getting news data:", error);
            throw new Error("Error while getting news data");
        }
    }

    public async getSavedNews(userID: number) {
        try {
            const data = await this.client.query(
                "SELECT n.*, AVG(r.value) AS rating " +
                "FROM news_room.news n " +
                "INNER JOIN news_room.ratings r " +
                "ON n.news_id = r.news_id " +
                "GROUP BY n.news_id " +
                `WHERE n.news_id IN (SELECT sn.news_id FROM news_room.saved_news sn WHERE sn.user_id = ${userID})`
            )
            return this.formatNews(data);
        } catch (error) {
            console.error("Error while getting saved news data:", error);
            throw new Error("Error while getting saved news data");
        }
    }

    public async insertSavedNews(userID: number, newsID: number) {
        try {
            const result = await this.client.query(
                "INSERT INTO news_room.ratings" +
                `VALUES ${userID}, ${newsID}`
            )
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error while inserting saved news:", error);
            throw new Error("Error while inserting saved news");
        }
    }

    public async insertOrUpdateRating(userID: number, newsID: number, value: number) {
        try {
            const rating = await this.client.query(
                "SELECT COUNT(*) FROM news_room.ratings " +
                `WHERE user_id=$\{userID} AND news_id=${newsID}`
            );

            let result;
            if(rating.rowCount > 0) {
                result = await this.client.query(
                    "INSERT INTO news_room.ratings" +
                    `VALUES ${userID}, ${newsID}, ${value}`
                );
            } else {
                result = await this.client.query(
                    "UPDATE TABLE news_room.ratings" +
                    `SET value=${value} ` +
                    `WHERE news_id=${newsID} AND user_id=${userID}`
                );
            }
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error while inserting rating:", error);
            throw new Error("Error while inserting rating");
        }
    }

    public async deleteSavedNews(userID: number, newsID: number) {
        try {
            const result = await this.client.query(
                "DELETE FROM news_room.saved_news" +
                `WHERE user_id=${userID} AND news_id=${newsID}`
            );
            return result.rowCount > 0;
        } catch (error) {
            console.error("Error while deleting saved news:", error);
            throw new Error("Error while deleting saved news");
        }
    }

    private formatNews(news) {
        return news.rows.map(row => {
            return {
                newsID: row.news_id,
                title: row.title,
                author: row.author,
                date: new Date(row.date),
                topics: [...row.topics],
                rating: parseFloat(row.rating),
                source: row.source,
                introduction: row.introduction
            };
        });
    }
}

export default NewsService;