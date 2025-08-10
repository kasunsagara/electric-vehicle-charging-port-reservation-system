import express from 'express';
import {createPort, getPorts} from '../controllers/portController.js';

const portRouter = express.Router();

portRouter.post('/', createPort);
portRouter.get('/', getPorts);

export default portRouter;
