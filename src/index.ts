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
    getAllPurchasesFromUserId
} from "./database"
import { TUser, TProduto, TPurchase } from "./types"
import express, { Request, Response } from 'express'
import cors from 'cors';
import { PRODUCT_CATEGORY } from "./types"
import { db } from "./database/knex";

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

// Exercicio 1 (fluxo de dados)
// Get All Users
// não precisa de validação, basta refatorar para o uso do try/catch

app.get('/users', async (req: Request, res: Response) => {

    try {

        const result = await db.raw(`SELECT * FROM users`)


        res.status(200).send(result)

    } catch (error: any) {
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



// Exercicio 1 (fluxo de dados)
// Get All Products
// não precisa de validação, basta refatorar para o uso do try/catch


app.get('/products', async (req: Request, res: Response) => {

    try {

        const result = await db.raw(`SELECT * FROM products`)

        res.status(200).send(result)

    } catch (error: any) {
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




//Exercicio 2 API e Express



// Exercicio 1 (fluxo de dados)
// Search Product byname
// query params deve possuir pelo menos um caractere

app.get('/products/search', async (req: Request, res: Response) => {

    try {

        //const q = req.query.q as string
        const name = req.query.name

        const result = await db.raw(`
        SELECT * FROM products 
        WHERE name = "${name}";`)


        if (name !== undefined) {
            if (name.length < 1) {
                res.status(400)
                throw new Error("O nome deve ter no minimo 1 caracteres")
            }
        }

        if (result < 1) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }
        res.status(200).send(result)

    } catch (error: any) {
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


//Exercicio 3 API e express

//Criar usuario


// Create User
// validar o body
// extra:
// não deve ser possível criar mais de uma conta com a mesma id
// não deve ser possível criar mais de uma conta com o mesmo e-mail

app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password } = req.body as TUser
        const newUser = {
            id,
            name,
            email,
            password
        }
        
        if (newUser !== undefined) {
            if (typeof newUser.id !== "string") {
                res.status(400)
                throw new Error(" 'id' deve ser string")
            }
        }

        if (newUser !== undefined) {
            if (typeof newUser.name !== "string") {
                res.status(400)
                throw new Error(" 'name' deve ser string")
            }
        }

        if (newUser !== undefined) {
            if (typeof newUser.email !== "string") {
                res.status(400)
                throw new Error(" 'email' deve ser string")
            }
        }
        
        if (newUser !== undefined) {
            if (typeof newUser.password !== "string") {
                res.status(400)
                throw new Error(" 'password' deve ser string")
            }
        }
        

        if (newUser !== undefined) {
            if (!newUser.name || !newUser.password) {
                res.status(400)
                throw new Error("Nome ou Senha faltando ")
            }
        }

        if (newUser !== undefined) {
            if (!newUser.id || !newUser.email) {
                res.status(400)
                throw new Error("Id ou Email faltando no cadastro")
            }
        }

        //     const [ userId ] = await db.raw(`
        //     SELECT * FROM users
        //     WHERE id = ("${id}")

        // `)

        const [userId] = await db("users").where({ id: id })

        if (userId) {
            res.status(404)
            throw new Error("Id ja cadastrado")
        }

        // const [ userEmail ] = await db.raw(`
        //     SELECT * FROM users
        //     WHERE email = ("${email}")

        // `)

        const [userEmail] = await db("users").where({ email: email })


        if (userEmail) {
            res.status(404)
            throw new Error("Email ja cadastrado")
        }

        // await db.raw(`
        //     INSERT INTO users (id, name, email, password)
        //     VALUES ("${id}", "${name}", "${email}", "${password}")
        // `)

        await db("users").insert({ id, name, email, password })

        res.status(201).send('Usuario registrado com sucesso!')

    } catch (error: any) {
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






//Criar produtos

// Create Product
// validar o body
// extra:
// não deve ser possível criar mais de um produto com a mesma id

app.post('/products', async (req: Request, res: Response) => {

    try {

        const { id, name, price, category } = req.body as TProduto
        const newProduct = {
            id,
            name,
            price,
            category
        }
        if (newProduct !== undefined) {
            if (!newProduct.id || !newProduct.name || !newProduct.category) {
                res.status(400)
                throw new Error("Informações faltando no cadastro de produtos")
            }

            if (newProduct.price < 1) {
                res.status(400)
                throw new Error("Preço faltando no cadastro de produtos")
            }
        }

        const [searchId] = await db.raw(`
					SELECT * FROM products
					WHERE id = "${id}";
				`)

        if (searchId) {
            res.status(404)
            throw new Error("Id ja cadastrado")
        }


        await db.raw(`
            INSERT INTO products (id, name, price, category)
            VALUES ("${id}", "${name}", "${price}", "${category}")
        `)

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



// app.post('/purchases', async (req: Request, res: Response) => {
//     try {
//         let { buyer_id, quantity, products } = req.body;      

//         // Verify that the buyer_id exists in the users table
//         const user = await db.select().from('users').where('id', buyer_id).first();
//         if (!user) {
//             res.status(400);
//             throw new Error("Usuário não encontrado");
//         }

//         //Verify that the product exists in the products table
//         const product = await db.select().from('products').where('id', products.id).first();
//         if (!product) {
//             res.status(400);
//             throw new Error("Produto não encontrado");
//         }

//         // calculate the total_price by multiplying quantity and price
//         const total_price = quantity * product.price;

//         // Insert the purchase into the purchases table
//         await db.insert({
//             buyer_id,
//             quantity,
//             total_price,
//             product_id: products.id
//         }).into('purchases');

//         res.status(201).send("Compra registrada com sucesso!");

//     } catch (error) {
//         console.log(error);

//         if (res.statusCode === 200) {
//             res.status(500);
//         }
//         res.send(error.message);
//     }
// });

app.post('/purchases', async (req: Request, res: Response) => {
    try {
        let { id, buyer_id, quantity, total_price, products, users} = req.body;      
        const userId = await db.raw(
            `SELECT * FROM users 
             WHERE id = "${id}";
        `);
        if (!userId || !id || !quantity ) {
            res.status(400);
            throw new Error("Informações incompletas");
        }

        const [purchaseExist] = await db.raw(`
					SELECT * FROM purchases
					WHERE id = "${id}";
				`)

        if (purchaseExist) {
            res.status(404)
            throw new Error("Compra ja existe!")
        }

        const product_price = await db.raw(
            `SELECT * FROM products`);

        total_price = product_price * quantity

        await db.raw(
            `INSERT INTO purchases (id, buyer_id, quantity, total_price) VALUES ("${id}", "${buyer_id}", "${quantity}", "${total_price}")
        `);

        res.status(201).send("Compra registrada com sucesso!");

    } catch (error: any) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});


        // const products_quantity = await db.raw(
        //     `SELECT * FROM purchases
        //      WHERE quantity = "${quantity}";
        // `);
 
        // const products_id = await db.raw(
        //     `SELECT * FROM products
        //      WHERE id = "${id}";
        // `);



        // const products_price = await db.raw(
        //     `SELECT * FROM products
        //      WHERE price = "${products.price}";
        // `);
        
        // total_price = products_price * quantity;




        // Verifica se o usuário existe

        // if (userResult !== userId) {
        //     res.status(404);
        //     throw new Error("Usuário não existe");
        // }
        
        // Verifica se o produto existe
        
        // if (!productResult) {
        //     res.status(404);
        //     throw new Error("Produto não existe no estoque");
        // }
        
        // Calcula o preço total












// app.post('/purchase', (req: Request, res: Response) => {

//     try {

//         const { id, total_price, paid, quantity, buyer_id,  } = req.body 
        
//         const newPurchase = {
//             id,
//             paid,
//             quantity,
//             buyer_id,
//             total_price,
//         }
//         if (newPurchase.buyer_id.length < 1 || newPurchase.id.length < 1 || newPurchase.quantity < 1) {
//             res.status(400)
//             throw new Error("Informações incompletas")
//         }

//         const searchIdUser = users.find((idUser) => {
//             return idUser.id === newPurchase.buyer_id
//         })
//         const searchIdProduct = products.find((idProduct) => {
//             return idProduct.id === newPurchase.id
//         })

//         if (searchIdUser && searchIdProduct) {
//             let total = searchIdProduct.price * newPurchase.quantity
//             newPurchase.total_price = total
//             purchase.push(newPurchase)
//             res.status(201).send("Compra registrada com sucesso!")

//         } if (!searchIdUser) {
//             res.status(404).send("Usuario não existe")
//         } else {
//             res.status(404).send("Produto não existe no estoque")
//         }

//     } catch (error: any) {
//         console.log(error)

//         if (res.statusCode === 200) {
//             res.status(500)
//         }
//         res.send(error.message)
//     }


// })


//Aprofundamento express
//Exercicio 1 


//Fluxo de Dados
//Exercicio 2
// Get Products by id
// validar que o produto existe 

//Get Product by id

app.get("/products/:id", (req: Request, res: Response) => {

    try {
        const id = req.params.id // sempre string, então não precisa validar o tipo
        const product = products.find((product) => product.id === id)

        if (!product) {
            res.status(404)
            throw new Error("Produto não encontrado")
        }

        res.status(200).send(product)

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }
})



// Get User Purchases by User id

// Get User Purchases by User id
// validar que o produto existe   ???????produto???????

app.get('/users/:id/purchases', (req: Request, res: Response) => {

    try {
        const id = req.params.id
        const idUser = users.find((user) => user.id === id)

        if (!idUser) {
            res.status(404)
            throw new Error("Usuario não existe")
        }
        const PurchaseidUser = purchase.filter((p) => {
            return p.id === idUser.id
        })
        if (!PurchaseidUser[0]) {
            res.status(201).send("Usuario não realizou nenhuma compra")
        } else {
            res.status(200).send(PurchaseidUser)
        }

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }

})


// Exercicio 2
//Delete user by id

// Fluxo de dados
// Delete User by id
// validar que o usuário existe


app.delete("/users/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id




        const [user] = await db("users").where({ id: id })

        // if (user!== undefined) {
        // if(user < 1){
        //     res.status(400)
        //     throw new Error("É necessário informar o id")
        // }}

        if (!user) {
            res.status(404)
            throw new Error(" 'Id' não encontrada")
        }
        await db("users").del().where({ id: id })

        res.status(200).send("Usuário deletado com sucesso!")

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

// app.delete("/users/:id", (req: Request, res: Response) => {

//     try {

//         const id = req.params.id as string
//         const userById = users.findIndex((user) => {
//             return user.id === id
//         })
//         console.log("Index: ", userById)

//         if (userById >= 0) {
//             users.splice(userById, 1)
//             res.status(200).send("Usuario apagado com sucesso")
//         } else {
//             res.status(404).send("Usuario não existe")
//         }

//     } catch (error: any) {
//         console.log(error)

//         if (res.statusCode === 200) {
//             res.status(500) // definimos 500 porque é algo que o servidor não previu
//         }

//         res.send(error.message)
//     }


// })


//Delete product by id

// Fluxo de Dados
// Delete Product by id
// validar que o produto existe

app.delete("/products/:id", async (req: Request, res: Response) => {

    try {
        const id = req.params.id

        if (!id) {
            res.status(400)
            throw new Error("É necessário informar o id")
        }

        const [product] = await db("products").where({ id: id })

        if (!product) {
            res.status(404)
            throw new Error(" 'Id' não encontrada")
        }
        await db("products").del().where({ id: id })

        res.status(200).send("Produto deletado com sucesso!")

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

// app.delete("/products/:id", (req: Request, res: Response) => {

//     try {

//         const id = req.params.id as string
//         const productById = products.findIndex((product) => {
//             return product.id === id
//         })
//         console.log("Index: ", productById)

//         if (productById >= 0) {
//             products.splice(productById, 1)
//             res.status(200).send("Produto apagado com sucesso")
//         } else {
//             res.status(404).send("Produto não existe")
//         }

//     } catch (error: any) {
//         console.log(error)

//         if (res.statusCode === 200) {
//             res.status(500) // definimos 500 porque é algo que o servidor não previu
//         }

//         res.send(error.message)
//     }


// })



//Exercicio 3
//Editar user by id

// Edit User by id
// validar que o usuário existe
// validar o body

app.put("/users/:id", (req: Request, res: Response) => {

    try {

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

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }

})


// app.put("/users/:id", (req: Request, res: Response) => {
//     try {

//     const id = req.params.id

//     const newId = req.body.id as string | undefined
//     const newEmail = req.body.email as string | undefined
//     const newPassword = req.body.password as number | undefined

//     const searchIdUser = users.find((user) => {
//         return user.id === id
//     })
//     if (!searchIdUser) {
//         res.status(400)
//         throw new Error("Id não existe, insira uma id válida")
//     }

//     if (!newId) {
//         res.status(400)
//         throw new Error("Digite um novo id para o usuario")
//     }
//     if (!newEmail) {
//         res.status(400)
//         throw new Error("Digite uma novo email para o usuário")
//     }
//     if (!newPassword) {
//         res.status(400)
//         throw new Error("Digite uma nova senha para o usuário")
//     }

//     const user = users.find((user) => {
//         return user.id === id
//     })
//     if (user) {
//         user.id = newId || user.id
//         user.email = newEmail || user.email
//         user.password = isNaN(newPassword) ? user.password : newPassword


//         res.status(200).send("Cadastro atualizado com sucesso")
//     } else {
//         res.status(404).send("Id não encontrado")
//     }

//     } catch (error: any) {
//         console.log(error)

//         if (res.statusCode === 200) {
//             res.status(500)
//         }
//         res.send(error.message)
//     }
// })

//Editar product by id


app.put("/products/:id", (req: Request, res: Response) => {

    try {

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

    } catch (error: any) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500) // definimos 500 porque é algo que o servidor não previu
        }

        res.send(error.message)
    }

})