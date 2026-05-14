import Controller from '../interfaces/controller.interface';
import {Request, Response, Router} from 'express';
import UserService from "../modules/services/user.service";
import TokenService from "../modules/services/token.service";
import {auth} from "../middlewares/auth.middleware";

class UserController implements Controller {
    public path = "/user";
    router = Router();

    constructor(private userService: UserService, private tokenService: TokenService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/pref`, auth, this.getUserPrefs)
        this.router.post(this.path, this.addUser)
        this.router.post(`${this.path}/auth`, this.authUser)
        this.router.post(`${this.path}/pref`, auth, this.savePrefs)
        this.router.delete(this.path, auth, this.deleteUser)
        this.router.delete(`${this.path}/log-out`, auth, this.logOut)
    }

    private getUserPrefs = async (request: Request, response: Response) => {
        const { token } = request.body;

        try {
            const prefs = await this.userService.getPrefs(token.userID);
            if(prefs)
                return response.status(200).send(prefs);
            return response.status(400).send("Incorrect prefs data.");
        } catch (e) {
            console.error("Error while getting user preferences: ", e);
            return response.status(500).send(e.message);
        }
    }

    private authUser = async (request: Request, response: Response) => {
        const {login, password} = request.body;

        try {
            const user = await this.userService.authenticate(login, password);
            if(user) {
                const token = await this.tokenService.create(user)
                if(token)
                    return response.status(200).send(token);
                return response.status(500).send("Could not create token.")
            }
            return response.status(400).send("Wrong login or password.")
        } catch (e) {
            console.error("Error while authenticating user: ", e);
            return response.status(500).send(e.message)
        }
    }

    private addUser = async (request: Request, response: Response) => {
        const { user } = request.body;

        try {
            user.password = await this.userService.hashPassword(user.password);
            if(await this.userService.insertOrUpdateUser(user))
                return response.status(200).send("User created.");
            return response.status(400).send("Incorrect user data.");
        } catch (e) {
            console.error("Error while adding user: ", e);
            return response.status(500).send(e.message);
        }
    }

    private savePrefs = async (request: Request, response: Response) => {
        const { token, prefs } = request.body;

        try {
            const result = await this.userService.updatePrefs(token.userID, prefs);
            if(result)
                return response.status(200).send("User preferences saved.");
            return response.status(400).send("Incorrect preferences data")
        } catch (e) {
            console.error("Error while saving user preferences: ", e);
            return response.status(500).send(e.message);
        }
    }

    private deleteUser = async (request: Request, response: Response) => {
        const { token, password } = request.body;

        try {
            const result = await this.userService.authenticate(token.name, password);
            if(result)
            {
                if(await this.userService.deleteUser(token.userID))
                    return response.status(200).send("User deleted.");
                return response.status(500).send("Could not delete user.");
            }
            return response.status(400).send("Wrong password.");
        } catch (e) {
            console.error("Error while deleting user: ", e);
            return response.status(500).send(e.message);
        }
    }

    private logOut = async (request: Request, response: Response) => {
        const { tokenID } = request.body;

        try {
            const result = await this.tokenService.remove(tokenID);
            if(result)
                return response.status(200).send("User logged out");
            return response.status(400).send("Wrong token id");
        } catch (e) {
            console.error("Error while logging out: ", e);
            return response.status(500).send(e.message);
        }
    }
}

export default UserController;