package pl.edu.agh.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SpringApplicationBuilder builder = new SpringApplicationBuilder(BackendApplication.class);

		builder.headless(false);

		ConfigurableApplicationContext context = builder.run(args);

//		SpringApplication.run(BackendApplication.class, args);
	}

}
