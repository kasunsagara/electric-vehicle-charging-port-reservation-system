import express from 'express';
import {createPort, getPorts, getPortById, deletePort} from '../controllers/portController.js';

const portRouter = express.Router();

portRouter.post('/', createPort);
portRouter.get('/', getPorts);
portRouter.get('/:id', getPortById);
portRouter.delete('/:id', deletePort);

export default portRouter;
