package pl.edu.agh.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.io.Serial;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;
    private final String message;
    public ResourceNotFoundException(String message){
        super(message);
        this.message = String.format("Not found exception occurred! %s",message);
    }

    public String getMessage(){
        return this.message;
    }
}
