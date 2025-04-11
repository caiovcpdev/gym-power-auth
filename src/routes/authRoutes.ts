import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import { UserModel } from '../models/user';

const router = express();
const JWT_SECRET = process.env.JWT_SECRET || '0f2408b3943bf1bf47c8dc9f1b104de84602d90d0caa14a55a98b29a56b255395c7a3afdde42c2d70af78698626e266b7a094db38fb3417cdadb07fe0ce61de9ad394993ebfaa3dcfc505c4872fa2fca45ae48c902de9566d7968ff50b59c28883946777e9daef9807c36db7a662931473b8f8f4c8a4f4691d6a1770573120792706376c1839ccf9208ab43b74528beb586aa09cdd5b2e11635a1c8cad39ecb4fdd3a68dd5a27125f55d33e233ca681ae6fae6d5f5cc0c1358db646d50b5a1eda607c2c6e615aec162c9aa460e47960a8b6f4cc5d146d86d64dfb7b5054835463dd13dbc4b3f5606e7c72b3d8b988d9a7d5b9e2e583e91ad28aeb2491dca4c24'
const TPU_ID_PROFESSOR = 2;


router.post('/register', async (req: Request, res:Response): Promise<any> => {
    const {email, password, gender, name, register_num} = req.body;

    if(!email || !password || !name || !register_num || !gender){
        return res.status(400).json({message:'Campos obrigatorios'});
    }

   const existingUser = await UserModel.findByEmail(email);
   if (existingUser) {
    return res.status(400).json({message : 'Usuário já cadastrado no sistema.'})
   }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
        email,
        password :hashedPassword,
        name,
        register_num,
        gender,
        user_type : TPU_ID_PROFESSOR, //laguis aqui é onde eu passo o id do professor!!!
        acess_id: 1
    });

    const token = jwt.sign({id: newUser.id, email}, JWT_SECRET, {expiresIn: '1h'});
    res.status(201).json({token});
})

router.post('/login', async (req: Request, res: Response): Promise<any> => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' })
    }

    const user = await UserModel.findByEmail(email);
    if(!user || !(await bcrypt.compare(password, user.password))){ //verificando o e comparando senhas laguis
        return res.status(401).json({message : 'Credenciais inválidas'})
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
})


export default router;