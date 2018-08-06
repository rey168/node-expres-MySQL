Node.js, Express & MySQL: Simple Add, Edit, Delete, View (CRUD)



**Creating database and table**

```
create database db;

Crear tabla users.

CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), name varchar(100) NOT NULL, age int(3) NOT NULL, email varchar(100) NOT NULL, password varchar(100) NOT NULL);

Crear tabla Clientes.

CREATE TABLE clientes (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id), name varchar(100) NOT NULL, descrip varchar(100)  NOT NULL, UrlWeb varchar(100) NOT NULL);
```
