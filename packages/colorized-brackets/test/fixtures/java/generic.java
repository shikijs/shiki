public class Box<T> {
  //                Y @colors
  // note: the angle brackets are not highlighted
  private T t;

  public void set(T t) { this.t = t; }
  //             P   P P             P @colors
  public T get() { return t; }
  //          PP P           P @colors
}
// @colors 0=Y