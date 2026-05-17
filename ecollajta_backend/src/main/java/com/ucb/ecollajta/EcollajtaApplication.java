package com.ucb.ecollajta;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.ucb.ecollajta")
@EntityScan("com.ucb.ecollajta.model")
@EnableJpaRepositories("com.ucb.ecollajta.repository")
public class EcollajtaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EcollajtaApplication.class, args);
	}

}
