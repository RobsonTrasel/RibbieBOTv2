import {Router} from 'express';
import {AppContainer} from "../../../container/app.container";


const router = Router();
const app = new AppContainer();

router.post('/', async (req, res) => {
    try {
        await app.controller.handle(req.body);
        res.sendStatus(200);
    } catch (err) {
        console.error('❌ Erro no webhook:', err);
        res.sendStatus(500);
    }
});

export default router;
