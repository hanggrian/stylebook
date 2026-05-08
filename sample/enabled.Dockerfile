# DL3001: Illegal interactive command
# DL3006: Missing tag
# DL3007: Using 'latest' tag instead of a pinned version
# DL3061: Must start with FROM
FROM ubuntu:26.04
RUN top2

# DL3000: Use absolute WORKDIR
# DL3003: Use WORKDIR to switch to a directory
WORKDIR /myapp
RUN echo "hello"

# DL3002: Last USER should not be root
USER myname

# DL3004: Do not use sudo (use USER directive or gosu)
# DL3009: Delete apt-get lists after installing
# DL3010: Use ADD for archives (vs COPY); incorrect usage
# DL3014: Use the -y switch with apt-get
# DL3015: Avoid additional packages (--no-install-recommends)
RUN apt-get update && apt-get install telnet -y

# DL3011: Out-of-range port
EXPOSE 65535

# DL3012: No duplicate HEALTHCHECK
HEALTHCHECK CMD /bin/healthcheck

# DL3017: Do not use apk upgrade
# DL3019: Use the --no-cache switch to avoid the need to use --update
# DL3042: Need --no-cache-dir with pip install
# DL3059: Merge multiple executions
RUN pip install django && \
  npm install -g express lodash react && \
  apk update && \
  apk upgrade && \
  apk add --update curl bash

# DL3020: Use COPY instead of ADD for files and folders
# DL3021: COPY target dir must have trailing slash
# DL3022: COPY --from should reference a previously defined FROM alias
# DL3023: COPY should not reference self
# DL3024: No duplicate FROM aliases
# DL3045: COPY target dir needs WORKDIR
FROM debian:jesse as build
FROM debian:jesse as another-alias
WORKDIR /myapp
COPY ./config.json /app/config.json
COPY package.json yarn.lock my_app/
COPY --from=build /app /app

# DL3025: Use JSON notation for CMD and ENTRYPOINT arguments
ENTRYPOINT ["python3", "/app/main.py"]

# DL3026: Use only an allowed registry in the FROM command
FROM randomguy/python:3.6

# DL3027: Do not use apt
RUN apt-get install libboost-dev-all -y

# DL3029: Do not use --platform
FROM busybox:40

# DL3030: Use the -y switch with yum
# DL3032: Clean yum after install
RUN yum install httpd -y

# DL3031: Do not use yum upgrade
# DL3034: Use the -y switch with zypper
FROM centos:21
RUN yum update -y && \
  zypper install httpd -y

# DL3035: Do not use zypper upgrade
# DL3036: Clean zypper after install
FROM opensuse/leap:15.2
RUN zypper update -y

# DL3038: Use the -y switch with dnf
# DL3039: Do not use dnf update
# DL3040: Clean dnf after install
FROM fedora:32
RUN dnf update && \
  dnf install httpd -y

# DL3043: Do not chain ONBUILD with FROM or MAINTAINER
ONBUILD ADD . /app/src
ONBUILD RUN /usr/local/bin/python-build --dir /app/src

# DL3046: useradd need -l flag
# DL3047: wget need --progress flag
RUN useradd -l -u 123456 foobar && \
  wget --progress=dot:giga https://example.com/big_file.tar

# DL3048: Invalid label key
LABEL valid-key.label="bar"

# DL3060: Clean yarn after install
RUN yarn install

# DL3063: Reserved word
FROM debian:bullseye-20260421 AS scratch

# DL4001: Pick wget or curl
RUN wget --progress=dot:giga http://google.com && \
  wget --progress=dot:giga http://bing.com

# DL4003: Multiple CMD instructions
# DL4004: Multiple ENTRYPOINT instructions
CMD ["/bin/true"]
ENTRYPOINT ["/bin/false"]

# DL4005: Use SHELL command
SHELL ["/bin/bash", "-c"]

# DL4006: Need SHELL command
SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN wget --progress=dot:giga -O - https://some.site | wc -l > /number

# SC2046, SC2086: Need quotes
RUN echo "index-url = http://$(netstat):3141/root/pypi/" >> /root/.pip/pip.conf
RUN wget --progress=dot:giga "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-${GCLOUD_VERSION}-linux-x86_64.tar.gz"
