package pl.edu.agh.backend.services;

import org.springframework.stereotype.Service;
import pl.edu.agh.backend.compiler.files.RustConfigFile;
import pl.edu.agh.backend.compiler.files.RustFile;
import pl.edu.agh.backend.compiler.CompilationResponse;
import pl.edu.agh.backend.compiler.ProgramProcess;

@Service
public class CompilerServiceImpl implements CompilerService {

    public CompilationResponse run(RustFile rustFile) {
        return new ProgramProcess(rustFile).runProcess();
    }

    public CompilationResponse configure(RustConfigFile rustFile) {
        return new ProgramProcess(rustFile).buildConfig();
    }
}
