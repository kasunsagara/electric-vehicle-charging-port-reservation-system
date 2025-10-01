import express from 'express';
import {createPort, getPorts, getPortById, updatePort, deletePort} from '../controllers/portController.js';

const portRouter = express.Router();

portRouter.post('/', createPort);
portRouter.get('/', getPorts);
portRouter.get('/:id', getPortById);
portRouter.put('/:id', updatePort);
portRouter.delete('/:id', deletePort);

export default portRouter;
