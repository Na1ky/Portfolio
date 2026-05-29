import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const connection_string = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?retryWrites=true&w=majority`;

let db: Db | null = null;
let client: MongoClient | null = null;

export const connectDB = async (): Promise<Db> => {
    if (db) {
        return db;
    }

    try {
        client = new MongoClient(connection_string);
        await client.connect();
        db = client.db(process.env.MONGO_DB);
        console.log("✓ Connesso a MongoDB");
        return db;
    } catch (error) {
        console.error("✗ Errore connessione MongoDB:", error);
        throw error;
    }
};

export const getDB = (): Db => {
    if (!db) {
        throw new Error("Database non inizializzato. Chiama connectDB() prima.");
    }
    return db;
};

export const disconnectDB = async (): Promise<void> => {
    if (client) {
        await client.close();
        db = null;
        console.log("✓ Disconnesso da MongoDB");
    }
};
