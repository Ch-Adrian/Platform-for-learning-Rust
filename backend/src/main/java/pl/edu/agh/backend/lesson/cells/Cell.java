package pl.edu.agh.backend.lesson.cells;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.serialization.JsonSubtype;
import pl.edu.agh.backend.serialization.JsonType;

@Getter
@Setter
@JsonType(
        property = "type",
        subtypes = {
                @JsonSubtype(clazz = TextCell.class, name = "TextCell"),
                @JsonSubtype(clazz = CodeCell.class, name = "CodeCell"),
                @JsonSubtype(clazz = ImmutableCodeCell.class, name = "ImmutableCodeCell"),
                @JsonSubtype(clazz = QuizCell.class, name = "QuizCell"),
                @JsonSubtype(clazz = TilesCell.class, name = "TilesCell")
        }
)
@JsonTypeInfo(use = JsonTypeInfo.Id.CLASS, include = JsonTypeInfo.As.PROPERTY, property = "profileType", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = CodeCell.class, name = "CodeCell"),
        @JsonSubTypes.Type(value = TextCell.class, name = "TextCell"),
        @JsonSubTypes.Type(value = ImmutableCodeCell.class, name = "ImmutableCodeCell"),
        @JsonSubTypes.Type(value = QuizCell.class, name = "QuizCell"),
        @JsonSubTypes.Type(value = TilesCell.class, name = "TilesCell")
})
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cell {
    @SerializedName("type")
    private String type;
    private String value;

    public Cell() {
        type = this.getClass().getSimpleName();
    }
}
