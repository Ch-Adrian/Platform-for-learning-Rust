package pl.edu.agh.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RustFileConfiguration {
    @Bean
    public RustFileConfig getRustFileConfig(OperatingSystemConfig operatingSystemConfig) {
        return new RustFileConfig(operatingSystemConfig);
    }
}
