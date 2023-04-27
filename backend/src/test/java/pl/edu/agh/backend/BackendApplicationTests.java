package pl.edu.agh.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import pl.edu.agh.backend.services.CompilerService;
import pl.edu.agh.backend.compiler.RustFile;

import static org.springframework.test.util.AssertionErrors.*;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void correctFile() {
		CompilerService compilerService = new CompilerService();
		String code = """
				fn main() {
				    println!("Hello, world!");
				}
				""";

		String actual = compilerService.run(
				new RustFile("main.rs", "src/main/resources/rust", code)).content();

		assertEquals("", "Hello, world!", actual);
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

		int actual = compilerService.run(new RustFile("main.rs", "src/main/resources/rust", code)).code();

		assertEquals("", 1, actual);
	}
}
