import { getDB } from "../config/database";

export const getProjects = async () => {
    const db = getDB();
    const collection = db.collection("Projects");
    return await collection.find().sort({ date_achieved: -1 }).toArray();
};

export const getProjectsCount = async (): Promise<number> => {
    const db = getDB();
    const collection = db.collection("Projects");
    return await collection.countDocuments();
};
