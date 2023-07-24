package pl.edu.agh.backend.services;

import com.google.gson.Gson;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.exceptions.LessonNotFoundException;
import pl.edu.agh.backend.exceptions.LessonsNameConflictException;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.lesson.LessonInfo;

import java.io.*;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;

@Service
public class LessonService {

    private static final String rootDir = "lessons";

    public List<LessonInfo> getAllLessonsNames() {
        File currentDir = new File(rootDir);
        FilenameFilter filter = (file, name) -> name.endsWith(".json");

        return Arrays
                .stream(Objects.requireNonNull(currentDir.listFiles(filter)))
                .map(file -> new LessonInfo(file.getName(),
                        LocalDateTime.ofInstant(Instant.ofEpochMilli(file.lastModified()),
                                TimeZone.getDefault().toZoneId())))
                .toList();
    }

    public void saveExistingLesson(LessonFile lessonFile) {
        if (!this.existsLesson(lessonFile.getName())) {
            throw new LessonNotFoundException(lessonFile.getName());
        }
        this.saveLesson(lessonFile);
    }

    public void createNewLesson(LessonFile lessonFile) {
        if (this.existsLesson(lessonFile.getName())) {
            throw new LessonsNameConflictException(lessonFile.getName());
        }
        this.saveLesson(lessonFile);
    }

    public void renameLesson(String oldName, String newName) {
        if (!this.existsLesson(oldName)) {
            LessonFile lessonFile = new LessonFile(oldName, Lesson.getDefaultLesson());
            this.saveLesson(lessonFile);
        } else if (this.existsLesson(newName)) {
            throw new LessonsNameConflictException(newName);
        } else {
            File oldFile = new File(rootDir + File.separator + oldName);
            File newFile = new File(rootDir + File.separator + newName);
            oldFile.renameTo(newFile);
        }
    }

    public Lesson getLesson(String name) throws LessonNotFoundException {
        File lessonFile = new File(rootDir, name);
        if (!lessonFile.exists()) {
            throw new LessonNotFoundException(name);
        }

        try (BufferedReader br = new BufferedReader(new FileReader(lessonFile))) {
            return new Gson().fromJson(br, Lesson.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private boolean existsLesson(String name) {
        return this.getAllLessonsNames().contains(name);
    }

    private void saveLesson(LessonFile lessonFile) {
        try (PrintWriter out = new PrintWriter(new FileWriter(rootDir + File.separator + lessonFile.getName()))) {
            Gson gson = new Gson();
            String jsonString = gson.toJson(lessonFile.getLesson());
            out.write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}



