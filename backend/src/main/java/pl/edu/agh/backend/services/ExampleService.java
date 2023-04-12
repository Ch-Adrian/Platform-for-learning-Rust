package pl.edu.agh.backend.services;

import org.springframework.stereotype.Service;
import pl.edu.agh.backend.exceptions.ResourceNotFoundException;
import pl.edu.agh.backend.models.Example;

import java.util.ArrayList;
import java.util.List;

@Service
public class ExampleService {

    private ArrayList<Example> arrayList;

    public ExampleService(){
        super();
        this.arrayList = new ArrayList<>();
        this.arrayList.add(new Example(0, "ExampleName0"));
    }

    public Example saveExample(Example example){
        int _id = this.arrayList.size();
        this.arrayList.add(new Example(_id, example.getName()));
        return this.arrayList.get(_id);
    }

    public Example getExampleById(int _id){
        if(this.arrayList.size() <= _id || _id < 0) throw new ResourceNotFoundException(String.format("Example of id: %s is not found.", _id));
        return this.arrayList.get(_id);
    }

    public List<Example> getAllExamples(){
        return this.arrayList;
    }

    public Example updateExample(Example example, int _id){
        if(this.arrayList.size() <= _id || _id < 0) throw new ResourceNotFoundException(String.format("Example of id: %s is not found.", _id));
        this.arrayList.set(_id, example);
        return this.arrayList.get(_id);
    }


}
