package pl.edu.agh.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.backend.system.Linux;
import pl.edu.agh.backend.system.OperatingSystem;
import pl.edu.agh.backend.system.Windows;

import java.util.Objects;

@Configuration
public class OperatingSystemConfig {

    @Bean
    public OperatingSystem getOperatingSystem() {
        if (Objects.equals(System.getProperty("os.name"), "Linux")) {
            return new Linux();
        } else {
            return new Windows();
        }
    }
}
