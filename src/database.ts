import {
  TUser,
  TProduto,
  TPurchase,
  PRODUCT_CATEGORY
} from "./types"

export const users: TUser[] = [
  {
    id: "u1",
    email: "u1@guser.com",
    password: "1u"
  },
  {
    id: "u2",
    email: "u2@guser.com",
    password: "2u"
  }
]

export const products: TProduto[] = [
  {
    id: "p1",
    name: "produto1",
    price: 1,
    category: PRODUCT_CATEGORY.ACCESSORIES,
  },
  {
    id: "p2",
    name: "produto2",
    price: 2,
    category: PRODUCT_CATEGORY.CLOTHES_AND_SHOES,
  }
]

export const purchase: TPurchase[] = [
  {
    userId: "u1",
    productId: "p1",
    quantity: 1,
    totalPrice: 1
  },
  {
    userId: "u2",
    productId: "p2",
    quantity: 1,
    totalPrice: 2
  }
]

export function createUser(id: string, email: string, password: string): TUser[] {
  const userToAdd = {
    id: id,
    email: email,
    password: password
  }
  const newUser = [...users, userToAdd]
  console.log("Cadastro realizado com sucesso")
  return newUser
}

export function getAllUsers(): TUser[] {
  return users
}




export function createProduct(id: string, name: string, price: number, category: PRODUCT_CATEGORY): TProduto[] {
  const productToAdd = {
    id,
    name,
    price,
    category
  }
  const newProduct = [...products, productToAdd]
  console.log("Produto criado com sucesso")
  return newProduct
}

export function getAllProducts(): TProduto[] {
  return products
}



export function getProductById(idToSearch: string): TProduto[] | undefined {
  return products.filter((products) => {
    if (products.id === idToSearch) {
      return products
    }
  })
}


export function queryProductsByName (q: string): TProduto[] | undefined {
  return products.filter((products) => {
    if (products.name === q) {
      return products

    }
  })
}

export function createPurchase(userId: string, productId: string, quantity: number, totalPrice: number): TPurchase[] {
  const purchaseToAdd = {
    userId,
    productId,
    quantity,
    totalPrice
  }
  const newPurchase = [...purchase, purchaseToAdd]
  console.log("Compra realizada com sucesso")
  return newPurchase
}

export function getAllPurchasesFromUserId(userIdToSearch: string): TPurchase[] | undefined {
  return purchase.filter((purchase) => {
    if (purchase.userId === userIdToSearch) {
      return purchase
    }
  })
}