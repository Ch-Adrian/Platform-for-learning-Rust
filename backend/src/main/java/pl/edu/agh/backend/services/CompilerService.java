package pl.edu.agh.backend.services;

import org.springframework.stereotype.Service;
import pl.edu.agh.backend.compiler.RustConfigFile;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.CompilationResponse;
import pl.edu.agh.backend.compiler.RustProgramProcess;


@Service
public class CompilerService {

    public CompilationResponse run(RustFile rustFile) {
        return new RustProgramProcess(rustFile).runProcess();
    }

    public CompilationResponse configure(RustConfigFile rustFile) {
        return new RustProgramProcess(rustFile).buildConfig();
    }

}
