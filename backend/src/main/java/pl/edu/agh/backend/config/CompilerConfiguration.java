package pl.edu.agh.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CompilerConfiguration {
    @Bean
    public CompilerResponseConfig createCompilerResponse(){
        return new CompilerResponseConfig();
    }
}
