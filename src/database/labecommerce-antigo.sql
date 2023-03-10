-- Active: 1673886422438@@127.0.0.1@3306

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL
    );

PRAGMA table_info ('users');

PRAGMA table_info ('products');

INSERT INTO
    users (id, email, password)
VALUES
("001", "001u@biga.com", "0012345"), 
("002", "002u@biga.com", "0022345"), 
("003", "003u@biga.com", "0012345");

INSERT INTO
    products (id, name, price, category)
VALUES 
('001', "monitor", 10, "Eletrônicos"), 
('002', "shorts", 23, "Roupas e Calçados"), 
('003', "colar", 30, "Acessórios"), 
('004', "camisa", 25, "Roupas e Calçados"), 
('005', "celular", 45, "Eletrônicos");


DELETE FROM users;

DELETE FROM products;

--aprofundamento sql

--Exercicio 1 

--Get All Users
-- retorna todos os usuários cadastrados 
SELECT * FROM users;

-- Get All Products
-- retorna todos os produtos cadastrados
SELECT * FROM products;

-- Search Product by name
-- mocke um termo de busca, por exemplo "monitor"
-- retorna o resultado baseado no termo de busca
SELECT * FROM products
WHERE name = 'monitor';

-- Create User
-- mocke um novo usuário
-- insere o item mockado na tabela users
INSERT INTO users (id, email, password)
VALUES ("New User", "new@email.com", "N123");

-- Create Product
-- mocke um novo produto
-- insere o item mockado na tabela products
INSERT INTO products (id, name, price, category)
VALUES ("006", "brinco", 5.5, "Acessórios");

--Exercício 2

-- Get Products by id
-- mocke uma id
-- busca baseada no valor mockado
SELECT * FROM products
WHERE id = "001";

-- Delete User by id
-- mocke uma id
-- delete a linha baseada no valor mockado
DELETE FROM users
WHERE id = 1;

-- Delete Product by id
-- mocke uma id
-- delete a linha baseada no valor mockado
DELETE FROM products
WHERE id = 1;

-- Edit User by id
-- mocke valores para editar um user
-- edite a linha baseada nos valores mockados
UPDATE users
SET
	email = "mb@email.com",
	password = "0987"
WHERE id = 2;

-- Edit Product by id
-- mocke valores para editar um product
-- edite a linha baseada nos valores mockados

UPDATE products
SET
	name = "tenis",
	price = 10,
    category = "Roupas e Calçados"
WHERE id = 2;


INSERT INTO products (id, name, price, category)
VALUES 
("7", "celular", 350, "Eletronicos"),
("8", "tv", 550, "Eletronicos"),
("9", "notebook", 5780, "Eletronicos");


--Exercicio 3

-- Copie as queries do exercício 1 e refatore-as

--Get All Users
--retorna o resultado ordenado pela coluna email em ordem crescente
SELECT * FROM users
ORDER BY email ASC;

-- Get All Products versão 1
-- retorna o resultado ordenado pela coluna price em ordem crescente
-- limite o resultado em 20 iniciando pelo primeiro item
SELECT * FROM products
ORDER BY price ASC
LIMIT 20 OFFSET 0;

-- Get All Products versão 2
-- mocke um intervalo de preços, por exemplo entre 100.00 e 300.00
-- retorna os produtos com preços dentro do intervalo mockado em ordem crescente
SELECT * FROM products
WHERE
	price >= 300
	and price <= 1000
ORDER BY price ASC;	

---relações sql  1

--Exercicio 1

-- Criação da tabela de pedidos
-- nome da tabela: purchases
-- colunas da tabela:
-- id (TEXT, PK, único e obrigatório)
-- total_price (REAL, único e obrigatório)
-- paid (INTEGER e obrigatório)
-- delivered_at (TEXT e opcional)
-- buyer_id (TEXT, obrigatório e FK = referencia a coluna id da tabela users)

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        total_price REAL UNIQUE NOT NULL,
        paid INTEGER NOT NULL,
        delivered_at TEXT,
        buyer_id TEXT NOT NULL,
        FOREIGN KEY (buyer_id) REFERENCES users (id)        
);

DROP TABLE purchases;

--Exercicio 2

-- a) Crie dois pedidos para cada usuário cadastrado
-- No mínimo 4 no total 
-- (ou seja, pelo menos 2 usuários diferentes) 
-- e devem iniciar com a data de entrega nula.

 INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
    ("pu001", 60, 0, "001"),
    ("pu002", 20, 0, "002" );

    INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
    ("pu003", 10, 0, "002"),
    ("pu004", 30, 0, "003");


-- b) Edite o status da data de entrega de um pedido
-- Simule que o pedido foi entregue no exato momento da sua edição 
-- (ou seja, data atual).

UPDATE purchases
SET paid = 1,
    delivered_at = DATETIME('now')
WHERE id = "pu001";

SELECT * FROM purchases;

-- Exercício 3

-- Crie a query de consulta utilizando junção
-- para simular um endpoint de histórico
--  de compras de um determinado usuário.
-- Mocke um valor para a id do comprador,
-- ela deve ser uma das que foram utilizadas
-- no exercício 2.

SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE users.id = "001";



-- Exercicio 1
-- Agora que sabemos como criar relações m:n,
-- é possível implementar a tabela de relações entre produtos e pedidos.


-- Criação da tabela de relações
-- nome da tabela: purchases_products
-- colunas da tabela:
-- purchase_id (TEXT e obrigatório, não deve ser único)
-- product_id (TEXT e obrigatório, não deve ser único)
-- quantity (INTEGER e obrigatório, não deve ser único)
-- Como essa lógica funciona?
-- Cada compra é registrada uma única vez na tabela purchases.
-- Cada produto da mesma compra é registrado uma única vez na tabela purchases_products.

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

DROP TABLE purchases_products;

-- Exemplo:

-- uma pessoa coloca 5 laranjas (p001) e 3 bananas (p002) no carrinho e confirma sua compra

-- a compra é registrada com id c001 na tabela purchases

-- a seguir, cada item do carrinho é registrado na tabela purchases_products
-- 5 laranjas são registradas na tabela purchases_products (c001, p001, 5)
-- 3 bananas são registradas na tabela purchases_products (c001, p002, 3)



-- Exercício 2
-- Com a tabela de relações criada podemos finalmente realizar compras no banco de dados!

-- Inserção dos dados
-- Popule sua tabela purchases_products simulando 3 compras de clientes.

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
("pu001", "001", 2),
("pu002", "002", 3),
("pu003", "002", 4);

-- Consulta com junção INNER JOIN

SELECT 
    purchases.id AS purchaseId,
    products.id AS productId,
    purchases_products.quantity AS quantity,
    purchases.buyer_id AS buyer
FROM purchases_products
INNER JOIN purchases
ON purchases_products.purchase_id = purchases.id
INNER JOIN products
ON purchases_products.product_id = products.id;


-- Mostre em uma query todas as colunas das tabelas relacionadas (purchases_products, purchases e products).
