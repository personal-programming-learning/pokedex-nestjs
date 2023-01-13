<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

Pokemon application Nestjs

## Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```bash
$ npm install
```

3. Tener Nest CLI instalado

```bash
# Instalar CLI
$ npm i -g @nestjs/cli

```

4. Levantar base de datos

```bash
# run docker-compose
docker-compose up -d


# connect to mongodb
Url: mongodb://localhost:27017/nest-pokemon


```

5. Reconstruir la base de datos con la semilla

```bash
# Run http Method Get
http://localhost:3000/api/v2/seed


```

## Stack usado

- MongoDB
- Nestjs
