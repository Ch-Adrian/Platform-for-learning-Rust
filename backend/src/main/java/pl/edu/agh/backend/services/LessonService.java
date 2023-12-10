package pl.edu.agh.backend.services;

import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.lesson.dto.LessonInfoDTO;
import pl.edu.agh.backend.lesson.dto.LessonRenameDTO;

import java.util.List;

public interface LessonService {

    String createNewLesson(LessonFile lessonFile);

    Lesson getLessonByName(String name);

    List<LessonInfoDTO> getAllLessonsInfo();

    LessonFile getDefaultLesson();

    void saveLesson(String lessonName, Lesson lesson);

    void renameLesson(String oldName, LessonRenameDTO lessonRenameDTO);

    void deleteLesson(String name);

    void deleteLessons(List<String> names);

}
