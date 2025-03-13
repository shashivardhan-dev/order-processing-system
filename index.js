import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './src/routes/route.js';
import config from './src/config/index.js';


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log(config)
mongoose.connect(config.mongoDBURL).then(() => console.log('MongoDB connected')).catch(err => console.error('DB Connection Failed', err));


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api", routes)

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});