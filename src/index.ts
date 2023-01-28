
import { TUser, TProduct, TPurchase, TPurchasesProducts, TProductsInPurchase } from "./types"
import express, { Request, Response } from 'express'
import cors from 'cors';
import { PRODUCT_CATEGORY } from "./types"
import { db } from "./database/knex";


const app = express()

app.use(cors())//serviços q vão executar
app.use(express.json())//serviços q vão executar tanto entrada com saida,n precisa ficar convertedo entrada e saida

app.listen(3003, () => { //configuração da porta
    console.log(`Servidor rodando na porta ${3003}`)
})


// ... configurações do express

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//get all users
app.get("/users", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("users")
            res.status(200).send(result)
        } else {
            const result = await db("users").where("name", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//creat users
app.post("/users", async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error(" 'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error(" 'id' deve possuir pelo menos 4 caracters ")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error(" 'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error(" 'name' deve possuir pelo menos 2 caracters ")
        }
        if (typeof email !== "string") {
            res.status(400)
            throw new Error(" 'email' deve ser string")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,12}$/g)) {
            throw new Error("'password' deve possuir entre 8 e 12 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const [userIdAlreadyExists]: TUser[] | undefined[] = await db("users").where({ id })

        if (userIdAlreadyExists) {
            res.status(400)
            throw new Error("'Id' já existe")

        }
        const [userEmailAlreadyExists]: TUser[] | undefined[] = await db("users").where({ email })

        if (userEmailAlreadyExists) {
            res.status(400)
            throw new Error("'Email' já existe")
        }

        const newUser: TUser = {
            id,
            name,
            email,
            password
        }
        await db("users").insert(newUser)

        res.status(201).send({
            message: "User criado com sucesso",
            user: newUser
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//create products
app.post("/products", async (req: Request, res: Response) => {
    try {
        const { id, name, price, description, imagemUrl } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error(" 'id' deve ser string")
        }

        if (id.length < 4) {
            res.status(400)
            throw new Error(" 'id' deve possuir pelo menos 4 caracters ")
        }

        if (typeof name !== "string") {
            res.status(400)
            throw new Error(" 'name' deve ser string")
        }

        if (name.length < 2) {
            res.status(400)
            throw new Error(" 'name' deve possuir pelo menos 2 caracters ")
        }
        if (typeof price !== "number") {
            res.status(400)
            throw new Error(" 'price' deve ser number")
        }
        if (typeof description !== "string") {
            res.status(400)
            throw new Error(" 'description' deve ser string")
        }
        if (typeof imagemUrl !== "string") {
            res.status(400)
            throw new Error(" 'imagemUrl' deve ser string")
        }

        const [productIdAlreadyExists]: TProduct[] | undefined[] = await db("products").where({ id })

        if (productIdAlreadyExists) {
            res.status(400)
            throw new Error("'Id' já existe")

        }
        const [userNameAlreadyExists]: TProduct[] | undefined[] = await db("products").where({ name })

        if (userNameAlreadyExists) {
            res.status(400)
            throw new Error("'Name' já existe")
        }

        const newProduct: TProduct = {
            id,
            name,
            price,
            description,
            imagemUrl
        }
        await db("products").insert(newProduct)

        res.status(201).send({
            message: "Product criado com sucesso",
            user: newProduct
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//Get all products funcionalidade 1
//Retorna todos os produtos cadastrados.
//Get all products funcionalidade 2
//Caso seja enviada uma query params (q) deve ser retornado o resultado da busca de produtos por nome.

// Request

app.get("/products", async (req: Request, res: Response) => {
    try {
        const searchTerm = req.query.q as string | undefined

        if (searchTerm === undefined) {
            const result = await db("products")
            res.status(200).send(result)
        } else {
            const result = await db("products").where("name", "LIKE", `%${searchTerm}%`)
            res.status(200).send(result)
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

//editando product byid
app.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newName = req.body.name
        const newPrice = req.body.price
        const newDescription = req.body.description


        if (newId !== undefined) {
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error(" 'id' deve ser string")
            }

            if (newId.length < 4) {
                res.status(400)
                throw new Error(" 'id' deve possuir pelo menos 4 caracters ")
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error(" 'Name' deve ser string")
            }

            if (newName.length < 2) {
                res.status(400)
                throw new Error(" 'Name' deve possuir pelo menos caracters ")
            }
        }
        if (newPrice !== undefined) {
            if (typeof newPrice !== "number") {
                res.status(400)
                throw new Error(" 'Price' deve ser mnumber")
            }

            if (newPrice < 2) {
                res.status(400)
                throw new Error(" 'Price' deve possuir pelo menos 2 caracters ")
            }
        }

        if (newDescription !== undefined) {
            if (typeof newDescription !== "string") {
                res.status(400)
                throw new Error(" 'description' deve ser string")
            }
        }


        const [product]: TProduct[] | undefined[] = await db("products").where({ id: idToEdit })

        if (!product) {
            res.status(404)
            throw new Error("'Id' não encontrado")
        }

        const newProduct = {
            id: newId || product.id,
            name: newName || product.name,
            price: newPrice || product.price,
            description: newDescription || product.description
        }

        await db("products").update(newProduct).where({ id: idToEdit })


        res.status(200).send({
            message: "Produto editado com sucesso",
            product: newProduct
        })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

//Delete purchase by id
//Deleta um pedido existente.

app.delete("/purchases/:purchaseId", async (req: Request, res: Response) => {
    try {
        const purchaseIdToDelete = req.params.purchaseId

        const [purchase]: TPurchase[] | undefined[] = await db("purchases").where({ id: purchaseIdToDelete })

        if (!purchase) {
            res.status(400)
            throw new Error("'purchaseId' não encontrado")
        }

        
        await db("purchases").del().where({ id: purchaseIdToDelete })

        await db("purchases_products").del().where({ purchase_id: purchaseIdToDelete });


        res.status(200).send({ message: " Purchase removido da sucesso" })

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Create Purchase

////////////////////////////////////////////////////////////////////////////

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { id, total_price, paid, buyer_id, products, users } = req.body
        const [filterUser]: TUser[] | undefined[] = await db("users").where({ id: buyer_id })

        if (id !== undefined) {
            if (typeof id !== "string") {
                res.status(400);
                throw new Error("Id do usuário precisa ser uma string");
            }

        } else {
            res.status(400);
            throw new Error("Favor, inserir id de usuário.");
        }
        console.log(total_price)
        if (total_price !== undefined) {
            if (typeof total_price !== "number") {
                res.status(400);
                throw new Error("Valor de Preço Total inválido! Favor, informar um numero.");

            }

        } else {
            res.status(400);
            throw new Error("Valor final da compra não informado.");
        }

        if (paid !== undefined) {
            if (typeof paid !== "number") {
                res.status(400);
                throw new Error("Confirmação de compra inválido! Favor, informar um numero 0 ou 1.");
            }

        } else {
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

        } else {
            res.status(400);
            throw new Error("Valor final da compra não informado.");
        }

        if (products[0].id !== undefined) {
            if (typeof products[0].id !== "string") {
                res.status(400);
                throw new Error("'id' de produto inválido! Favor, informar uma string.");
            }

        } else {
            res.status(400);
            throw new Error("'id' de produto não informado.");
        }

        if (products[0].quantity !== undefined) {
            if (typeof products[0].quantity !== "number") {
                res.status(400);
                throw new Error("Quantidade de produtos inválido! Favor, informar um numero.");
            }

        } else {
            res.status(400);
            throw new Error("Quantidade não informada");
        }

        if (!filterUser) {
            res.status(400);
            throw new Error("Id de users não existe.");
        }

        const newPurchase: TPurchase = {
            id,
            total_price,
            paid,
            buyer_id
        }

        const newPurchasesProducts: TPurchasesProducts = {
            purchase_id: id,
            product_id: products[0].id,
            quantity: products[0].quantity,
        }

        await db("purchases").insert(newPurchase)
        await db("purchases_products").insert(newPurchasesProducts)

        ////////////////////

        const [searchIdUser]:TUser[] = await db("users").select("id")
        const [searchIdProduct]:TProduct[] = await db("products").select("id")
        const [searchQuantityPurchaseProduct]:TPurchasesProducts[] = await db("purchases_products").select("quantity")
        const [searchPriceProduct]:TProduct[] = await db("products").select("price")

        if (searchIdUser.id && searchIdProduct.id) {
            let total = searchPriceProduct.price * searchQuantityPurchaseProduct.quantity
            newPurchase.total_price = total
            console.log(searchIdProduct.price)
            console.log({total})
            console.log(searchQuantityPurchaseProduct.quantity)
        }  
/////////////////////////////////////////////////////////

        // const [searchUser]: TUser[] = await db("users").where("id", id).first()
        // const [searchProduct]: TProduct[] = await db("products").where("id", id).first()
        // const [searchQuantityPurchaseProduct]: TPurchasesProducts[] = await db("purchases_products").where("id", id).first()

        // if (searchUser && searchProduct && searchQuantityPurchaseProduct) {
        //     const total = searchProduct.price * searchQuantityPurchaseProduct.quantity
        //     newPurchase.total_price = total
        // }

        ////////////////////


        res.status(201).send({ message: "Compra realizada com sucesso", purchase: newPurchase });

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


//Get buscar compras
app.get('/purchases', async (req: Request, res: Response) => {
    try {
        const result = await db("purchases")

        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



//Get purchases by id
app.get('/purchases/:id', async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        const [purchase]: TPurchase[] = await db.select("purchases.*", "users.name", "users.email")
            .from("purchases")
            .leftJoin("users", "users.id", "=", "purchases.buyer_id")
            .where({ "purchases.id": id })

        const products = await db.select("products.*", "purchases_products.quantity")
            .from("purchases_products")
            .leftJoin("products", "purchases_products.product_id", "=", "products.id")
            .where({ "purchases_products.purchase_id": id })

        const productsInPurchase: TProductsInPurchase[] = [{ ...purchase, products: products }]

        res.status(200).send(productsInPurchase)


    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})