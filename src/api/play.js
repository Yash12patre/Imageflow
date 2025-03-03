import express from 'express';

const router = express.Router();

router.get('/', (req, res) => { 
    console.log('Hello, world! testing thins');
    res.status(200).json({ message: 'Hello, world!' });
});

export default router;
