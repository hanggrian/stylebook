### Horizontal alignment

![toml](https://img.shields.io/badge/toml-align--entries-9c4121)
![toml](https://img.shields.io/badge/toml-align--comments-9c4121)

Entries and comments are not aligned horizontally.

**:material-star-four-points-outline:{ #accent } Before**

```toml
[parent]
foo  = "bar"   # comment
foo2 = "bar2"  # comment2
```

**:material-star-four-points:{ #accent } After**

```toml
[parent]
foo = "bar"  # comment
foo2 = "bar2"  # comment2
```
