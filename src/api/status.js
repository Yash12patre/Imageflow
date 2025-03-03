import express from 'express';
import Request from '../models/Request.js';
import Product from '../models/Product.js';

const router = express.Router();

router.get('/:requestId', async (req, res) => {
  const { requestId } = req.params;

  const request = await Request.findOne({ requestId });
  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  const products = await Product.find({ requestId });
  res.status(200).json({ status: request.status, products });
});

export default router;