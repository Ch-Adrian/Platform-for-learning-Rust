package pl.edu.agh.backend.configuration;


import pl.edu.agh.backend.compiler.CompilationResponse;
import pl.edu.agh.backend.compiler.files.RustFile;
import pl.edu.agh.backend.compiler.files.RustTestsFile;
import pl.edu.agh.backend.compiler.Status;

public class CompilerResponseConfig {


    public CompilationResponse createError(String message){
        return CompilationResponse.builder()
                .status(Status.ERROR)
                .compilationError(message)
                .build();
    }

    public CompilationResponse createResponse(String compilerMessage, String programOutput, RustFile rustFile){
        if (rustFile instanceof RustTestsFile) {
            return CompilationResponse.builder()
                    .status(getStatus(compilerMessage))
                    .compilerMessage(compilerMessage)
                    .testsOutput(programOutput)
                    .build();
        } else {
            return CompilationResponse.builder()
                    .status(getStatus(compilerMessage))
                    .compilerMessage(compilerMessage)
                    .programOutput(programOutput)
                    .build();
        }
    }

    private Status getStatus(String message) {
        if (message.isEmpty()) {
            return Status.NORMAL;
        } else {
            return Status.WARNINGS;
        }
    }
}
