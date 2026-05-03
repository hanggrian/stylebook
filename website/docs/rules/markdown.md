### Code fence style

![markdownlint](https://img.shields.io/badge/md-code--fence--style-fff)

Backticks style over tilde in code fences.

**:material-star-four-points-outline:{ #accent } Before**

```md hl_lines="1 3"
~~~js
console.log("Hello, world!");
~~~
```

**:material-star-four-points:{ #accent } After**

``````md hl_lines="1 3"
```js
console.log("Hello, world!");
```
``````

### Heading style

![markdownlint](https://img.shields.io/badge/md-heading--style-fff)

ATX heading style over Setext.

**:material-star-four-points-outline:{ #accent } Before**

```md
Big headline
============
```

**:material-star-four-points:{ #accent } After**

```md
# Big headline
```

### Highlight style

![markdownlint](https://img.shields.io/badge/md-emphasis--style-fff)
![markdownlint](https://img.shields.io/badge/md-strong--style-fff)

Emphasis and styles use asterisks first. In nested hightlight, use any
non-asterisk character as the outer style.

**:material-star-four-points-outline:{ #accent } Before**

```md
Hello **_World_**
```

**:material-star-four-points:{ #accent } After**

```md
Hello __*World*__
```

### Horizontal line style

![markdownlint](https://img.shields.io/badge/md-horizontal--rule--style-fff)

Triple dash style over asterisk and underscore in horizontal lines.

**:material-star-four-points-outline:{ #accent } Before**

```md hl_lines="3"
Foo

***

Bar
```

**:material-star-four-points:{ #accent } After**

```md hl_lines="3"
Foo

---

Bar
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

### Ordered list style

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

### Table style

![markdownlint](https://img.shields.io/badge/md-table--pipe--style-fff)
![markdownlint](https://img.shields.io/badge/md-table--column--count-fff)
![markdownlint](https://img.shields.io/badge/md-table--column--style-fff)

Pipes are present with short column style. Exactly one space padding on each
side of cell.

**:material-star-four-points-outline:{ #accent } Before**

```md
Foo | Bar  | Baz
--- | ---- | ----
Qux | Quux | Quuz
```

**:material-star-four-points:{ #accent } After**

```md
| Foo | Bar | Baz |
| --- | --- | --- |
| Qux | Quux | Quuz |
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

### Unordered list style

![markdownlint](https://img.shields.io/badge/md-ul--style-fff)

Dash style over asterisk and plus in unordered lists.

**:material-star-four-points-outline:{ #accent } Before**

```md
* Foo
+ Bar
```

**:material-star-four-points:{ #accent } After**

```md
- Foo
- Bar
```
