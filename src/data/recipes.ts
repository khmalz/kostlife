export interface Recipe {
  id: string;
  title: string;
  price: number;
  calories: number;
  cookTime: number;
  image: string;
  isFavorite: boolean;
}

export const recipes: Recipe[] = [
  {
    id: "1",
    title: "Cah Sawi Putih Telur",
    price: 10000,
    calories: 180,
    cookTime: 10,
    image: "https://picsum.photos/seed/cahsawi/400/300",
    isFavorite: false,
  },
  {
    id: "2",
    title: "Tempe Orek Basah",
    price: 6000,
    calories: 250,
    cookTime: 20,
    image: "https://picsum.photos/seed/tempeorek/400/300",
    isFavorite: true,
  },
  {
    id: "3",
    title: "Teriyaki Tahu Krispi",
    price: 8000,
    calories: 200,
    cookTime: 15,
    image: "https://picsum.photos/seed/teriyakitahu/400/300",
    isFavorite: true,
  },
  {
    id: "4",
    title: "Ayam Goreng Bumbu Kuning",
    price: 15000,
    calories: 350,
    cookTime: 30,
    image: "https://picsum.photos/seed/ayamgoreng/400/300",
    isFavorite: false,
  },
  {
    id: "5",
    title: "Sayur Lodeh",
    price: 7000,
    calories: 150,
    cookTime: 25,
    image: "https://picsum.photos/seed/sayurlodeh/400/300",
    isFavorite: false,
  },
];
