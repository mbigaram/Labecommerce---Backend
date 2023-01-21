-- Active: 1673886422438@@127.0.0.1@3306

---tabelas

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

    PRAGMA table_info ('users');
    DROP TABLE users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT NOT NULL
);

    PRAGMA table_info ('products');
    DROP TABLE products;

CREATE TABLE purchases (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    total_price REAL UNIQUE NOT NULL,
    paid INTEGER NOT NULL,
    delivered_at TEXT,
    buyer_id TEXT NOT NULL,
    FOREIGN KEY (buyer_id) REFERENCES users (id)        
);

    PRAGMA table_info ('purchases');
    DROP TABLE purchases;

CREATE TABLE purchases_products (
    purchase_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (purchase_id) REFERENCES purchases (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

    PRAGMA table_info ('purchases_products');
    DROP TABLE purchases_products;

---população

INSERT INTO users (id, email, password)
VALUES
("u001", "u1@biga.com", "u001"), 
("u002", "u2@biga.com", "u002"), 
("u003", "u3@biga.com", "u003");
INSERT INTO users (id, email, password)
VALUES 
("u004", "u4@email.com", "u004");

    DELETE FROM users;
    SELECT * FROM users;


INSERT INTO products (id, name, price, category)
VALUES 
('p001', "monitor", 1999.90, "Eletrônicos"), 
('p002', "shorts", 120, "Roupas e Calçados"), 
('p003', "colar", 55.30, "Acessorios"), 
('p004', "camisa", 150.99, "Roupas e Calçados"), 
('p005', "celular", 2549.19, "Eletrônicos");
INSERT INTO products (id, name, price, category)
VALUES 
("p006", "brinco", 35, "Acessórios");
INSERT INTO products (id, name, price, category)
VALUES 
("p007", "celular", 350, "Eletronicos"),
("p008", "tv", 550, "Eletronicos"),
("p009", "notebook", 5780, "Eletronicos");

    DELETE FROM products;
    SELECT * FROM products;

 INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
("pu001", 60, 0, "u001"),
("pu002", 20, 0, "u002" );
INSERT INTO purchases (id, total_price, paid, buyer_id)
VALUES
("pu003", 10, 0, "u002"),
("pu004", 30, 0, "u003");

    DELETE FROM purchases;
    SELECT * FROM purchases;

UPDATE purchases
SET paid = 1,
    delivered_at = DATETIME('now')
WHERE id = "pu003";







SELECT * FROM products
WHERE name = 'monitor';

SELECT * FROM products
WHERE id = "p001";


DELETE FROM users
WHERE id = 1;

DELETE FROM products
WHERE id = 1;

UPDATE users
SET
	email = "mb@email.com",
	password = "0987"
WHERE id = 2;


UPDATE products
SET
	name = "tenis",
	price = 10,
    category = "Roupas e Calçados"
WHERE id = 2;

SELECT * FROM users
ORDER BY email DESC;
 --crescente ASC
 --decrescente DESC

SELECT * FROM products
ORDER BY price DESC
LIMIT 20 OFFSET 0;


SELECT * FROM products
WHERE
	price >= 300
	and price <= 3000
ORDER BY price ASC;	


SELECT * FROM purchases
INNER JOIN users
ON purchases.buyer_id = users.id
WHERE users.id = "u002";



--relação usuario,compra, produto

INSERT INTO purchases_products (purchase_id, product_id, quantity)
VALUES
("pu001", "p001", 2),
("pu002", "p002", 3),
("pu003", "p002", 4);

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
