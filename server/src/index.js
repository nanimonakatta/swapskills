import express from "express";

const Router = express.Router();

const app = express();
app.use(express.json());


app.use('/api/v1/user/')
