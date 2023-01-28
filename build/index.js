"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./database/knex");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});
app.get("/ping", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send({ message: "Pong!" });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.q;
        if (searchTerm === undefined) {
            const result = yield (0, knex_1.db)("users");
            res.status(200).send(result);
        }
        else {
            const result = yield (0, knex_1.db)("users").where("name", "LIKE", `%${searchTerm}%`);
            res.status(200).send(result);
        }
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, password } = req.body;
        if (typeof id !== "string") {
            res.status(400);
            throw new Error(" 'id' deve ser string");
        }
        if (id.length < 4) {
            res.status(400);
            throw new Error(" 'id' deve possuir pelo menos 4 caracters ");
        }
        if (typeof name !== "string") {
            res.status(400);
            throw new Error(" 'name' deve ser string");
        }
        if (name.length < 2) {
            res.status(400);
            throw new Error(" 'name' deve possuir pelo menos 2 caracters ");
        }
        if (typeof email !== "string") {
            res.status(400);
            throw new Error(" 'email' deve ser string");
        }
        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial");
        }
        const [userIdAlreadyExists] = yield (0, knex_1.db)("users").where({ id });
        if (userIdAlreadyExists) {
            res.status(400);
            throw new Error("'Id' já existe");
        }
        const [userEmailAlreadyExists] = yield (0, knex_1.db)("users").where({ email });
        if (userEmailAlreadyExists) {
            res.status(400);
            throw new Error("'Email' já existe");
        }
        const newUser = {
            id,
            name,
            email,
            password
        };
        yield (0, knex_1.db)("users").insert(newUser);
        res.status(201).send({
            message: "User criado com sucesso",
            user: newUser
        });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, price, description, imagemUrl } = req.body;
        if (typeof id !== "string") {
            res.status(400);
            throw new Error(" 'id' deve ser string");
        }
        if (id.length < 4) {
            res.status(400);
            throw new Error(" 'id' deve possuir pelo menos 4 caracters ");
        }
        if (typeof name !== "string") {
            res.status(400);
            throw new Error(" 'name' deve ser string");
        }
        if (name.length < 2) {
            res.status(400);
            throw new Error(" 'name' deve possuir pelo menos 2 caracters ");
        }
        if (typeof price !== "number") {
            res.status(400);
            throw new Error(" 'price' deve ser number");
        }
        if (typeof description !== "string") {
            res.status(400);
            throw new Error(" 'description' deve ser string");
        }
        if (typeof imagemUrl !== "string") {
            res.status(400);
            throw new Error(" 'imagemUrl' deve ser string");
        }
        const [productIdAlreadyExists] = yield (0, knex_1.db)("products").where({ id });
        if (productIdAlreadyExists) {
            res.status(400);
            throw new Error("'Id' já existe");
        }
        const [userNameAlreadyExists] = yield (0, knex_1.db)("products").where({ name });
        if (userNameAlreadyExists) {
            res.status(400);
            throw new Error("'Name' já existe");
        }
        const newProduct = {
            id,
            name,
            price,
            description,
            imagemUrl
        };
        yield (0, knex_1.db)("products").insert(newProduct);
        res.status(201).send({
            message: "Product criado com sucesso",
            user: newProduct
        });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.q;
        if (searchTerm === undefined) {
            const result = yield (0, knex_1.db)("products");
            res.status(200).send(result);
        }
        else {
            const result = yield (0, knex_1.db)("products").where("name", "LIKE", `%${searchTerm}%`);
            res.status(200).send(result);
        }
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.put("/products/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idToEdit = req.params.id;
        const newId = req.body.id;
        const newName = req.body.name;
        const newPrice = req.body.price;
        const newDescription = req.body.description;
        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400);
                throw new Error(" 'id' deve ser string");
            }
            if (newId.length < 4) {
                res.status(400);
                throw new Error(" 'id' deve possuir pelo menos 4 caracters ");
            }
        }
        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400);
                throw new Error(" 'Name' deve ser string");
            }
            if (newName.length < 2) {
                res.status(400);
                throw new Error(" 'Name' deve possuir pelo menos caracters ");
            }
        }
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                res.status(400);
                throw new Error(" 'Price' deve ser mnumber");
            }
            if (newPrice < 2) {
                res.status(400);
                throw new Error(" 'Price' deve possuir pelo menos 2 caracters ");
            }
        }
        if (newDescription !== undefined) {
            if (typeof newDescription !== "string") {
                res.status(400);
                throw new Error(" 'description' deve ser string");
            }
        }
        const [product] = yield (0, knex_1.db)("products").where({ id: idToEdit });
        if (!product) {
            res.status(404);
            throw new Error("'Id' não encontrado");
        }
        const newProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description
        };
        yield (0, knex_1.db)("products").update(newProduct).where({ id: idToEdit });
        res.status(200).send({
            message: "Produto editado com sucesso",
            product: newProduct
        });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete("/purchases/:purchaseId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchaseIdToDelete = req.params.purchaseId;
        const [purchase] = yield (0, knex_1.db)("purchases").where({ id: purchaseIdToDelete });
        if (!purchase) {
            res.status(400);
            throw new Error("'purchaseId' não encontrado");
        }
        yield (0, knex_1.db)("purchases").del().where({ id: purchaseIdToDelete });
        res.status(200).send({ message: " Purchase removido da sucesso" });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post('/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, total_price, paid, buyer_id, products, users } = req.body;
        const [filterUser] = yield (0, knex_1.db)("users").where({ id: buyer_id });
        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("Id do usuário precisa ser uma string");
            }
        }
        else {
            res.status(400);
            throw new Error("Favor, inserir id de usuário.");
        }
        console.log(total_price);
        if (total_price !== undefined) {
            if (typeof total_price !== "number") {
                res.status(400);
                throw new Error("Valor de Preço Total inválido! Favor, informar um numero.");
            }
        }
        else {
            res.status(400);
            throw new Error("Valor final da compra não informado.");
        }
        if (paid !== undefined) {
            if (typeof paid !== "number") {
                res.status(400);
                throw new Error("Confirmação de compra inválido! Favor, informar um numero 0 ou 1.");
            }
        }
        else {
            res.status(400);
            throw new Error("Confirmação de compra não informado.");
        }
        if (buyer_id === undefined) {
            res.status(400);
            throw new Error("Id de cliente não informado.");
        }
        if (total_price !== undefined) {
            if (typeof total_price !== "number") {
                res.status(400);
                throw new Error("Valor de Preço Total inválido! Favor, informar um numero.");
            }
        }
        else {
            res.status(400);
            throw new Error("Valor final da compra não informado.");
        }
        if (products[0].id !== undefined) {
            if (typeof products[0].id !== "string") {
                res.status(400);
                throw new Error("'id' de produto inválido! Favor, informar uma string.");
            }
        }
        else {
            res.status(400);
            throw new Error("'id' de produto não informado.");
        }
        if (products[0].quantity !== undefined) {
            if (typeof products[0].quantity !== "number") {
                res.status(400);
                throw new Error("Quantidade de produtos inválido! Favor, informar um numero.");
            }
        }
        else {
            res.status(400);
            throw new Error("Quantidade não informada");
        }
        if (!filterUser) {
            res.status(400);
            throw new Error("Id de users não existe.");
        }
        const newPurchase = {
            id,
            total_price,
            paid,
            buyer_id
        };
        const newPurchasesProducts = {
            purchase_id: id,
            product_id: products[0].id,
            quantity: products[0].quantity,
        };
        yield (0, knex_1.db)("purchases").insert(newPurchase);
        yield (0, knex_1.db)("purchases_products").insert(newPurchasesProducts);
        const [searchIdUser] = yield (0, knex_1.db)("users").select("id");
        const [searchIdProduct] = yield (0, knex_1.db)("products").select("id");
        const [searchQuantityPurchaseProduct] = yield (0, knex_1.db)("purchases_products").select("quantity");
        console.log(searchQuantityPurchaseProduct);
        if (searchIdUser.id && searchIdProduct.id) {
            const total = searchIdProduct.price * searchQuantityPurchaseProduct.quantity;
            newPurchase.total_price = total;
        }
        res.status(201).send({ message: "Compra realizada com sucesso", purchase: newPurchase });
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/purchases', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, knex_1.db)("purchases");
        res.status(200).send(result);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get('/purchases/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const [purchase] = yield knex_1.db.select("purchases.*", "users.name", "users.email")
            .from("purchases")
            .leftJoin("users", "users.id", "=", "purchases.buyer_id")
            .where({ "purchases.id": id });
        const products = yield knex_1.db.select("products.*", "purchases_products.quantity")
            .from("purchases_products")
            .leftJoin("products", "purchases_products.product_id", "=", "products.id")
            .where({ "purchases_products.purchase_id": id });
        const productsInPurchase = [Object.assign(Object.assign({}, purchase), { products: products })];
        res.status(200).send(productsInPurchase);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
//# sourceMappingURL=index.js.map