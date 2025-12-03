export interface Recipe {
    id: string;
    title: string;
    price: number;
    calories: number;
    cookTime: number;
    image: string;
    ingredients: string[];
    instructions: string[];
    createdAt?: string;
    updatedAt?: string;
}
