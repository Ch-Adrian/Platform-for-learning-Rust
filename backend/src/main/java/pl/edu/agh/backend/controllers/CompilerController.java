package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.compiler.StudentInput;
import pl.edu.agh.backend.config.RustFileConfig;
import pl.edu.agh.backend.services.CompilerService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/compilations")
public class CompilerController {
    private final CompilerService compilerService;
    private final RustFileConfig rustFileConfig;

    CompilerController(CompilerService compilerService, RustFileConfig rustFileConfig) {
        this.compilerService = compilerService;
        this.rustFileConfig = rustFileConfig;
    }

    @PostMapping("/code")
    public String getOutput(@RequestBody StudentInput studentInput) {
        return compilerService.run(rustFileConfig.createRustFile(studentInput.getItem())).getAll();
    }

    @PostMapping("/test")
    public String getTestOutput(@RequestBody StudentInput studentInput) {
        return compilerService.run(rustFileConfig.createRustTestsFile(studentInput.getItem(),
                studentInput.getTestContent())).getAll();
    }

    @PutMapping("/config")
    public String configure(@RequestBody StudentInput studentInput) {
        return compilerService.configure(rustFileConfig.createRustConfigFile(studentInput.getItem())).getAll();
    }
}
