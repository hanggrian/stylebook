FROM ubuntu:26.04

# DL3008: Pin version when installing
# DL3013: Pin versions in pip install
# DL3016: Pin versions in npm install
# DL3018: Pin versions in apk add
# DL3028: Pin versions in gem
# DL3033: Pin versions in yum
# DL3037: Pin versions in zypper
# DL3041: Pin versions in dnf
# DL3062: Pin versions in go
RUN apt-get install telnet -y --no-install-recommends --no-cache && \
  pip install django --no-cache-dir && \
  npm install -g express lodash react && \
  apk update && \
  apk upgrade && \
  apk --no-cache add --update curl bash && \
  gem install bundler && \
  yum install httpd -y && \
  yum clean all && \
  zypper install httpd -y && \
  zypper clean && \
  dnf install httpd -y && \
  dnf clean all && \
  go install foobar
