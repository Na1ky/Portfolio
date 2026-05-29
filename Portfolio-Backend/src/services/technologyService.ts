import { getDB } from "../config/database";

export const getTechnologies = async () => {
  const db = getDB();
  const collection = db.collection("Technologies");
  return await collection.find().toArray();
};

export const getTechnologiesCategories = async () => {
  const db = getDB();
  const collection = db.collection("Technologies");
  return await collection
    .aggregate([
      {
        $group: {
          _id: "$category.id",
          name: { $first: "$category.name" },
        },
      },
      { $sort: { _id: 1 } },
    ])
    .toArray();
};
