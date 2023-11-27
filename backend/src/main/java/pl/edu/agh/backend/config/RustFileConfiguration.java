package pl.edu.agh.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RustFileConfiguration {
    @Bean
    public RustFileConfig getRustFileConfig(CommendsConfiguration commendsConfiguration) {
        return new RustFileConfig(commendsConfiguration);
    }
}