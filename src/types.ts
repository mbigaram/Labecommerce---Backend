
export enum PRODUCT_CATEGORY {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
  }

export type TUser = {
    id: string,
    email: string,
    password: string | number,
  }

export type TProduto = {
    id: string,
    name: string
    price: number
    category: string,
} 

export type TPurchase = {
    userId: string,
    productId: string,
    quantity: number,
    totalPrice: number
} 





