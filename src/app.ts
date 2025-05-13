import express from 'express';
import dotenv from 'dotenv';
import webhook from './infrastructure/web/routes/webhook.route';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/webhook', webhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bot rodando na porta ${PORT}`);
});
