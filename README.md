# Next.js TesloShop App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```

* El -d, significa __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__

## Llenar la base de datos con datos de pruebas
Llamar a:
```
http://localhost:3000/api/seed
```