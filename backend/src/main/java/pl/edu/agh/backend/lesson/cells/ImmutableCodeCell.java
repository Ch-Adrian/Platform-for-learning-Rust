package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImmutableCodeCell extends CodeCell {
    private String mutableString;

    public static ImmutableCodeCell getDefault() {
        ImmutableCodeCell immutableCodeCell = new ImmutableCodeCell();
        immutableCodeCell.setValue("""
                fn main() {
                	/*TO_FILL*/
                }
                """);
        immutableCodeCell.setReference("""
                fn main() {
                	/*TO_FILL*/
                }
                """);
        immutableCodeCell.setMutableString("/*TO_FILL*/");
        return immutableCodeCell;
    }
}
