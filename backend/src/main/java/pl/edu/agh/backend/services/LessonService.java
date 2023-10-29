package pl.edu.agh.backend.services;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.stream.JsonReader;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.exceptions.LessonNotFoundException;
import pl.edu.agh.backend.exceptions.LessonsNameConflictException;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.lesson.LessonInfo;
import pl.edu.agh.backend.lesson.cells.Cell;
import pl.edu.agh.backend.serialization.PolymorphDeserializer;

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
    private static final String newLessonName = "NewLesson";

    public List<LessonInfo> getAllLessonsInfo() {
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

    public String createNewLesson(LessonFile lessonFile) {
        if (this.existsLesson(lessonFile.getName())) {
            lessonFile.setName(findAvailableName(lessonFile.getName().substring(0, lessonFile.getName().length() - 5)));
        }
        this.saveLesson(lessonFile);
        return lessonFile.getName();
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
        oldFile.renameTo(newFile);
    }

    public void deleteLesson(List<String> lessonsToDelete) {
        for (String name: lessonsToDelete) {
            File file = new File(rootDir + File.separator + name);

            if (file.delete()) {
                System.out.println("File deleted successfully");
            }
            else {
                System.out.println("Failed to delete the file");
            }
        }
    }

    public Lesson getLesson(String name) throws LessonNotFoundException {
        Gson gson = new GsonBuilder()
                .registerTypeAdapter(Cell.class, new PolymorphDeserializer<Cell>())
                .create();
        JsonReader reader = null;
        try {
            reader = new JsonReader(new FileReader(rootDir + File.separator + name));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        assert reader != null;
        return gson.fromJson(reader, Lesson.class);
    }

    public LessonFile getDefaultLesson() {
        return new LessonFile(findAvailableName(newLessonName), Lesson.getDefaultLesson());
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
