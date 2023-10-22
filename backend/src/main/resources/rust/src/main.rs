use rand::Rng;

fn main() {
  let mut sum = 0;  
  for i in 1..10 {  
    sum += i;  
  }  
  println!("sum: {}", sum);  
  println!("dupa: {}", dupa());  

  let mut rng = rand::thread_rng();

    let n1: u8 = rng.gen();
    let n2: u16 = rng.gen();
    println!("Random u8: {}", n1);
    println!("Radndom u16: {}", n2);
    println!("{}",dupa());
}

fn dupa() -> u8 {
  let sd = 23;
    return 23;
}