<!-- first-line-heading: badges may be used before headings -->
[![Badge](https://img.shields.io/badge/badge-static-blue)](https://google.com/)

# Heading 1

<!-- blanks-around-tables, blanks-around-fences: may be inside a list -->

- ```json
  {
    "key": "value"
  }
  ```
- | a | b | c |
  | - | - | - |
  | 1 | 2 | 3 |

<!-- code-block-style: MkDocs use heavy indentation -->

!!! admonition "Title"

    <div class="grid cards" markdown>

    - <div></div>
    - <div></div>
    </div>

<!-- heading-increment: smaller headings are allowed -->

### Heading 3

## Heading 2

<!-- list-marker-space: replaced with custom -->

- Lorem

1.  Ipsum

<!-- no-blanks-blockquote: quotes may be separated -->

> Lorem

> Ipsum

<!-- no-emphasis-as-heading: duplicate headings may prefer bold text -->

**Before**

**After**

**Before**

**After**

<!-- no-inline-html: no way to control span without HTML table -->

<table>
  <thead>
    <tr>
      <th>a</th>
      <th>b</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">1</td>
      <td>1A</td>
    </tr>
    <tr>
      <td>1B</td>
    </tr>
    <tr>
      <td rowspan="2">2</td>
      <td>2A</td>
    </tr>
    <tr>
      <td>2B</td>
    </tr>
  </tbody>
</table>

<!-- ol-prefix: replaced with custom -->

6.  Lorem
6.  Ipsum

<!--
  no-missing-space-closed-atx, no-multiple-space-closed-atx: impossible with
  non-closed ATX
-->

# Heading

<!-- required-headings: heading structure is not checked -->

## Lorem

# Ipsum

<!-- proper-names: certain names may not be capitalized -->

Google can refer to a company, or google as an object.
