package pl.edu.agh.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BackendConfiguration {
    @Bean
    public ExampleClass exampleClass(){
        return new ExampleClass();
    }
}
