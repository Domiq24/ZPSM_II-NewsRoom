import {IUser} from "../models/user.model";
import {Client, QueryResult} from "pg";
import * as bcrypt from "bcryptjs";
import {IPrefs} from "../models/prefs.model";

class UserService {
    constructor(private client: Client) {
    }

    public async getUser(userID: number): Promise<IUser> {
        try {
            const data: QueryResult<IUser> = await this.client.query(
                `SELECT * FROM news_room.users WHERE user_id=${userID}`
            );
            return data.rows[0];
        } catch (e) {
            console.error("Error while getting user: ", e);
            throw new Error("Error while getting user");
        }
    }

    public async insertOrUpdateUser(user: IUser): Promise<boolean> {
        try {
            const exists = await this.client.query(`SELECT COUNT(*) FROM news_room.users WHERE user_id=${user.userID}`)

            let result;
            if(user.userID && exists.rowCount > 0) {
                result = await this.client.query(
                    `UPDATE news_room.users SET name='${user.name}', email='${user.email}', password='${user.password}' WHERE user_id=${user.userID}`
                );
            } else {
                result = await this.client.query(
                    `INSERT INTO news_room.users(name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}')`
                );
            }

            return result.rowCount > 0
        } catch (e) {
            console.error("Error while inserting or updating user: ", e);
            throw new Error("Error while inserting or updating user");
        }
    }

    public async getPrefs(userID: number): Promise<IPrefs> {
        try {
            const prefs = await this.client.query(
                `SELECT * FROM news_room.preferences WHERE user_id=${userID}`
            )

            return {
                search: prefs.rows[0].search != null ? prefs.rows[0].search : "",
                sort: prefs.rows[0].sort,
                tags: prefs.rows[0].tags != null ? prefs.rows[0].tags : [],
                dateFrom: prefs.rows[0].date_from,
                dateTo: prefs.rows[0].date_to,
                ratingFrom: prefs.rows[0].rating_from,
                ratingTo: prefs.rows[0].rating_to
            }
        } catch (e) {
            console.error("Error while getting user preferences: ", e);
            throw new Error("Error while getting user preferences");
        }
    }

    public async updatePrefs(userID: number, prefs: IPrefs): Promise<boolean> {
        try {
            const result = await this.client.query(
                "UPDATE news_room.preferences " +
                `SET ${prefs.search != "" ? `search='${prefs.search}'` : "search=NULL"}, ` +
                `${prefs.tags.length > 0 ? `tags='{${prefs.tags.map(tag => {return `"${tag}" `})}}'` : "tags=NULL"}, ` +
                `rating_from=${prefs.ratingFrom}, ` +
                `rating_to=${prefs.ratingTo}, ` +
                `${prefs.dateFrom != null ? `date_from='${this.formatDate(prefs.dateFrom)}'` : "date_from=NULL"}, ` +
                `${prefs.dateTo != null ? `date_to='${this.formatDate(prefs.dateTo)}'` : "date_to=NULL"} ` +
                `WHERE user_id=${userID}`
            );
            return result.rowCount > 0;
        } catch (e) {
            console.error("Error while updating user preferences: ", e);
            throw new Error("Error while updating user preferences");
        }
    }

    public async deleteUser(userID: number): Promise<boolean> {
        const result = await this.client.query(
            `DELETE FROM news_room.users WHERE user_id=${userID}`
        );

        return result.rowCount > 0;
    }

    public async authenticate(login: string, password: string): Promise<IUser> {
        const user = await this.client.query(
            `SELECT * FROM news_room.users WHERE name='${login}' OR email='${login}'`
        );

        if(user.rowCount > 0 && await bcrypt.compare(password, user.rows[0].password))
        {
            return {
                userID: user.rows[0].user_id,
                name: user.rows[0].name,
                email: user.rows[0].email,
                password: user.rows[0].password
            };
        }

        return null;
    }

    public async hashPassword(rawPassword: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(rawPassword, saltRounds);
    }

    private formatDate(date: Date) {
        return date.toISOString().replace('T', ' ').replace('Z', '')
    }
}

export default UserService;