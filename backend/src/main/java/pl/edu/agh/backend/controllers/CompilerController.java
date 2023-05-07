package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.compiler.StudentInput;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.compiler.RustTestFile;
import pl.edu.agh.backend.services.CompilerService;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class CompilerController {
    private final CompilerService compilerService;

    CompilerController(CompilerService compilerService) {
        this.compilerService = compilerService;
    }

    @PostMapping("code")
    public String getOutput(@RequestBody StudentInput studentInput) {
        System.out.println(studentInput.getItem());
        return compilerService.run(new RustFile("main.rs", "src/main/resources/rust", studentInput.getItem())).getAll();
    }

    @PostMapping("test")
    public String getTestOutput(@RequestBody StudentInput studentInput) {
        return compilerService.runTests(new RustTestFile("test.rs", "src/main/resources/tests", studentInput.getItem(), studentInput.getTestContent())).getAll();
    }
}
