package pl.edu.agh.backend.lesson.cells;

import lombok.Getter;
import lombok.Setter;
import pl.edu.agh.backend.lesson.cells.records.Tile;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class TilesCell extends Cell {
    private String tileMark;
    private final List<Tile> tiles = new ArrayList<>();

    public void addTile(Tile tile) {
        this.tiles.add(tile);
    }

    public static TilesCell getDefault() {
        TilesCell tilesCell = new TilesCell();
        tilesCell.setValue("To jest komórka typu kafelki!");

        Tile tile1 = new Tile(1, "Jeden Kafelek");
        Tile tile2 = new Tile(2, "Drugi Kafelek");
        Tile tile3 = new Tile(3, "Trzeci Kaflek");
        tilesCell.addTile(tile1);
        tilesCell.addTile(tile2);
        tilesCell.addTile(tile3);
        return tilesCell;
    }
}
