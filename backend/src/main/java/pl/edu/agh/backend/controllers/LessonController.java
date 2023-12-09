package pl.edu.agh.backend.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.lesson.*;
import pl.edu.agh.backend.services.LessonService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/lessons")
@CrossOrigin(origins = "http://localhost:3000")
public class LessonController {

    private final LessonService lessonService;

    @PostMapping
    public String createNewLesson(@RequestBody LessonFile lessonFile) {
        return lessonService.createNewLesson(lessonFile);
    }

    @GetMapping("/{lessonName}")
    public Lesson getLessonByName(@PathVariable String lessonName) {
        return lessonService.getLessonByName(lessonName);
    }

    @GetMapping
    public List<LessonInfoDTO> getAllLessonsInfo() {
        return lessonService.getAllLessonsInfo();
    }

    @GetMapping("/default")
    public LessonFile getDefaultLesson() {
        return lessonService.getDefaultLesson();
    }

    @PostMapping("/{lessonName}")
    public void saveLesson(@PathVariable String lessonName, @RequestBody Lesson lesson) {
        lessonService.saveLesson(lessonName, lesson);
    }

    @PutMapping("/{lessonName}")
    public void renameLesson(@PathVariable String lessonName, @RequestBody String newLessonName) {
        lessonService.renameLesson(lessonName, newLessonName);
    }

    @DeleteMapping("/{lessonName}")
    public void deleteLesson(@PathVariable String lessonName) {
        lessonService.deleteLesson(lessonName);
    }

    @DeleteMapping("/deleteBatch")
    public void deleteLessons(@RequestBody List<String> lessonNames) {
        lessonService.deleteLessons(lessonNames);
    }

}
