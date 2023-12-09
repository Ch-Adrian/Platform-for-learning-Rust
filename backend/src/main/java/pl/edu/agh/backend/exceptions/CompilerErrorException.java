package pl.edu.agh.backend.exceptions;

import lombok.Getter;

@Getter
public class CompilerErrorException extends RuntimeException {
    private final String message;
    private final String rustFile;

    public CompilerErrorException(String rustFile, String message) {
        super("Cannot compile a file!");
        this.rustFile = rustFile;

        if (!message.isEmpty())
            this.message = String.format("Cannot compile a file: %s!\n File doesn't exist due to some error.\n\n**Compiler response:** \n%s", rustFile, message);
        else {
            this.message = String.format("Cannot compile a file: %s!\n File doesn't exist due to some error.", rustFile);
        }
    }

}
