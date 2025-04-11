import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/authRoutes';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/auth', authRoutes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Api de autenticacao rodando na porta ${PORT}`)
})
