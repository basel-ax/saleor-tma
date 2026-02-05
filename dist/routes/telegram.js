import { Router } from 'express';
import WebhookHandler from '../handlers/webhook.js';
const router = Router();
router.post('/', async (req, res) => {
    try {
        const update = req.body;
        await WebhookHandler.handleUpdate(update);
        res.sendStatus(200);
    }
    catch (error) {
        console.error('Error handling update:', error);
        res.status(500).send('Error processing request');
    }
});
export default router;
//# sourceMappingURL=telegram.js.map