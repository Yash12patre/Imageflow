import axios from 'axios';

export const triggerWebhook = async (url, data) => {
  try {
    await axios.post(url, data);
    console.log('Webhook triggered successfully');
  } catch (error) {
    console.error('Webhook error:', error);
  }
};