package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.models.Lesson;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class SaverController {

    @PostMapping("save")
    public void getOutput(@RequestParam String path, @RequestBody Lesson lesson) {
        System.out.println("Saved");
    }
}
