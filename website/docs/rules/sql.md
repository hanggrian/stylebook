## Declaring

### Lowercase identifiers

![sql](https://shields.io/badge/sql-capitalisation--identifiers-003B57)

SQL identifiers should be lowercase.

**:material-star-four-points-outline:{ #accent } Before**

```sql hl_lines="2-3"
CREATE TABLE Users (
  Id INT PRIMARY KEY,
  Name VARCHAR(255) NOT NULL
);
```

**:material-star-four-points:{ #accent } After**

```sql hl_lines="2-3"
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

### Lowercase functions

![sql](https://shields.io/badge/sql-capitalisation--functions-003B57)

SQL functions should be lowercase.

**:material-star-four-points-outline:{ #accent } Before**

```sql hl_lines="1"
SELECT COUNT(*)
  FROM users
  WHERE active = TRUE;
```

**:material-star-four-points:{ #accent } After**

```sql hl_lines="1"
SELECT count(*)
  FROM users
  WHERE active = TRUE;
```

### Uppercase keywords

![sql](https://shields.io/badge/sql-capitalisation--keywords-003B57)

SQL keywords should be uppercase.

**:material-star-four-points-outline:{ #accent } Before**

```sql
select *
  from users
  where id = 1;
```

**:material-star-four-points:{ #accent } After**

```sql
SELECT *
  FROM users
  WHERE id = 1;
```

### Uppercase literals

![sql](https://shields.io/badge/sql-capitalisation--literals-003B57)

SQL literals should be uppercase.

**:material-star-four-points-outline:{ #accent } Before**

```sql hl_lines="3"
SELECT *
  FROM users
  WHERE active = true;
```

**:material-star-four-points:{ #accent } After**

```sql hl_lines="3"
SELECT *
  FROM users
  WHERE active = TRUE;
```

### Uppercase types

![sql](https://shields.io/badge/sql-capitalisation--types-003B57)

SQL types should be uppercase.

**:material-star-four-points-outline:{ #accent } Before**

```sql hl_lines="2-3"
CREATE TABLE users (
  id int PRIMARY KEY,
  name varchar(255) NOT NULL
);
```

**:material-star-four-points:{ #accent } After**

```sql hl_lines="2-3"
CREATE TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```
