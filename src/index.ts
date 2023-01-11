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
import { TUser, TProduto, TPurchase } from "./types"
import express, { Request, Response } from 'express'
import cors from 'cors';
import { PRODUCT_CATEGORY } from "./types"

//configuração de servidor node com express
const app = express();
app.use(express.json());
app.use(cors());

//exercicio 1 API e Express

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong!')
})

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



// Exercicio 1 (fluxo de dados)
// Get All Users
// não precisa de validação, basta refatorar para o uso do try/catch

app.get('/users', (req: Request, res: Response) => {

    try {

        res.status(200).send(users)

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)

    }

})



// Exercicio 1 (fluxo de dados)
// Get All Products
// não precisa de validação, basta refatorar para o uso do try/catch


app.get('/products', (req: Request, res: Response) => {

    try {

        res.status(200).send(products)

    } catch (error: any) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)

    }

})




//Exercicio 2 API e Express



// Exercicio 1 (fluxo de dados)
// Search Product byname
// query params deve possuir pelo menos um caractere

app.get('/products/search', (req: Request, res: Response) => {

    try {
        const q = req.query.q as string
        const result = products.filter((product) => {
            return product.name.toLowerCase().includes(q.toLowerCase())
        })


        if (result !== undefined) {
            if (q.length < 1) {
                res.status(400)
                throw new Error("O nome deve ter no minimo 1 caracteres")
            }
        }

        if (result.length < 1) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }
        res.status(200).send(result)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }

})


//Exercicio 3 API e express

//Criar usuario


// Create User
// validar o body
// extra:
// não deve ser possível criar mais de uma conta com a mesma id
// não deve ser possível criar mais de uma conta com o mesmo e-mail

app.post('/users', (req: Request, res: Response) => {
    try {
        const { id, email, password } = req.body as TUser
        const newUser = {
            id,
            email,
            password
        }
        if (newUser.id.length < 1 || newUser.email.length < 1) {
            res.status(400)
            throw new Error("Email ou id faltando no cadastro")

        }
        if (newUser.password < 1) {
            res.status(400)
            throw new Error("Password faltando no cadastro")

        }
        const searchId = users.find((user) => {
            return user.id === newUser.id
        })
        const searchEmail = users.find((user) => {
            return user.email === newUser.email
        })
        if (searchId || searchEmail) {
            res.status(400)
            throw new Error("Email ou id ja cadastrado")
        }

        users.push(newUser)
        res.status(201).send('Usuario registrado com sucesso!')

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})


//Criar produtos

// Create Product
// validar o body
// extra:
// não deve ser possível criar mais de um produto com a mesma id

app.post('/products', (req: Request, res: Response) => {

    try {

        const { id, name, price, category } = req.body as TProduto
        const newProduct = {
            id,
            name,
            price,
            category
        }
        if (newProduct.id.length < 1 || newProduct.name.length < 1 || newProduct.category.length < 1) {
            res.status(400)
            throw new Error("Informações faltando no cadastro de produtos")
        }

        if (newProduct.price < 1) {
            res.status(400)
            throw new Error("Preço faltando no cadastro de produtos")
        }

        const searchIdProduct = products.find((product) => {
            return product.id === newProduct.id
        })

        if (searchIdProduct) {
            res.status(400)
            throw new Error("Id ja cadastrado")

        }

        products.push(newProduct)

        res.status(201).send('Produto registrado com sucesso!')

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

////Criar purchase

// Create Purchase
// validar o body
// extra:
// id do usuário que fez a compra deve existir no array de usuários cadastrados
// id do produto que foi comprado deve existir no array de produtos cadastrados
// a quantidade e o total da compra devem estar com o cálculo correto

app.post('/purchase', (req: Request, res: Response) => {

    try {

        const { userId, productId, quantity, totalPrice } = req.body as TPurchase
        const newPurchase = {
            userId,
            productId,
            quantity,
            totalPrice,
        }
        if (newPurchase.userId.length < 1 || newPurchase.productId.length < 1 || newPurchase.quantity < 1 ) {
            res.status(400)
            throw new Error("Informações incompletas")
        }
        const searchIdUser = users.find((idUser) => {
            return idUser.id === newPurchase.userId
        })
        const searchIdProduct = products.find((idProduct) => {
            return idProduct.id === newPurchase.productId
        })

        if (searchIdUser && searchIdProduct) {
            const total = searchIdProduct.price * newPurchase.quantity
            newPurchase.totalPrice = total
            purchase.push(newPurchase)
            res.status(201).send("Compra registrada com sucesso!")
        } if (!searchIdUser) {
            res.status(404).send("Usuario não existe")
        } else {
            res.status(404).send("Produto não existe no estoque")
        }

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }


})


//Aprofundamento express
//Exercicio 1 

//Get Product by id

app.get("/products/:id", (req: Request, res: Response) => {
    const id = req.params.id
    const result = products.find((product) => {
        return product.id === id
    })
    res.status(200).send(result)
})


//Get User Purchases by User id

app.get('/users/:id/purchases', (req: Request, res: Response) => {
    const id = req.params.id
    const getUserById = users.find((user) => user.id === id)
    if (getUserById) {
        const getPurchaseUserId = purchase.filter((p) => {
            return p.userId === getUserById.id
        })
        if (getPurchaseUserId) {
            res.status(200).send(getPurchaseUserId)
        }
    }
})


// Exercicio 2
//Delete user by id

app.delete("/users/:id", (req: Request, res: Response) => {

    const id = req.params.id as string
    const userById = users.findIndex((user) => {
        return user.id === id
    })
    console.log("Index: ", userById)

    if (userById >= 0) {
        users.splice(userById, 1)
        res.status(200).send("User apagado com sucesso")
    } else {
        res.status(404).send("Usuario não encontrado")
    }
})


//Delete product by id

app.delete("/products/:id", (req: Request, res: Response) => {

    const id = req.params.id as string
    const productById = products.findIndex((product) => {
        return product.id === id
    })
    console.log("Index: ", productById)

    if (productById >= 0) {
        products.splice(productById, 1)
        res.status(200).send("Produto apagado com sucesso")
    } else {
        res.status(404).send("Produto não encontrado")
    }
})



//Exercicio 3
//Editar user by id

app.put("/users/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newEmail = req.body.email as string | undefined
    const newPassword = req.body.password as number | undefined


    const user = users.find((user) => {
        return user.id === id
    })
    if (user) {
        user.id = newId || user.id
        user.email = newEmail || user.email
        user.password = isNaN(newPassword) ? user.password : newPassword


        res.status(200).send("Cadastro atualizado com sucesso")
    } else {
        res.status(404).send("Cadastro não encontrado")
    }
})


//Editar product by id


app.put("/products/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.name as string | undefined
    const newPrice = req.body.price as number | undefined
    const newCategory = req.body.category as PRODUCT_CATEGORY | undefined

    const product = products.find((product) => {
        return product.id === id
    })
    if (product) {
        product.id = newId || product.id
        product.name = newOwnerName || product.name
        product.price = isNaN(newPrice) ? product.price : newPrice
        product.category = newCategory || product.category

        res.status(200).send("Produto atualizado com sucesso")
    } else {
        res.status(404).send("Produto não encontrado")
    }
})