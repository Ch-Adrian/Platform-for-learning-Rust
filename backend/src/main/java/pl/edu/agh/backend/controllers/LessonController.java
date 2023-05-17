package pl.edu.agh.backend.controllers;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.models.Lesson;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class LessonController {

    @PostMapping("save")
    public void getOutput(@RequestParam String path, @RequestParam String fileName, @RequestBody Lesson lesson) {
        System.out.println("DUPA");
        try (PrintWriter out = new PrintWriter(new FileWriter(path + File.separator + fileName))) {
            Gson gson = new Gson();
            String jsonString = gson.toJson(lesson);
            out.write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
