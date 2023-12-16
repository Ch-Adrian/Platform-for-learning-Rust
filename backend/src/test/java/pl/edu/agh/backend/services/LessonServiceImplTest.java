package pl.edu.agh.backend.services;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import pl.edu.agh.backend.exceptions.LessonsNameConflictException;
import pl.edu.agh.backend.lesson.Lesson;
import pl.edu.agh.backend.lesson.LessonFile;
import pl.edu.agh.backend.lesson.dto.LessonInfoDTO;
import pl.edu.agh.backend.lesson.dto.LessonRenameDTO;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@RunWith(SpringRunner.class)
@SpringBootTest
class LessonServiceImplTest {

    @Autowired
    private LessonService lessonService;

    private static final String rootDir = "lessons";
    private static final String firstName = "test__test__test.json";
    private static final String secondName = "test__test__test(1).json";
    private static final String thirdName = "test__test__test(2).json";

    private static final Logger logger = LogManager.getLogger();


    @AfterEach
    @BeforeEach
    public void cleanUp() {
        this.deleteLessonIfExists(firstName);
        this.deleteLessonIfExists(secondName);
        this.deleteLessonIfExists(thirdName);
        this.deleteLessonIfExists("NewLesson.json");
    }

    @Test
    public void testCreateNewLesson() {
        // Given
        LessonFile lessonFile1 = new LessonFile();
        lessonFile1.setName(firstName);
        LessonFile lessonFile2 = new LessonFile();
        lessonFile2.setName(firstName);

        // When
        String actualFirstLessonName = lessonService.createNewLesson(lessonFile1);
        lessonService.saveLesson(actualFirstLessonName, lessonFile1.getLesson());
        String actualSecondLessonName = lessonService.createNewLesson(lessonFile2);

        // Then
        assertEquals(firstName, actualFirstLessonName);
        assertEquals(secondName, actualSecondLessonName);
    }

    @Test
    public void testGetLessonByName() {
        // Given
        Lesson createdLesson = new Lesson();
        lessonService.saveLesson(firstName, createdLesson);

        // When
        Lesson savedLesson = lessonService.getLessonByName(firstName);

        // Then
        assertEquals(createdLesson, savedLesson);
    }

    @Test
    public void testGetAllLessonsInfo() {
        // Given
        Lesson createdLesson = new Lesson();
        lessonService.saveLesson(firstName, createdLesson);
        lessonService.saveLesson(secondName, createdLesson);
        lessonService.saveLesson(thirdName, createdLesson);

        // When
        List<LessonInfoDTO> lessonInfoDTOList = lessonService.getAllLessonsInfo();

        // Then
        List<String> lessonNameList = lessonInfoDTOList.stream().map(LessonInfoDTO::getName).toList();
        assertTrue(lessonNameList.contains(firstName));
        assertTrue(lessonNameList.contains(secondName));
        assertTrue(lessonNameList.contains(thirdName));
    }

    @Test
    public void testGetDefaultLesson() {
        // Given
        String newLessonName = "NewLesson.json";

        // When
        LessonFile lessonFile = lessonService.getDefaultLesson();

        // Then
        assertNotNull(lessonFile.getLesson());
        assertEquals(newLessonName, lessonFile.getName());
    }

    @Test
    public void testSaveLesson() {
        // Given
        Lesson createdLesson = new Lesson();

        // When
        lessonService.saveLesson(firstName, createdLesson);

        // Then
        Lesson savedLesson = lessonService.getLessonByName(firstName);
        assertEquals(createdLesson, savedLesson);
    }

    @Test
    public void testRenameLesson() {
        // Given
        Lesson lesson = new Lesson();
        lessonService.saveLesson(firstName, lesson);
        LessonRenameDTO lessonRenameDTO = new LessonRenameDTO(secondName, false);

        // When
        lessonService.renameLesson(firstName, lessonRenameDTO);

        // Then
        List<String> lessonNameList = lessonService.getAllLessonsInfo().stream().map(LessonInfoDTO::getName).toList();
        assertFalse(lessonNameList.contains(firstName));
        assertTrue(lessonNameList.contains(secondName));
    }

    @Test
    public void testRenameLessonFailedWhenNameConflict() {
        // Given
        Lesson firstLesson = new Lesson();
        lessonService.saveLesson(firstName, firstLesson);
        Lesson secondLesson = new Lesson();
        lessonService.saveLesson(secondName, secondLesson);
        LessonRenameDTO lessonRenameDTO = new LessonRenameDTO(secondName, false);

        // When & Then
        assertThrows(LessonsNameConflictException.class, () -> lessonService.renameLesson(firstName, lessonRenameDTO));
    }

    @Test
    public void testRenameLessonForced() {
        // Given
        Lesson firstLesson = new Lesson();
        lessonService.saveLesson(firstName, firstLesson);
        Lesson secondLesson = new Lesson();
        lessonService.saveLesson(secondName, secondLesson);
        LessonRenameDTO lessonRenameDTO = new LessonRenameDTO(secondName, true);

        // When
        lessonService.renameLesson(firstName, lessonRenameDTO);

        // Then
        List<String> lessonNameList = lessonService.getAllLessonsInfo().stream().map(LessonInfoDTO::getName).toList();
        assertFalse(lessonNameList.contains(firstName));
        assertTrue(lessonNameList.contains(secondName));
    }

    @Test
    public void testDeleteLesson() {
        // Given
        Lesson firstLesson = new Lesson();
        lessonService.saveLesson(firstName, firstLesson);

        // When
        lessonService.deleteLesson(firstName);

        // Then
        List<String> lessonNameList = lessonService.getAllLessonsInfo().stream().map(LessonInfoDTO::getName).toList();
        assertFalse(lessonNameList.contains(firstName));
    }

    @Test
    public void testDeleteLessons() {
        // Given
        Lesson firstLesson = new Lesson();
        lessonService.saveLesson(firstName, firstLesson);
        Lesson secondLesson = new Lesson();
        lessonService.saveLesson(secondName, secondLesson);
        Lesson thirdLesson = new Lesson();
        lessonService.saveLesson(thirdName, thirdLesson);

        // When
        lessonService.deleteLessons(Arrays.asList(firstName, secondName, thirdName));

        // Then
        List<String> lessonNameList = lessonService.getAllLessonsInfo().stream().map(LessonInfoDTO::getName).toList();
        assertFalse(lessonNameList.contains(firstName));
        assertFalse(lessonNameList.contains(secondName));
        assertFalse(lessonNameList.contains(thirdName));
    }


    private void deleteLessonIfExists(String name) {
        try {
            Files.deleteIfExists(Path.of(rootDir + File.separator + name));
        } catch (IOException ex) {
            logger.error("Failed to delete lesson: " + name);
        }
    }

}