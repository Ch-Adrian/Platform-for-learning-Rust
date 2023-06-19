package pl.edu.agh.backend.configurations;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.backend.comannds.CommandsLinux;
import pl.edu.agh.backend.factories.CommandsFactory;
import pl.edu.agh.backend.comannds.CommandsWindows;

import java.util.Objects;

@Configuration
public class CommendsConfiguration {

    @Bean
    public CommandsFactory getOperatingSystem() {
        if (Objects.equals(System.getProperty("os.name"), "Linux")) {
            return new CommandsLinux();
        } else {
            return new CommandsWindows();
        }
    }
}
