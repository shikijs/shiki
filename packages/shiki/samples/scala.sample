class Date(y: Int, m: Int, d: Int) extends Ord:
  // previous decls here

  def <(that: Any): Boolean = that match
    case d: Date =>
      (year < d.year) ||
      (year == d.year && (month < d.month ||
                         (month == d.month && day < d.day)))

    case _ => sys.error("cannot compare " + that + " and a Date")
  end <
end Date

// From https://docs.scala-lang.org/tutorials/scala-for-java-programmers.html
