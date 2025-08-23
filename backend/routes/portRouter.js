import express from 'express';
import {createPort, getPorts, deletePort} from '../controllers/portController.js';

const portRouter = express.Router();

portRouter.post('/', createPort);
portRouter.get('/', getPorts);
portRouter.delete('/:id', deletePort);

export default portRouter;
