
import express from 'express';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Request from '../models/Request.js';
import Product from '../models/Product.js';
import { validateCSV } from '../utils/csvValidator.js'; // Correct import
import { processImagesForRequest } from '../services/imageProcessor.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();



router.post('/', upload.single('csv'), async (req, res) => {
  const filePath = req.file.path;
  const requestId = uuidv4();
  const webhookUrl = req.body.webhookUrl; // Optional webhook URL

  // Create a new request in the database
  const newRequest = new Request({ requestId });
  await newRequest.save();

  // Process the CSV file
  const products = [];
  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      if (validateCSV(row)) {
        products.push({
          requestId,
          serialNumber: row['S. No.'],
          productName: row['Product Name'],
          inputImageUrls: row['Input Image Urls'].split(','),
        });
      }
    })
    .on('end', async () => {
      // Save products to the database
      await Product.insertMany(products);
      fs.unlinkSync(filePath); // Delete the uploaded file

      // Start image processing in the background
      processImagesForRequest(requestId, webhookUrl)
        .then(() => console.log(`Processing completed for request ${requestId}`))
        .catch((error) => console.error(`Error processing request ${requestId}:`, error));

      // Respond with the request ID
      res.status(200).json({ requestId });
    });
});

export default router;




