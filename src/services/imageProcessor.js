import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import Product from '../models/Product.js';
import Request from '../models/Request.js';
import { triggerWebhook } from '../utils/webhook.js';


const processImage = async (imageUrl) => {
  try {
    
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

  
    const outputFilename = `${uuidv4()}.jpg`;
    const outputPath = `public/images/${outputFilename}`;

    await sharp(response.data)
      .jpeg({ quality: 50 }) 
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.error(`Error processing image ${imageUrl}:`, error);
    throw error;
  }
};

export const processImagesForRequest = async (requestId, webhookUrl) => {
  try {
    const products = await Product.find({ requestId });

    for (const product of products) {
      const outputUrls = [];
      for (const inputUrl of product.inputImageUrls) {
        const outputPath = await processImage(inputUrl);
        outputUrls.push(outputPath);
      }
      product.outputImageUrls = outputUrls;
      await product.save();
    }

 
    await Request.findOneAndUpdate({ requestId }, { status: 'completed' });

 
    if (webhookUrl) {
      await triggerWebhook(webhookUrl, {
        requestId,
        status: 'completed',
        message: 'All images processed successfully.',
      });
    }

    console.log(`Processing completed for request ${requestId}`);
  } catch (error) {
    console.error(`Error processing images for request ${requestId}:`, error);
    throw error;
  }
};