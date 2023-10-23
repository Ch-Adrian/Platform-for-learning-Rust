package pl.edu.agh.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import pl.edu.agh.backend.compiler.Status;
import pl.edu.agh.backend.configurations.CommendsConfiguration;
import pl.edu.agh.backend.services.CompilerService;
import pl.edu.agh.backend.compiler.RustFile;
import pl.edu.agh.backend.factories.CommandsFactory;

import static org.springframework.test.util.AssertionErrors.*;

@SpringBootTest
class BackendApplicationTests {

	private final CommandsFactory commandsFactory;

	BackendApplicationTests() {
		this.commandsFactory = new AnnotationConfigApplicationContext(CommendsConfiguration.class).getBean(CommandsFactory.class);
	}


	@Test
	void correctFile() {
		CompilerService compilerService = new CompilerService();
		String code = """
				fn main() {
				    println!("Hello, world!");
				}
				""";

		String actual = compilerService.run(RustFile.builder()
							.codeFileName("main.rs")
							.directory("src/main/resources/rust")
							.content(code)
							.commandsFactory(commandsFactory)
							.build()).getProgramOutput();

		assertEquals("", "Hello, world!\n", actual); // There is always empty line in the end of an output.
	}

	@Test
	void fileWithErrorOutput() {
		CompilerService compilerService = new CompilerService();
		String code = """
				fn main() {
				    println!("Hello, world!");
				    scdsjvuigk93iknef
				}
				""";

		Status actual = compilerService.run(RustFile.builder()
							.codeFileName("main.rs")
							.directory("src/main/resources/rust")
							.content(code)
							.commandsFactory(commandsFactory)
							.build()).getStatus();

		assertEquals("", Status.ERROR, actual);
	}
}
