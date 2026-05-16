## Declaring

### Lowercase syntax

![css](https://img.shields.io/badge/css-function--name--case-663399)
![css](https://img.shields.io/badge/css-selector--type--case-663399)
![css](https://img.shields.io/badge/css-value--keyword--case-663399)
![css](https://img.shields.io/badge/css-at--rule--name--case-663399)
![css](https://img.shields.io/badge/css-color--hex--case-663399)
![css](https://img.shields.io/badge/css-media--feature--name--case-663399)
![css](https://img.shields.io/badge/css-property--case-663399)
![css](https://img.shields.io/badge/css-selector--pseudo--class--case-663399)
![css](https://img.shields.io/badge/css-selector--pseudo--element--case-663399)
![css](https://img.shields.io/badge/css-unit--case-663399)

Use lowercase for all CSS syntax.

**:material-star-four-points-outline:{ #accent } Before**

```css
BODY {
  BACKGROUND-COLOR: RED;
}
```

**:material-star-four-points:{ #accent } After**

```css
body {
  background-color: red;
}
```

## Formatting

### Indent style

![css](https://img.shields.io/badge/css-indentation-663399)

Use two spaces for indentation.

**:material-star-four-points-outline:{ #accent } Before**

```css hl_lines="2"
body {
    background-color: red;
}
```

**:material-star-four-points:{ #accent } After**

```css hl_lines="2"
body {
  background-color: red;
}
```

## Trimming

### Duplicate blank line

![css](https://img.shields.io/badge/css-max--empty--lines-663399)

No more than one consecutive blank line.

**:material-star-four-points-outline:{ #accent } Before**

```css hl_lines="3-4"
body {
  background-color: red;


  text-align: center;
}
```

**:material-star-four-points:{ #accent } After**

```css hl_lines="3"
body {
  background-color: red;

  text-align: center;
}
```
