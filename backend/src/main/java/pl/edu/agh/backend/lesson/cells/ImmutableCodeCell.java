package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImmutableCodeCell extends CodeCell {
    private String mutableString;
    private String template;

    public static ImmutableCodeCell getDefault() {
        ImmutableCodeCell immutableCodeCell = new ImmutableCodeCell();
        immutableCodeCell.setValue("""
                fn main() {
                	/*TO_FILL*/
                }""");
        immutableCodeCell.setTemplate("""
                fn main() {
                	/*TO_FILL*/
                }""");
        immutableCodeCell.setMutableString("/*TO_FILL*/");
        return immutableCodeCell;
    }
}
