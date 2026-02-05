import { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import WebAppHandlers from '../handlers/webapp.js';
import saleorService from '../services/saleor.js';
import type { ApiResponse as ApiResponseType } from '../types/index.js';

const router = Router();

// Get products from Saleor
router.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await saleorService.getProducts();
    res.json({ ok: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

// Web app data handler
router.post('/webapp', bodyParser.json(), async (req: Request, res: Response) => {
  try {
    const { method, ...data } = req.body as { method: string; [key: string]: unknown };
    
    const webAppData = {
      user: { id: (req.body as { user_id?: number }).user_id || 0 },
      data: data
    };

    let result: ApiResponseType;
    switch (method) {
      case 'makeOrder':
        result = await WebAppHandlers.handleMakeOrder(webAppData as import('../types/index.js').WebAppData);
        break;
      case 'checkInitData':
        result = await WebAppHandlers.handleCheckInitData(webAppData as import('../types/index.js').WebAppData);
        break;
      case 'sendMessage':
        result = await WebAppHandlers.handleSendMessage(webAppData as import('../types/index.js').WebAppData);
        break;
      default:
        result = { ok: false, error: 'Unknown method' };
    }

    res.json(result);
  } catch (error) {
    console.error('Error handling web app request:', error);
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

export default router;
