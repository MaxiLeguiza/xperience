
# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```bash
$ npm install
```
3. Tener Nest CLI instalado
```
$ npm i -g @nestjs/cli
```

4.Configurar variables de entorno(.env)
```
MONGO_DB_DATABASE=urlbasededatos
```

5. Levantar base de datos

```
docker-compose up -d   
```


## Compile y corra el projecto

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


