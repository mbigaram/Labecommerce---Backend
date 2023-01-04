import {
     users,
     products,
     purchase,
     getAllUsers,
     getAllProducts,
     createUser,
     createProduct,
     getProductById,
     queryProductsByName,
     createPurchase,
     getAllPurchasesFromUserId
    } from "./database"
import { PRODUCT_CATEGORY } from "./types"

// console.table(users)
// console.table(products)
// console.table(purchase)

console.table(createUser("u003", "beltrano@email.com", "beltrano99"))
console.table(getAllUsers())
console.table(createProduct("p004", "Monitor HD", 800, PRODUCT_CATEGORY.ELECTRONICS))
console.table(getAllProducts())
console.table(getProductById("p1"))


console.table(queryProductsByName("produto2"))
console.table(createPurchase("u003", "p004", 2, 1600))
console.table(getAllPurchasesFromUserId("u1"))

// console.table(getAllUsers(users, "u1"))
// console.table(getAllUsers())

// console.table(getAllProducts())

// console.log(getProductById("p1"))


