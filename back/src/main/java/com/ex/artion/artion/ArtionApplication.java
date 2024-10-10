package com.ex.artion.artion;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class ArtionApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtionApplication.class, args);
	}

}
