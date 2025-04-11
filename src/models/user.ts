import { connectToDataBase } from "../database"

export interface User {
    id: number,
    email: string,
    password: string,
    gender: string, 
    name: string,
    register_num: string,
    acess_id: number,
    user_type: number
}


export class UserModel {
    static async create (user: Omit<User, 'id'>) : Promise<User> {
        const pool = await connectToDataBase();
        const result = await pool
          .request()
          .input('EMAIL', user.email)
          .input('SENHA', user.password)
          .input('SEXO', user.gender)
          .input('NOME', user.name)
          .input('MATRICULA', user.register_num)
          .input('TIPO_ACESSO', user.acess_id)
          .input('TIPO_USUARIO', user.user_type)
          .query(`

            INSERT INTO USUARIO (U_Email, U_Senha, U_Sexo, U_Nome, U_Matricula, U_ACE_Id, U_TPU_Id)
            OUTPUT INSERTED.U_ID
            VALUES (@EMAIL, @SENHA, @SEXO, @NOME, @MATRICULA, @TIPO_ACESSO, @TIPO_USUARIO)
          `);
    
        const newId = result.recordset[0].U_ID;
        return { id: newId, ...user };
      }

      static async findByEmail(email : string) : Promise<User | null> {
        const pool = await connectToDataBase();
        const result = await pool     
                                .request()
                                .input('EMAIL', email)
                                .query(`
                                            SELECT 
                                                U_ID as id,
                                                U_Email as email,
                                                U_Senha as password,
                                                U_Nome as name, 
                                                U_Matricula as register_num,
                                                U_Sexo as gender,
                                                U_Tpu_Id as user_type,
                                                U_ACE_Id as number
                                            FROM 
                                                USUARIO 
                                            WHERE 
                                                U_Email = @EMAIL
                                    `);

            return result.recordset[0] || null;
      }
}