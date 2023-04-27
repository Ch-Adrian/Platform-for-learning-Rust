package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.Item;
import pl.edu.agh.backend.services.CompilerService;
import pl.edu.agh.backend.compiler.RustFile;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class RustCompilerController {

    @PostMapping("code")
    public String getOutput(@RequestBody Item code) {
        CompilerService compilerService = new CompilerService();
        System.out.println(code.item);
        return compilerService.run(new RustFile("main.rs", "src/main/resources/rust", code.item)).output();
    }
}
