package pl.edu.agh.backend.controllers;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.lesson.LessonFile;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;


@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class LessonController {

    @PostMapping("save")
    public void getOutput(@RequestBody LessonFile lessonFile) {
        try (PrintWriter out = new PrintWriter(new FileWriter("backend/lessons" + File.separator + lessonFile.getName()))) {
            Gson gson = new Gson();
            String jsonString = gson.toJson(lessonFile.getLesson());
            out.write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
