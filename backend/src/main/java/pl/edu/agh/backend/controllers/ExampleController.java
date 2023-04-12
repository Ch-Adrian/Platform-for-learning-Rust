package pl.edu.agh.backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.edu.agh.backend.models.Example;
import pl.edu.agh.backend.services.ExampleService;

import java.util.List;

@RestController
@RequestMapping("/examples")
public class ExampleController {

    private ExampleService exampleService;

    public ExampleController(ExampleService exampleService){
        super();
        this.exampleService = exampleService;
    }

    @GetMapping()
    public List<Example> getExamples(){
        return exampleService.getAllExamples();
    }

    @GetMapping("{_id}")
    public ResponseEntity<Example> getExample(@PathVariable("_id") int _id){
        return new ResponseEntity<>(exampleService.getExampleById(_id), HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<Example> createExample(@RequestBody Example example){
        return new ResponseEntity<>(exampleService.saveExample(example), HttpStatus.CREATED);
    }

    @PutMapping("{_id}")
    public ResponseEntity<Example> updateExample(@PathVariable("_id") int _id, @RequestBody Example exampleDetails){
        return new ResponseEntity<>(exampleService.updateExample(exampleDetails, _id), HttpStatus.OK);
    }

}
