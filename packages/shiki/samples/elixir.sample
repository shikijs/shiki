# [] can be used, first match returned
1 = [a: 1, b: 2, a: 3][:a]

# [] missing value is nil
nil = [a: 1, b: 2, a: 3][:c]

# Keyword get also works
1 = Keyword.get([a: 1, b: 2, a: 3], :a)

# missing value is nil
nil = Keyword.get([a: 1, b: 2, a: 3], :c)

# an optional default value can be specified
# for missing keys
"missing" = Keyword.get([a: 1, b: 2, a: 3], :c, "missing")

# Keyword.take returns a list of matching pairs
[a: 1, a: 3] = Keyword.take([a: 1, b: 2, a: 3], [:a])

[] = Keyword.take([a: 1, b: 2, a: 3], [:c])

# dot syntax does NOT work
# results in compile error
[a: 1, b: 2, a: 3].a

# From https://elixir-examples.github.io/single-page
