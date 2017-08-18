{% from "backend/php/map.jinja"  import php with context %}

php-dev:
  pkg.installed:
    - name: {{ php.dev_pkg }}

php-pear:
  pkg.installed:
    - name : {{ php.pear_pkg }}

# Adding Cyrus SASL API Implementation to OS
# http://stackoverflow.com/questions/22102326
php-pecl-sasl:
  pkg.installed:
    - name: {{ php.sasl_pkg }}

{% if grains['os_family'] == 'Debian' %}

# magically needed
# https://github.com/mongodb/mongo-php-driver/issues/138
pkg-config:
  pkg.installed:
    - name: pkg-config

{% endif %}


{% if grains['os_family'] == 'Suse' %}

# Fixing include path for PECL for Suse
php-pecl-include:
  file.symlink:
    - name: /usr/include/php
    - target: /usr/include/php5
    - user: root
    - group: root
    - mode: 755
    - unless: test -h /usr/include/php

{% endif %}
