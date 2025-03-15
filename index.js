import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './src/routes/route.js';
import config from './src/config/index.js';
import startWorker from './src/workers/orderProcessing.js';
import logger from './src/logger/index.js';


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(config.mongoDBURL).then(() => logger.info('MongoDB connected')).catch(err => logger.error('DB Connection Failed', err));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

startWorker();

app.use("/api", routes)

app.listen(config.port, () => {
    logger.info(`Server is running on http://localhost:${config.port}`);
});