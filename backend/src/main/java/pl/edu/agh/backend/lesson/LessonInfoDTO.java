package pl.edu.agh.backend.lesson;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class LessonInfoDTO {
    private String name;
    private LocalDateTime lastModified;
}
