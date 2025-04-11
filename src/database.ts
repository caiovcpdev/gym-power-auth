import sql from "mssql";
import "dotenv/config";


const connectioString = process.env.DATABASE_URL;


export const dbConfig: sql.config = {
    user: "sa", // process.env.DB_USER
    password: "237recursos2211", //process.env.DB_PASSWORD
    server: "grprodev", // process.env.DB_SERVER
    database: "estudos", // process.env.DB_NAME
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  }

  export async function  connectToDataBase() {
    try{
        const pool = await sql.connect(dbConfig)
        console.log("Conexão com o banco de dados estabelecida")
        return pool;
    } catch (error) {
        console.error("Erro ao conectar com o banco de dados", error);
        throw error;
    }
  }