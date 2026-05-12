import {IToken} from "../models/token.model";
import {Client, QueryResult} from "pg";
import * as jwt from 'jsonwebtoken';
import {IUser} from "../models/user.model";

class TokenService {
    constructor(private client: Client) {
    }

    public async create(user: IUser): Promise<IToken> {
        const tokenData = {
            userID: user.userID,
            name: user.name,
            email: user.email
        };

        const value: string = jwt.sign(
            tokenData,
            "secret",
            { expiresIn: '3h' }
        );

        try {
            const result = await this.client.query(
                "INSERT INTO news_room.tokens(user_id, create_date, value) " +
                `VALUES (${user.userID}, NOW(), '${value}') ` +
                "RETURNING token_id"
            );

            if(result.rowCount > 0)
                return {
                    tokenID: result.rows[0].token_id,
                    value: value
                };
            return null;
        } catch (e) {
            console.error("Error while creating token", e);
            throw new Error("Error while creating token");
        }
    }

    public async remove(tokenID: number): Promise<boolean> {
        try {
            const result = await this.client.query(
                `DELETE FROM news_room.tokens WHERE token_id=${tokenID}`
            );

            return result.rowCount > 0;
        } catch (e) {
            console.error("Error while removing token", e);
            throw new Error("Error while removing token");
        }
    }
}

export default TokenService;