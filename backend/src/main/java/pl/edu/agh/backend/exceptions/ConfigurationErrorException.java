package pl.edu.agh.backend.exceptions;

public class ConfigurationErrorException extends RuntimeException {

    private final String message;

    public ConfigurationErrorException(String message) {
        this.message = "Configuration Error! " + message;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
