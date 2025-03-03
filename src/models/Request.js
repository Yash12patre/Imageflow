import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  requestId: { 
    type: String, 
    required: true,
     unique: true 
    },
  status: { 
    type: String, 
    default: 'pending'
   },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Request', requestSchema);