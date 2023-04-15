package pl.edu.agh.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import pl.edu.agh.backend.compiler.RustCompiler;
import pl.edu.agh.backend.compiler.RustFile;

import static org.springframework.test.util.AssertionErrors.*;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void correctFile() {
		RustCompiler rustCompiler = new RustCompiler();
		String code = """
				fn main() {
				    println!("Hello, world!");
				}
				""";

		String actual = rustCompiler.run(
				new RustFile("main.rs", "src/main/resources/rust", code)).output();

		assertEquals("", "Hello, world!", actual);
	}

	@Test
	void fileWithErrorOutput() {
		RustCompiler rustCompiler = new RustCompiler();
		String code = """
				fn main() {
				    println!("Hello, world!");
				    scdsjvuigk93iknef
				}
				""";

		int actual = rustCompiler.run(new RustFile("main.rs", "src/main/resources/rust", code)).code();

		assertEquals("", 1, actual);
	}
}
