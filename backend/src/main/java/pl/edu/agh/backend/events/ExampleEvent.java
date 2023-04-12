package pl.edu.agh.backend.events;

import org.springframework.context.ApplicationEvent;

public class ExampleEvent extends ApplicationEvent {
    public ExampleEvent(Object source) {
        super(source);
    }
}
