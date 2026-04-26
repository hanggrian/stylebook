### Ordered list number

Use lazy numbering in ordered lists. The prefix may start with any number, but
the rest should follow the first one.

**:material-star-four-points-outline:{ #accent } Before**

```md hl_lines="2-3 8-9"
1.  Foo
2.  Bar
3.  Baz

---

4.  Foo2
5.  Bar2
6.  Baz2
```

**:material-star-four-points:{ #accent } After**

```md hl_lines="2-3 8-9"
1.  Foo
1.  Bar
1.  Baz

---

4.  Foo2
4.  Bar2
4.  Baz2
```

### Ordered list spaces

The length of ordered list number and the following space should be even number.

**:material-star-four-points-outline:{ #accent } Before**

```md
1. Foo
1. Bar
1. Baz

---

10.  Foo2
10.  Bar2
10.  Baz2
```

**:material-star-four-points:{ #accent } After**

```md
1.  Foo
1.  Bar
1.  Baz

---

10. Foo2
10. Bar2
10. Baz2
```

### Unnecessary blank lines in list

If no list item is expanded with a paragraph, remove blank lines between them.
A blank line between one list item and a nested list is not checked.

**:material-star-four-points-outline:{ #accent } Before**

```md hl_lines="2 4"
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
