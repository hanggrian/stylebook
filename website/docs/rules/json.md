> `jsonlint` doesn't have built-in rules.

### Blank line

No blank lines allowed.

**:material-star-four-points-outline:{ #accent } Before**

```json
{
  "foo": "bar",

  "baz": "qux"
}
```

**:material-star-four-points:{ #accent } After**

```json
{
  "foo": "bar",
  "baz": "qux"
}
```

### Trailing comma

No trailing commas in JSON5 files.

**:material-star-four-points-outline:{ #accent } Before**

```json5
{
  "foo": "bar",
}
```

**:material-star-four-points:{ #accent } After**

```json5
{
  "foo": "bar"
}
```

### Comment

No comments allowed in JSONC files.

**:material-star-four-points-outline:{ #accent } Before**

```jsonc
{
  // This is a comment.
  "foo": "bar"
}
```

**:material-star-four-points:{ #accent } After**

```json
{
  "foo": "bar"
}
```
