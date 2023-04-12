package pl.edu.agh.backend.models;

public class Example {
    private int _id;
    private String name;

    public Example(int _id, String name){
        this._id = _id;
        this.name = name;
    }

    public String getName(){
        return this.name;
    }

}
