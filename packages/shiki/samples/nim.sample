type
  Animal* = object
    name*, species*: string
    age: int

proc sleep*(a: var Animal) =
  a.age += 1

proc dead*(a: Animal): bool =
  result = a.age > 20

var carl: Animal
carl = Animal(name : "Carl",
              species : "L. glama",
              age : 12)

let joe = Animal(name : "Joe",
                 species : "H. sapiens",
                 age : 23)

assert(not carl.dead)
for i in 0..10:
  carl.sleep()
assert carl.deadtype
  Animal* = object
    name*, species*: string
    age: int

proc sleep*(a: var Animal) =
  a.age += 1

proc dead*(a: Animal): bool =
  result = a.age > 20

var carl: Animal
carl = Animal(name : "Carl",
              species : "L. glama",
              age : 12)

let joe = Animal(name : "Joe",
                 species : "H. sapiens",
                 age : 23)

assert(not carl.dead)
for i in 0..10:
  carl.sleep()
assert carl.dead

# From https://nim-by-example.github.io/types/objects/
