import {NextFunction, Request, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import {IUser} from "../modules/models/user.model";

export const auth = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers['x-access-token'] || request.headers['authorization'];
    if(token && typeof token === 'string') {
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        try {
            jwt.verify(token, "secret", (err, decoded) => {
                if(err)
                    return response.status(400).send('Invalid token.');

                request.body.token = decoded;
                next()
                return;
            });
        } catch (e) {
            return response.status(400).send('Invalid token.');
        }
    } else {
        return response.status(401).send('Access denied. No token provided.');
    }
}