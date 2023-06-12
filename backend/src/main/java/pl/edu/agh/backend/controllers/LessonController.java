package pl.edu.agh.backend.controllers;

import com.google.gson.Gson;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.compiler.StudentInput;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;

import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.Optional;

import javax.swing.*;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("lesson/")
public class LessonController {

    @PostMapping("save")
    public void getOutput(@RequestBody LessonFile lessonFile) {
        try (PrintWriter out = new PrintWriter(new FileWriter(lessonFile.getPath()))) {
            Gson gson = new Gson();
            String jsonString = gson.toJson(lessonFile.getLesson());
            out.write(jsonString);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PostMapping("directory/pick")
    public String selectFile(@RequestBody StudentInput studentInput) throws UnsupportedLookAndFeelException, ClassNotFoundException, InstantiationException, IllegalAccessException {
        UIManager.setLookAndFeel("com.sun.java.swing.plaf.windows.WindowsLookAndFeel");
        String defaultPath = Optional.ofNullable(studentInput.getItem()).orElseGet(() -> "undefined");
        JFileChooser f = defaultPath.equals("undefined") ? new JFileChooser() : new JFileChooser(studentInput.getItem());
        f.setFileSelectionMode(JFileChooser.FILES_ONLY);
        f.showSaveDialog(null);

        return Optional.ofNullable(f.getSelectedFile()).map(File::toString).orElseGet(()->"");
    }
}
