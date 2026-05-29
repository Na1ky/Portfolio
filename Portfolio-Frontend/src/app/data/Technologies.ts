export interface ICategory {
  id: number;
  name: string;
}

export interface ITechnologies extends Document {
  _id: number;
  created_at: string;
  name: string;
  icon_url: string;
  description: string;
  category: ICategory;
}
