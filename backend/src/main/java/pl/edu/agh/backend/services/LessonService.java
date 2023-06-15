package pl.edu.agh.backend.services;

import com.google.gson.Gson;
import org.springframework.stereotype.Service;
import pl.edu.agh.backend.lesson.LessonFile;

import java.io.File;
import java.io.FileWriter;
import java.io.FilenameFilter;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Service
public class LessonService {

    private static final String rootDir = "lessons";
    public List<String> getAllLessonsNames() {
        File currentDir = new File(rootDir);
        FilenameFilter filter = (file, name) -> name.endsWith(".json");
        return Arrays.stream(Objects.requireNonNull(currentDir.list(filter))).toList();
    }

    public boolean saveExistingLesson(LessonFile lessonFile) {
        if (!this.existsLesson(lessonFile.getName())) {
            return false;
        } else {
            return this.saveLesson(lessonFile);
        }
    }

    public boolean createNewLesson(LessonFile lessonFile) {
        if (this.existsLesson(lessonFile.getName())) {
            return false;
        } else {
            return this.saveLesson(lessonFile);
        }
    }

    public boolean renameLesson(String oldName, String newName) {
        if (!this.existsLesson(oldName) || this.existsLesson(newName)) {
            return false;
        } else {
            File oldFile = new File(rootDir + File.separator + oldName);
            File newFile = new File(rootDir + File.separator + newName);
            return oldFile.renameTo(newFile);
        }
    }

    private boolean existsLesson(String name) {
        return this.getAllLessonsNames().contains(name);
    }

    private boolean saveLesson(LessonFile lessonFile) {
        try (PrintWriter out = new PrintWriter(new FileWriter(rootDir + File.separator + lessonFile.getName()))) {
            Gson gson = new Gson();
            String jsonString = gson.toJson(lessonFile.getLesson());
            out.write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }
}



