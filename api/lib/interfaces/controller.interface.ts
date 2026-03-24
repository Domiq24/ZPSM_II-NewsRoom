import { Router } from 'express';
import { Client } from 'pg';

interface Controller {
    path: string;
    router: Router;
}

export default Controller;