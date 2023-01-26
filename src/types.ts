
export enum PRODUCT_CATEGORY {
    ACCESSORIES = "Acessórios",
    CLOTHES_AND_SHOES = "Roupas e calçados",
    ELECTRONICS = "Eletrônicos"
  }

export type TUser = {
    id: string,
    name: string,
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
    id: string,
    paid: number,
    quantity: number,
    buyer_id: string,
    total_price: number
} 





