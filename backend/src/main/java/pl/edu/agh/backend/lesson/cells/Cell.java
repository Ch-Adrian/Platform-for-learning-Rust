package pl.edu.agh.backend.lesson.cells;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public abstract class AbstractCell {
    @SerializedName("type")
    private String type;
    private String value;

    public AbstractCell() {
        type = this.getClass().getSimpleName();
    }
}
