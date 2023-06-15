package pl.edu.agh.backend.controllers;

import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.services.LessonService;

import java.util.List;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lessons/")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping("save")
    public void save(@RequestBody LessonFile lessonFile) {
        lessonService.saveExistingLesson(lessonFile);
    }

    @PostMapping("create")
    public void createNewLesson(@RequestBody LessonFile lessonFile) {
        lessonService.createNewLesson(lessonFile);
    }

    @PostMapping("rename")
    public void renameLesson(@RequestBody Map<String, String> json) {
        lessonService.renameLesson(json.get("oldName"), json.get("newName"));
    }

    @GetMapping("list")
    public List<String> getAllLessonsNames() {
        return lessonService.getAllLessonsNames();
    }
}
