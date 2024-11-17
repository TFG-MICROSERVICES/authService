import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';
import database  from './db/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(morgan("combined"));

app.use("/", authRoutes);

app.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found",
    });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
    });
});

database.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.log(err);
});