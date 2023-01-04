"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPurchasesFromUserId = exports.createPurchase = exports.queryProductsByName = exports.getProductById = exports.getAllProducts = exports.createProduct = exports.getAllUsers = exports.createUser = exports.purchase = exports.products = exports.users = void 0;
const types_1 = require("./types");
exports.users = [
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
];
exports.products = [
    {
        id: "p1",
        name: "produto1",
        price: 1,
        category: types_1.PRODUCT_CATEGORY.ACCESSORIES,
    },
    {
        id: "p2",
        name: "produto2",
        price: 2,
        category: types_1.PRODUCT_CATEGORY.CLOTHES_AND_SHOES,
    }
];
exports.purchase = [
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
];
function createUser(id, email, password) {
    const userToAdd = {
        id: id,
        email: email,
        password: password
    };
    const newUser = [...exports.users, userToAdd];
    console.log("Cadastro realizado com sucesso");
    return newUser;
}
exports.createUser = createUser;
function getAllUsers() {
    return exports.users;
}
exports.getAllUsers = getAllUsers;
function createProduct(id, name, price, category) {
    const productToAdd = {
        id,
        name,
        price,
        category
    };
    const newProduct = [...exports.products, productToAdd];
    console.log("Produto criado com sucesso");
    return newProduct;
}
exports.createProduct = createProduct;
function getAllProducts() {
    return exports.products;
}
exports.getAllProducts = getAllProducts;
function getProductById(idToSearch) {
    return exports.products.filter((products) => {
        if (products.id === idToSearch) {
            return products;
        }
    });
}
exports.getProductById = getProductById;
function queryProductsByName(q) {
    return exports.products.filter((products) => {
        if (products.name === q) {
            return products;
        }
    });
}
exports.queryProductsByName = queryProductsByName;
function createPurchase(userId, productId, quantity, totalPrice) {
    const purchaseToAdd = {
        userId,
        productId,
        quantity,
        totalPrice
    };
    const newPurchase = [...exports.purchase, purchaseToAdd];
    console.log("Compra realizada com sucesso");
    return newPurchase;
}
exports.createPurchase = createPurchase;
function getAllPurchasesFromUserId(userIdToSearch) {
    return exports.purchase.filter((purchase) => {
        if (purchase.userId === userIdToSearch) {
            return purchase;
        }
    });
}
exports.getAllPurchasesFromUserId = getAllPurchasesFromUserId;
//# sourceMappingURL=database.js.map