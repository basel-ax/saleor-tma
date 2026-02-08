import { Router } from 'express';
import bodyParser from 'body-parser';
import WebAppHandlers from '../handlers/webapp.js';
import saleorService from '../services/saleor.js';
const router = Router();
// Get restaurants/shops
router.get('/restaurants', async (req, res) => {
    try {
        const restaurants = await saleorService.getShops();
        res.json({ ok: true, data: restaurants });
    }
    catch (error) {
        console.error('Error fetching restaurants:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});
// Get products from Saleor
router.get('/products', async (req, res) => {
    try {
        const shopId = req.query.shopId;
        const products = await saleorService.getProducts(20, shopId);
        res.json({ ok: true, data: products });
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});
// Web app data handler
router.post('/webapp', bodyParser.json(), async (req, res) => {
    try {
        const { method, ...data } = req.body;
        const webAppData = {
            user: { id: req.body.user_id || 0 },
            data: data
        };
        let result;
        switch (method) {
            case 'makeOrder':
                result = await WebAppHandlers.handleMakeOrder(webAppData);
                break;
            case 'checkInitData':
                result = await WebAppHandlers.handleCheckInitData(webAppData);
                break;
            case 'sendMessage':
                result = await WebAppHandlers.handleSendMessage(webAppData);
                break;
            default:
                result = { ok: false, error: 'Unknown method' };
        }
        res.json(result);
    }
    catch (error) {
        console.error('Error handling web app request:', error);
        res.status(500).json({ ok: false, error: error.message });
    }
});
export default router;
