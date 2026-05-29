import { getDB } from "../config/database";

export const getCertificates = async () => {
  const db = getDB();
  const collection = db.collection("Certificates");
  return await collection
    .find()
    .sort({ date_achieved: -1, created_at: -1 })
    .toArray();
};

export const getCertificatesCount = async (): Promise<number> => {
  const db = getDB();
  const collection = db.collection("Certificates");
  return await collection.countDocuments();
};
