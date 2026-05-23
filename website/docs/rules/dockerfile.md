### Command join

![dockerfile](https://img.shields.io/badge/dockerfile-DL3059-2496ED)

Commands in a Dockerfile should be joined together to reduce the number of
layers in the resulting image.

**:material-star-four-points-outline:{ #accent } Before**

```dockerfile
RUN apt-get update
RUN apt-get install -y curl
```

**:material-star-four-points:{ #accent } After**

```dockerfile
RUN apt-get update && \
  apt-get install -y curl
```

### Missing yes flag

![dockerfile](https://img.shields.io/badge/dockerfile-DL3014-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3030-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3033-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3034-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3037-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3038-2496ED)
![dockerfile](https://img.shields.io/badge/dockerfile-DL3041-2496ED)

Installing a package in a Dockerfile needs a confirmation flag to avoid
interactive prompts.

**:material-star-four-points-outline:{ #accent } Before**

```dockerfile
RUN apt-get install curl
```

**:material-star-four-points:{ #accent } After**

```dockerfile
RUN apt-get install -y curl
```
