package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.compiler.RustTestsFile;
import pl.edu.agh.backend.compiler.StudentInput;
import pl.edu.agh.backend.compiler.RustFile;
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
        return compilerService.run(RustFile.builder()
                .fileName("main.rs")
                .directory("src/main/resources/rust")
                .content(studentInput.getItem())
                .build()).getAll();
    }

    @PostMapping("test")
    public String getTestOutput(@RequestBody StudentInput studentInput) {
        return compilerService.run(RustTestsFile.builder()
                .fileName("test.rs")
                .directory("src/main/resources/tests")
                .content(studentInput.getItem())
                .testContent(studentInput.getTestContent())
                .build()).getTestsOutput();
    }
}
