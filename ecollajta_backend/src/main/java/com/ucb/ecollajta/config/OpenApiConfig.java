package com.ucb.ecollajta.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Eco Llajta API",
        version = "1.0.0",
        description = "Documentación de endpoints del backend de Eco Llajta",
        contact = @Contact(name = "Eco Llajta")
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Servidor local")
    }
)
public class OpenApiConfig {
}