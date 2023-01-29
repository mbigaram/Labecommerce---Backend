
import { TUser, TProduct, TPurchase, TPurchasesProducts, TProductsInPurchase, TProductToBuy } from "./types"
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

//delete purchase by id
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


// create purchases
app.post('/purchases', async (req: Request, res: Response) => {
    try {
      const {id, buyer_id} = req.body as TPurchase
      const productsToBuy = req.body.products as TProductToBuy[]
      // console.log(productsToBuy)
      if( !id || !buyer_id){
        res.status(400)
        throw new Error("ERRO: purchaseId e buyerId são dados são obrigatórios.")
      }
  
      if(typeof id !== "string") {
        res.status(400)
        throw new Error("ERRO: PurchaseId deve ser do tipo string")
      }
      if(id[0] !== "p") {
        res.status(400)
        throw new Error("ERRO: PurchaseId deve iniciar com a letra 'c'")
      }
      if(id.length < 4){
        res.status(400)
        throw new Error("ERRO: PurchaseId deve ter pelo menos 4 caracteres")
      }
    
      const [foundPurchasetId] = await db('purchases').where({id: id})
      if(foundPurchasetId){
        res.status(404)
        throw new Error("ERRO: Este purchaseId já existe")
      }
  
          const [foundPurchasetBuyer] = await db('users').where({id: buyer_id})
      if(!foundPurchasetBuyer){
        res.status(404)
        throw new Error("ERRO: Este buyerId não está cadastrado")
      }
  
    for (const i in productsToBuy) {
      if(!productsToBuy[i].productId || typeof productsToBuy[i].productId !== "string" || productsToBuy[i].productId === ""){
        res.status(400)
        throw new Error("ERRO: Informe o productId em formato de string")
      }
      if( !productsToBuy[i].quantity || typeof productsToBuy[i].quantity !== "number" || productsToBuy[i].quantity < 1){
        res.status(400)
        throw new Error("ERRO: Informe a quantidade (número > 1) de todos os produtos")
      }
    }    

    for (const i in productsToBuy) {
      const [foundProducttId] = await db('products').where({id: productsToBuy[i].productId})
      if(!foundProducttId){
          res.status(404)
          throw new Error(`ERRO: O productId: ${productsToBuy[i].productId} não está cadastrado`)
      }else{
         
          const newPurchaseProduct = {
            purchase_id: id, 
            product_id: productsToBuy[i].productId,
            quantity: productsToBuy[i].quantity
          }
          await db("purchases_products").insert(newPurchaseProduct)
      }
        
        const sameProductsOnPurchase = productsToBuy.filter((product) => product.productId === productsToBuy[i].productId)
        console.log(sameProductsOnPurchase)
        let sumQuantity = 0
        for (const i of sameProductsOnPurchase) {
          
        }
    }      
      const purchaseInCart = await db("purchases_products").where({purchase_id: id})
      
      let totalPrice = 0
      const newPurchase = {
        id: purchaseInCart[0].purchase_id, 
        buyer_id: buyer_id,
        total_price: totalPrice
      }
      
      for (const i of purchaseInCart) {
        const [productInCart] = await db("products").where({id: i.product_id})
        totalPrice += i.quantity * productInCart.price
      }
      
      newPurchase.total_price = totalPrice 
      await db('purchases').insert(newPurchase)
  
      const [createdPurchase] = await db("purchases").where({id: id})
  
      let buyedProducts: {}[] = []
      for (const i of purchaseInCart) {
        const [productInCart] = await db("products").where({id: i.product_id})
        buyedProducts.push({
          name: productInCart.name,
          price: productInCart.price,
          quantity: i.quantity
        })
      }
  
      const stylizedPurchase = {
        purchaseId: createdPurchase.id,
        buyerId: createdPurchase.buyer_id,
        createdAt: createdPurchase.created_at,
        totalPrice: createdPurchase.total_price,
        paid: createdPurchase.paid,
        products: buyedProducts
      }
  
      buyedProducts = []
  
      res.status(201).send({
        message: "Compra cadastrada com sucesso",
        user: stylizedPurchase
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



//get purchases by id
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