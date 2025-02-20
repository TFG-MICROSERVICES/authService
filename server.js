import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';
import database from './db/database.js';
import cookieParser from 'cookie-parser';
import { EventEmitter } from 'events';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//UTILITIES
EventEmitter.defaultMaxListeners = 30;
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

//ROUTES
app.use('/auth', authRoutes);

//MIDDLEWARE FOR ROUTE NOT FOUND
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

//MIDDLEWARE FOR ERROR HANDLING
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
    });
});

database
    .sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
