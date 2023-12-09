package pl.edu.agh.backend.services;

import pl.edu.agh.backend.compiler.CompilationResponse;
import pl.edu.agh.backend.compiler.files.RustConfigFile;
import pl.edu.agh.backend.compiler.files.RustFile;

public interface CompilerService {
    CompilationResponse run(RustFile rustFile);

    CompilationResponse configure(RustConfigFile rustFile);
}
