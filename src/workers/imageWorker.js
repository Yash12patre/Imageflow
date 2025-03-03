import sharp from 'sharp';
import axios from 'axios';
import fs from 'fs';
import Product from '../models/Product.js';
import Request from '../models/Request.js';

const processImage = async (imageUrl, outputPath) => {
  const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  await sharp(response.data)
    .jpeg({ quality: 50 })
    .toFile(outputPath);
  return outputPath;
};

export const processImagesForRequest = async (requestId) => {
  const products = await Product.find({ requestId });

  for (const product of products) {
    const outputUrls = [];
    for (const inputUrl of product.inputImageUrls) {
      const outputPath = `public/images/${uuidv4()}.jpg`;
      await processImage(inputUrl, outputPath);
      outputUrls.push(outputPath);
    }
    product.outputImageUrls = outputUrls;
    await product.save();
  }


  await Request.findOneAndUpdate({ requestId }, { status: 'completed' });
};