package pl.edu.agh.backend.compiler;

public class Input {
    public String getItem() {
        return item;
    }

    private String item;

    public Input() {
        item = "";
    }
    public Input(String item) {
        this.item = item;
    }
}
