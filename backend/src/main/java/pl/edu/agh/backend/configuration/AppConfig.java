package pl.edu.agh.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.agh.backend.factories.CommandsFactory;
import pl.edu.agh.backend.ossystems.CommandsLinux;
import pl.edu.agh.backend.ossystems.CommandsWindows;

import java.util.Objects;

@Configuration
public class AppConfig {

    @Bean
    public CommandsFactory getOperatingSystem() {
        if (Objects.equals(System.getProperty("os.name"), "Linux")) {
            return new CommandsLinux();
        } else {
            return new CommandsWindows();
        }
    }

    @Bean
    public RustFileConfig getRustFileConfig() {
        return new RustFileConfig(getOperatingSystem());
    }

    @Bean
    public CompilerResponseConfig createCompilerResponse() {
        return new CompilerResponseConfig();
    }
}
