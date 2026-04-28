### Decimal values

![toml](https://img.shields.io/badge/toml-float--values-9c4121)

Omit leading and trailing zeros in decimal values.

**:material-star-four-points-outline:{ #accent } Before**

```yaml
foo: 0.5
bar: 1.0
```

**:material-star-four-points:{ #accent } After**

```yaml
foo: .5
bar: 1
```

!!! tip

    This rule is inverted on JSON5.

### Double quotes

![yaml](https://img.shields.io/badge/yaml-quoted--strings-cb171e)

Double quotes for strings. Quotes are optional in YAML, but must not be single
quotes, unless the string itself contains double quotes.

**:material-star-four-points-outline:{ #accent } Before**

```yaml
foo: 'foo'
bar: "\"bar\""
```

**:material-star-four-points:{ #accent } After**

```yaml
foo: "foo"
bar: '"bar"'
```

!!! warning

    Expressions in GitHub Actions must be wrapped in single quotes.

### Duplicate blank line

![markdownlint](https://img.shields.io/badge/md-no--multiple--blanks-fff)

No more than one consecutive blank line.

**:material-star-four-points-outline:{ #accent } Before**

```md hl_lines="2-3"
Foo


Bar
```

**:material-star-four-points:{ #accent } After**

```md hl_lines="2"
Foo

Bar
```

!!! tip

    In JSON, no blank lines are allowed at all.

### Indent style

![markdownlint](https://img.shields.io/badge/md-list--indent-fff)
![markdownlint](https://img.shields.io/badge/md-ul--indent-fff)

Spaces over hard tabs for indentation, default 2 spaces.

**:material-star-four-points-outline:{ #accent } Before**

```md
- Foo
    - Bar
        - Baz
```

**:material-star-four-points:{ #accent } After**

```md
- Foo
  - Bar
    - Baz
```

### Line length

![markdownlint](https://img.shields.io/badge/md-list--length-fff)
![toml](https://img.shields.io/badge/toml-column--width-9c4121)
![yaml](https://img.shields.io/badge/yaml-line--length-cb171e)

The column limit is 80 characters.

**:material-star-four-points-outline:{ #accent } Before**

```md
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum.
```

**:material-star-four-points:{ #accent } After**

```md
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.
Sed sit amet ipsum.
```

!!! tip

    There are some exceptions:

    - URLs are allowed to exceed the limit in most formats.
    - In Markdown, headings, tables and inline HTML are also fine.
    - Ignored in JSON.

### Trailing comma

![toml](https://img.shields.io/badge/toml-array--trailing--comma-9c4121)

In languages that support trailing commas, they should be used in multi-line
structures.

**:material-star-four-points-outline:{ #accent } Before**

```toml hl_lines="4"
[parent]
child = [
    "foo",
    "bar"
]
```

**:material-star-four-points:{ #accent } After**

```toml hl_lines="4"
[parent]
child = [
    "foo",
    "bar",
]
```

### Trailing newline

![markdownlint](https://img.shields.io/badge/md-single--trailing--newline-fff)
![toml](https://img.shields.io/badge/toml-trailing--newline-9c4121)

Files should end with a single newline character.

**:material-star-four-points-outline:{ #accent } Before**

```md
Foo
```

**:material-star-four-points:{ #accent } After**

```md hl_lines="2"
Foo
↵
```

### Trailing space

![markdownlint](https://img.shields.io/badge/md-no--trailing--spaces-fff)
![yaml](https://img.shields.io/badge/yaml-trailing--spaces-cb171e)

No trailing spaces at the end of lines.

**:material-star-four-points-outline:{ #accent } Before**

```md
Foo␣
```

**:material-star-four-points:{ #accent } After**

```md
Foo
```
