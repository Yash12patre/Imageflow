import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  requestId: { type: String, required: true },
  serialNumber: { type: Number, required: true },
  productName: { type: String, required: true },
  inputImageUrls: { type: [String], required: true },
  outputImageUrls: { type: [String], default: [] },
});

export default mongoose.model('Product', productSchema);