package pl.edu.agh.backend.exceptions;

public class LessonNotFoundException extends RuntimeException {

    private final String message;

    public LessonNotFoundException(String fileName) {
        this.message = "Lesson do not exists: " + fileName;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
