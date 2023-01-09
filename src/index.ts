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
import express, { Request, Response} from 'express'  
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


app.get('/users', (req: Request, res: Response)=>{
    res.status(200).send(users)
})

app.get('/products', (req: Request, res: Response)=>{
    res.status(200).send(products)
})

//Exercicio 2 API e Express

app.get('/products/search', (req: Request, res: Response) =>{
    const q = req.query.q as string

    const result = products.filter((product)=>{
       return product.name.toLowerCase().includes(q.toLowerCase())
    })

    res.status(200).send(result)
})

//Exercicio 3 API e express

//Criar usuario

app.post('/users', (req: Request, res: Response) => {

    const {id, email, password} = req.body as TUser

    const newUser = {
        id,
        email,
        password
    }

   users.push(newUser)

    res.status(201).send('Usuario registrado com sucesso!')
})

//Criar produtos

app.post('/products', (req: Request, res: Response) => {

    const {id, name, price, category} = req.body as TProduto

    const newProduct = {
        id,
        name,
        price,
        category
    }

   products.push(newProduct)

    res.status(201).send('Produto registrado com sucesso!')
})

////Criar purchase

app.post('/purchase', (req: Request, res: Response) => {

    const {userId, productId, quantity, totalPrice} = req.body as TPurchase

    const newPurchase = {
        userId,
        productId,
        quantity,
        totalPrice,
    }

   purchase.push(newPurchase)

    res.status(201).send('Compra registrada com sucesso!')
})







