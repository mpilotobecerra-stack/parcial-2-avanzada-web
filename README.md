# StockFlow API

Este proyecto lo hice para el examen de Programación Web Avanzada.
La idea es tener una API sencilla para manejar inventario, usuarios y pedidos de una distribuidora.

## ¿QUE HACE?

En esta API se puede:
- registrar usuarios
- iniciar sesión
- ver y administrar productos
- crear pedidos
- revisar productos con poco stock
- usar permisos de administrador en algunas rutas

## ¿QUE NECESITO?

- Node.js 18 o más
- npm
- una terminal

## COMO CORRERLO

1. Entrar a la carpeta del proyecto.
2. Instalar todo:
   npm install
3. Generar Prisma:
   npx prisma generate
4. Crear la base de datos:
   npx prisma migrate dev --name init
5. Poner datos de ejemplo:
   npx tsx src/seed.ts
6. Levantar el servidor:
   npm run dev

Si salió bien, la API queda en:
http://localhost:3000

También puedes abrir el frontend en el navegador en:
http://localhost:3000

## COMO SABER SI FUNCIONA

Puedes usar estas opciones:
- npm run build  -> para compilar
- npm test       -> para correr las pruebas

Y también puedes probar esta ruta base:
- GET /health


### PRODUCTOS
- GET /api/products
- POST /api/products (solo ADMIN)
- PUT /api/products/:id (solo ADMIN)
- DELETE /api/products/:id (solo ADMIN)

### PEDIDOS
- POST /api/orders
- GET /api/orders/:id
- PATCH /api/orders/:id/status

### REPORTES
- GET /api/reports/low-stock (solo ADMIN)
- GET /api/products/low-stock (alias)

## NOTA FINAL

La carpeta src/tests tiene pruebas básicas para revisar que todo responde bien.
Si quieres probar rápido, lo más importante es esto:
1. npm install
2. npx prisma migrate dev --name init
3. npm run dev


La carpeta src/tests tiene pruebas básicas para revisar que todo responde bien.
Si quieres probar rápido, lo más importante es esto:
1. npm install
2. npx prisma migrate dev --name init
3. npm run dev
