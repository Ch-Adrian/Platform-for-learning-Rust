package pl.edu.agh.backend.services;

import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class LessonServiceImplTest {

    @Autowired
    LessonService lessonService;

    private static final String rootDir = "lessons";
    private static final String newLessonName = "NewLesson";

    private static final Logger logger = LogManager.getLogger();


    @AfterEach
    @BeforeEach
    public void cleanUp() {
        String firstName = "test__test__test.json";
        this.deleteLessonIfExists(firstName);
        String secondName = "test__test__test(1).json";
        this.deleteLessonIfExists(secondName);
    }

    @Test
    public void testCreateNewLesson() {
        // Given
        String expectedFirstLessonName = "test__test__test.json";
        String expectedSecondLessonName = "test__test__test(1).json";

        // when
        LessonFile lessonFile1 = new LessonFile();
        lessonFile1.setName("test__test__test.json");
        String actualFirstLessonName = lessonService.createNewLesson(lessonFile1);
        lessonService.saveLesson(actualFirstLessonName, lessonFile1.getLesson());
        LessonFile lessonFile2 = new LessonFile();
        lessonFile2.setName("test__test__test.json");
        String actualSecondLessonName = lessonService.createNewLesson(lessonFile2);

        // Then
        assertEquals(expectedFirstLessonName, actualFirstLessonName);
        System.out.println(actualFirstLessonName);
        System.out.println(actualSecondLessonName);
        assertEquals(expectedSecondLessonName, actualSecondLessonName);
    }

    private void deleteLessonIfExists(String name) {
        try {
            Files.deleteIfExists(Path.of(rootDir + File.separator + name));
        } catch (IOException ex) {
            logger.error("Failed to delete lesson: " + name);
        }
    }

}