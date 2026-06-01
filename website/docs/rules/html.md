### Duplicate ID

![html](https://shields.io/badge/html-id--unique-E34F26)

IDs should be unique.

**:material-star-four-points-outline:{ #accent } Before**

```html hl_lines="2"
<div id="foo">Foo</div>
<div id="foo">Bar</div>
```

**:material-star-four-points:{ #accent } After**

```html hl_lines="2"
<div id="foo">Foo</div>
<div id="bar">Bar</div>
```

### Missing component

![html](https://shields.io/badge/html-alt--require-E34F26)
![html](https://shields.io/badge/html-button--type--require-E34F26)
![html](https://shields.io/badge/html-frame--title--require-E34F26)
![html](https://shields.io/badge/html-html--lang--require-E34F26)
![html](https://shields.io/badge/html-input--requires--label-E34F26)
![html](https://shields.io/badge/html-main--require-E34F26)
![html](https://shields.io/badge/html-meta--charset--require-E34F26)
![html](https://shields.io/badge/html-meta--description--require-E34F26)
![html](https://shields.io/badge/html-meta--viewport--require-E34F26)
![html](https://shields.io/badge/html-src--not--empty-E34F26)
![html](https://shields.io/badge/html-title--require-E34F26)

Many tags require specific attributes.

**:material-star-four-points-outline:{ #accent } Before**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Foo</title>
  </head>
  <body>
    <button>Click me</button>
    <input type="text"/>
    <img src=""/>
  </body>
</html>
```

**:material-star-four-points:{ #accent } After**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="description" content="Foo">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foo</title>
  </head>
  <body>
    <button type="button">Click me</button>
    <input type="text" aria-label="Input"/>
    <img src="foo.png" alt="Foo image"/>
  </body>
</html>
```

## Declaring

### Lowercase syntax

![html](https://shields.io/badge/html-attr--lowercase-E34F26)
![html](https://shields.io/badge/html-tagname--lowercase-E34F26)

Tags and attributes should be lowercase.

**:material-star-four-points-outline:{ #accent } Before**

```html
<DIV CLASS="foo">Foo</DIV>
```

**:material-star-four-points:{ #accent } After**

```html
<div class="foo">Foo</div>
```
