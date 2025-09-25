import { Router } from 'express';

const router = new Router();
const data = require('./data.json')

router.get('/', async function (req, res) {
  try {
    res.json(data);
  } catch (err) {
    console.error(`Error while getting programming languages `, err.message);
  }
});

export default router;
