package pl.edu.agh.backend.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.compiler.StudentInput;
import pl.edu.agh.backend.configuration.RustFileConfig;
import pl.edu.agh.backend.services.CompilerService;

@RestController
@AllArgsConstructor
@RequestMapping("/compilations")
@CrossOrigin(origins = "http://localhost:3000")
public class CompilerController {

    private final CompilerService compilerService;

    private final RustFileConfig rustFileConfig;

    @PostMapping("/code")
    public String getOutput(@RequestBody StudentInput studentInput) {
        return compilerService.run(rustFileConfig.createRustFile(studentInput.getCodeContent())).getAll();
    }

    @PostMapping("/test")
    public String getTestOutput(@RequestBody StudentInput studentInput) {
        return compilerService.run(rustFileConfig.createRustTestsFile(studentInput.getCodeContent(),
                studentInput.getTestContent())).getAll();
    }

    @PutMapping("/config")
    public String configure(@RequestBody StudentInput studentInput) {
        return compilerService.configure(rustFileConfig.createRustConfigFile(studentInput.getCodeContent())).getAll();
    }

}
