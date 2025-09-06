import express from 'express';
import { homepage, topicPage, comment } from '../controllers/publicController.js'

const publicRouter = express.Router();

publicRouter.get('/',homepage);
publicRouter.get('/:name',topicPage);
publicRouter.post('/:name',comment);

export default publicRouter;