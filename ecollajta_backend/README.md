# Eco Llajta Backend

Backend en Spring Boot para la plataforma Eco Llajta.

## Requisitos

- Java 21
- Maven Wrapper incluido
- Base de datos PostgreSQL accesible

## Variables de entorno

Configura estas variables antes de iniciar:

- `DB_USERNAME`
- `DB_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `JWT_SECRET_KEY`
- `JWT_EXPIRATION_TIME`
- `CORS_ALLOWED_ORIGINS`

## Ejecutar la aplicación

Desde la carpeta `ecollajta_backend`:

```bash
./mvnw spring-boot:run
```

Si prefieres usar el JAR generado:

```bash
./mvnw clean package
java -jar target/ecollajta-0.0.1-SNAPSHOT.jar
```

## Swagger UI

Una vez levantada la aplicación:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Endpoints documentados

- `POST /api/auth/google`
- `GET /api/users/me`
- `GET /api/events`
- `GET /api/events/one`
- `POST /api/events`
- `POST /api/events/many`
- `PUT /api/events/{id}`
- `PUT /api/events/cancel/{id}`
- `POST /api/events/attendance`
- `PUT /api/events/cancel/attendance/{eventId}`
- `GET /api/events/attendance/qr/{eventId}`
- `POST /api/events/attendance/qr/decode`
- `GET /api/community`
- `POST /api/community`
- `POST /api/community/like`
- `GET /api/rewards`
- `GET /api/rewards/{id}`
- `POST /api/rewards`
- `POST /api/rewards/many`