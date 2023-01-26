import {
  TUser,
  TProduto,
  TPurchase,
  PRODUCT_CATEGORY
} from "./types"

export const users: TUser[] = [
  {
    id: "u1",
    name: "Um",
    email: "u1@guser.com",
    password: "1u"
  },
  {
    id: "u2",
    name: "Dois",
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
  // {
  //   userId: "u1",
  //   productId: "p1",
  //   quantity: 1,
  //   totalPrice: 1
  // },
  // {
  //   userId: "u2",
  //   productId: "p2",
  //   quantity: 1,
  //   totalPrice: 2
  // }
]

export function createUser(id: string, name: string, email: string, password: string): TUser[] {
  const userToAdd = {
    id: id,
    name: name,
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

// export function createPurchase(id: string, purchased_product_id: string, created_at: number, paid: number, quantity: number, buyer_id: string, total_price: number,): TPurchase[] {
//   const purchaseToAdd = {
//     id,
//     purchased_product_id,
//     created_at,
//     paid,
//     quantity,
//     buyer_id,
//     total_price,
//   }
  
// }

export function getAllPurchasesFromUserId(userIdToSearch: string): TPurchase[] | undefined {
  return purchase.filter((purchase) => {
    if (purchase.id === userIdToSearch) {
      return purchase
    }
  })
}