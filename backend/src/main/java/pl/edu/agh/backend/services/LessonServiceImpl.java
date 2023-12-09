package pl.edu.agh.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.exceptions.LessonNotFoundException;
import pl.edu.agh.backend.exceptions.LessonNotSavedException;
import pl.edu.agh.backend.exceptions.LessonsNameConflictException;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.lesson.LessonInfoDTO;
import pl.edu.agh.backend.lesson.cells.Cell;
import pl.edu.agh.backend.serialization.PolymorphDeserializer;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.TimeZone;

@Service
public class LessonServiceImpl implements LessonService {

    private static final String rootDir = "lessons";
    private static final String newLessonName = "NewLesson";
    private static final Logger logger = LogManager.getLogger();

    public String createNewLesson(LessonFile lessonFile) {
        String lessonName = lessonFile.getName().replaceAll("\\.json$", "");
        if (this.existsLesson(lessonName)) {
            lessonFile.setName(findAvailableName(lessonName.substring(0, lessonName.length() - 5)));
        }
        logger.info("Lesson imported with name: " + lessonFile.getName());
        return lessonFile.getName();
    }

    public Lesson getLessonByName(String name) throws LessonNotFoundException {
        if (!existsLesson(name)) {
            throw new LessonNotFoundException(name);
        }
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Cell.class, new PolymorphDeserializer<Cell>())
                .create();

        JsonReader reader;
        try {
            reader = new JsonReader(new FileReader(rootDir + File.separator + name));
        } catch (FileNotFoundException ex) {
            logger.error(ex.getMessage());
            throw new LessonNotFoundException(name);
        }
        Lesson lesson = gson.fromJson(Objects.requireNonNull(reader), Lesson.class);
        logger.info("Lesson loaded: " + name);
        try {
            reader.close();
        } catch (Exception ex) {
            logger.error("Reader could not be closed!");
        }
        return lesson;
    }

    public List<LessonInfoDTO> getAllLessonsInfo() {
        File currentDir = new File(rootDir);
        FilenameFilter filter = (file, name) -> name.endsWith(".json");

        return Arrays
                .stream(Objects.requireNonNull(currentDir.listFiles(filter)))
                .map(file -> new LessonInfoDTO(file.getName(), LocalDateTime.ofInstant(
                        Instant.ofEpochMilli(file.lastModified()),
                        TimeZone.getDefault().toZoneId())
                        )
                )
                .toList();
    }

    public LessonFile getDefaultLesson() {
        String lessonName = findAvailableName(newLessonName);
        logger.info("Default lesson created with name: " + lessonName);
        return new LessonFile(lessonName, Lesson.getDefaultLesson());
    }

    public void saveLesson(String lessonName, Lesson lesson) {
        this.saveLesson(new LessonFile(lessonName, lesson));
    }

    public void renameLesson(String oldName, String newName) {
        if (oldName.equals(newName)) {
            return;
        }
        if (!this.existsLesson(oldName)) {
            throw new LessonNotFoundException(oldName);
        }
        if (this.existsLesson(newName)) {
            throw new LessonsNameConflictException(newName);
        }
        File oldFile = new File(rootDir + File.separator + oldName);
        File newFile = new File(rootDir + File.separator + newName);
        boolean isRenamed = oldFile.renameTo(newFile);
        if (isRenamed) {
            logger.info("Lessons renamed: " + oldName + " -> " + newName);
        } else {
            logger.error("Lesson could not be renamed!");
        }
    }

    public void deleteLesson(String name) {
        if (!existsLesson(name)) {
            logger.error("Lesson not found: " + name);
            throw new LessonNotFoundException(name);
        }  else {
        try {
            Files.delete(Path.of(rootDir + File.separator + name));
        } catch (IOException ex) {
            logger.error("Failed to delete lesson: " + name);
        }
        logger.info("Lesson deleted successfully: " + name);}
    }

    public void deleteLessons(List<String> names) {
        for (String name: names) {
            this.deleteLesson(name);
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
        } catch (IOException ex) {
            logger.error("Failed to save the lesson");
            throw new LessonNotSavedException(ex.getMessage());
        }
        logger.info("Lesson saved successfully: " + lessonFile.getName());
    }

    private List<String> getAllLessonsNames() {
        File currentDir = new File(rootDir);
        FilenameFilter filter = (file, name) -> name.endsWith(".json");
        return Arrays.stream(Objects.requireNonNull(currentDir.list(filter))).toList();
    }

    private String findAvailableName(String wantedName) {
        if (this.existsLesson(wantedName + ".json")) {
            return this.findAvailableName(wantedName, 1);
        } else {
            return wantedName + ".json";
        }
    }

    private String findAvailableName(String wantedName, int attempt) {
        if (this.existsLesson(wantedName + "(" + attempt + ").json")) {
            return findAvailableName(wantedName, attempt + 1);
        } else {
            return wantedName + "(" + attempt + ").json";
        }
    }

}
