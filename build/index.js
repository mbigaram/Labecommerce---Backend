"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const types_1 = require("./types");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get('/ping', (req, res) => {
    res.send('Pong!');
});
console.table((0, database_1.createUser)("u003", "beltrano@email.com", "beltrano99"));
console.table((0, database_1.getAllUsers)());
console.table((0, database_1.createProduct)("p004", "Monitor HD", 800, types_1.PRODUCT_CATEGORY.ELECTRONICS));
console.table((0, database_1.getAllProducts)());
console.table((0, database_1.getProductById)("p1"));
console.table((0, database_1.queryProductsByName)("produto2"));
console.table((0, database_1.createPurchase)("u003", "p004", 2, 1600));
console.table((0, database_1.getAllPurchasesFromUserId)("u1"));
app.get('/users', (req, res) => {
    try {
        res.status(200).send(database_1.users);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.get('/products', (req, res) => {
    try {
        res.status(200).send(database_1.products);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.get('/products/search', (req, res) => {
    try {
        const q = req.query.q;
        const result = database_1.products.filter((product) => {
            return product.name.toLowerCase().includes(q.toLowerCase());
        });
        if (result !== undefined) {
            if (q.length < 1) {
                res.status(400);
                throw new Error("O nome deve ter no minimo 1 caracteres");
            }
        }
        if (result.length < 1) {
            res.status(404);
            throw new Error("Produto não encontrado");
        }
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.post('/users', (req, res) => {
    try {
        const { id, email, password } = req.body;
        const newUser = {
            id,
            email,
            password
        };
        if (newUser.id.length < 1 || newUser.email.length < 1) {
            res.status(400);
            throw new Error("Email ou id faltando no cadastro");
        }
        if (newUser.password < 1) {
            res.status(400);
            throw new Error("Password faltando no cadastro");
        }
        const searchId = database_1.users.find((user) => {
            return user.id === newUser.id;
        });
        const searchEmail = database_1.users.find((user) => {
            return user.email === newUser.email;
        });
        if (searchId || searchEmail) {
            res.status(400);
            throw new Error("Email ou id ja cadastrado");
        }
        database_1.users.push(newUser);
        res.status(201).send('Usuario registrado com sucesso!');
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.post('/products', (req, res) => {
    try {
        const { id, name, price, category } = req.body;
        const newProduct = {
            id,
            name,
            price,
            category
        };
        if (newProduct.id.length < 1 || newProduct.name.length < 1 || newProduct.category.length < 1) {
            res.status(400);
            throw new Error("Informações faltando no cadastro de produtos");
        }
        if (newProduct.price < 1) {
            res.status(400);
            throw new Error("Preço faltando no cadastro de produtos");
        }
        const searchIdProduct = database_1.products.find((product) => {
            return product.id === newProduct.id;
        });
        if (searchIdProduct) {
            res.status(400);
            throw new Error("Id ja cadastrado");
        }
        database_1.products.push(newProduct);
        res.status(201).send('Produto registrado com sucesso!');
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.post('/purchase', (req, res) => {
    try {
        const { userId, productId, quantity, totalPrice } = req.body;
        const newPurchase = {
            userId,
            productId,
            quantity,
            totalPrice,
        };
        if (newPurchase.userId.length < 1 || newPurchase.productId.length < 1 || newPurchase.quantity < 1) {
            res.status(400);
            throw new Error("Informações incompletas");
        }
        const searchIdUser = database_1.users.find((idUser) => {
            return idUser.id === newPurchase.userId;
        });
        const searchIdProduct = database_1.products.find((idProduct) => {
            return idProduct.id === newPurchase.productId;
        });
        if (searchIdUser && searchIdProduct) {
            const total = searchIdProduct.price * newPurchase.quantity;
            newPurchase.totalPrice = total;
            database_1.purchase.push(newPurchase);
            res.status(201).send("Compra registrada com sucesso!");
        }
        if (!searchIdUser) {
            res.status(404).send("Usuario não existe");
        }
        else {
            res.status(404).send("Produto não existe no estoque");
        }
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
app.get("/products/:id", (req, res) => {
    const id = req.params.id;
    const result = database_1.products.find((product) => {
        return product.id === id;
    });
    res.status(200).send(result);
});
app.get('/users/:id/purchases', (req, res) => {
    const id = req.params.id;
    const getUserById = database_1.users.find((user) => user.id === id);
    if (getUserById) {
        const getPurchaseUserId = database_1.purchase.filter((p) => {
            return p.userId === getUserById.id;
        });
        if (getPurchaseUserId) {
            res.status(200).send(getPurchaseUserId);
        }
    }
});
app.delete("/users/:id", (req, res) => {
    const id = req.params.id;
    const userById = database_1.users.findIndex((user) => {
        return user.id === id;
    });
    console.log("Index: ", userById);
    if (userById >= 0) {
        database_1.users.splice(userById, 1);
        res.status(200).send("User apagado com sucesso");
    }
    else {
        res.status(404).send("Usuario não encontrado");
    }
});
app.delete("/products/:id", (req, res) => {
    const id = req.params.id;
    const productById = database_1.products.findIndex((product) => {
        return product.id === id;
    });
    console.log("Index: ", productById);
    if (productById >= 0) {
        database_1.products.splice(productById, 1);
        res.status(200).send("Produto apagado com sucesso");
    }
    else {
        res.status(404).send("Produto não encontrado");
    }
});
app.put("/users/:id", (req, res) => {
    const id = req.params.id;
    const newId = req.body.id;
    const newEmail = req.body.email;
    const newPassword = req.body.password;
    const user = database_1.users.find((user) => {
        return user.id === id;
    });
    if (user) {
        user.id = newId || user.id;
        user.email = newEmail || user.email;
        user.password = isNaN(newPassword) ? user.password : newPassword;
        res.status(200).send("Cadastro atualizado com sucesso");
    }
    else {
        res.status(404).send("Cadastro não encontrado");
    }
});
app.put("/products/:id", (req, res) => {
    const id = req.params.id;
    const newId = req.body.id;
    const newOwnerName = req.body.name;
    const newPrice = req.body.price;
    const newCategory = req.body.category;
    const product = database_1.products.find((product) => {
        return product.id === id;
    });
    if (product) {
        product.id = newId || product.id;
        product.name = newOwnerName || product.name;
        product.price = isNaN(newPrice) ? product.price : newPrice;
        product.category = newCategory || product.category;
        res.status(200).send("Produto atualizado com sucesso");
    }
    else {
        res.status(404).send("Produto não encontrado");
    }
});
//# sourceMappingURL=index.js.map