package pl.edu.agh.backend.lesson.cells;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Cell {
    @SerializedName("type")
    private String type;
    private String value;

    public Cell() {
        type = this.getClass().getSimpleName();
    }
}
