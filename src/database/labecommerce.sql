-- Active: 1673886422438@@127.0.0.1@3306

CREATE TABLE users (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL
);

CREATE TABLE products (
	id TEXT PRIMARY KEY UNIQUE NOT NULL,
	name TEXT NOT NULL,
	price REAL NOT NULL,
    category TEXT NOT NULL
);

PRAGMA table_info ('users');

PRAGMA table_info ('products');

INSERT INTO users (id, email, password)
VALUES 
(001, "001ubiga.com", "0012345"),
(002, "002u@biga.com", "0022345"),
(003, "003u@biga.com", "0012345");

INSERT INTO products (id, name, price, category)
VALUES 
(001, "p1", 10, "Eletronicos"),
(002, "p2", 23, "Roupas"),
(003, "p3", 30, "Comida"),
(004, "p4", 25, "Roupas"),
(005, "p5", 45, "Comida");


SELECT * FROM users;

SELECT * FROM products;


DELETE FROM users;

DELETE FROM products;
