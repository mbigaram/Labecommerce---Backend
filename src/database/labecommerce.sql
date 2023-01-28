-- Active: 1673886422438@@127.0.0.1@3306

---tabelas

CREATE TABLE users (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

    PRAGMA table_info ('users');
    DROP TABLE users;

CREATE TABLE products (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    imagemUrl TEXT NOT NULL
);

    PRAGMA table_info ('products');
    DROP TABLE products;



CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer_id TEXT NOT NULL,
        --quantity REAL DEFAULT(0) NOT NULL,  
        total_price REAL NOT NULL,      
        created_at TEXT NOT NULL DEFAULT(DATETIME()),
        paid INTEGER DEFAULT(0) NOT NULL,
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

INSERT INTO users (id, name, email, password)
VALUES
("u001", "Um", "u1@biga.com", "u001"), 
("u002", "Dois", "u2@biga.com", "u002"), 
("u003", "Tres", "u3@biga.com", "u003");
INSERT INTO users (id, name, email, password)
VALUES 
("u004", "Quatro", "u4@email.com", "u004");

    DELETE FROM users;
    SELECT * FROM users;


INSERT INTO products (id, name, price, description, imagemUrl)
VALUES
('pro001', 'Mouse gamer', 250, 'Melhor mouse do mercado!', 'https://picsum.photos/seed/Mouse%20gamer/400'),
('pro002', 'Monitor', 900, 'Monitor LED Full HD 24 polegadas', 'https://picsum.photos/seed/Monitor/400'),
('pro003', 'Teclado gamer', 200,'Teclado mecânico com numpad', 'https://picsum.photos/seed/Teclado%20gamer/400');

    DELETE FROM products;
    SELECT * FROM products;

INSERT INTO purchases (id, buyer_id, total_price )
VALUES
    ("pu001", "u001", 60),
    ("pu002", "u002", 20);

    INSERT INTO purchases (id, buyer_id, total_price)
VALUES
    ("pu003", "u001", 10),
    ("pu004", "u003", 20);

    DELETE FROM purchases;
    SELECT * FROM purchases;

UPDATE purchases
SET paid = 1,
    delivered_at = DATETIME('now') ---pode-se incluir o delivered_at pra quando for feito o pagamento o paid mudar pra 1 e me dizer quando foi isso.
WHERE id = "pu003";







SELECT * FROM products
WHERE name = 'monitor';

SELECT * FROM products
WHERE id = "p001";


DELETE FROM users
WHERE id = "u015";

DELETE FROM products
WHERE id = 1;

UPDATE users
SET
    name = "Marcelo",
	email = "mb@email.com",
	password = "0987"
WHERE id = "u002";


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

DELETE FROM purchases_products;
DELETE FROM purchases;

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
