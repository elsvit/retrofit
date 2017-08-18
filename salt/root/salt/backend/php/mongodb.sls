{% from "backend/php/map.jinja" import php with context %}

{% set version = salt['pillar.get']('php:mongodb_version', none) %}

include:
  - backend.php.pecl

php-mongodb:
  pecl.installed:
    - name: {{ php.mongodb_pecl }}
    - require:
      - sls: backend.php.pecl
    - defaults: True
{% if version is not none %}
    - version: {{ version }}
{% endif %}

php-mongodb-conf:
  file.managed:
    - name: {{ php.ext_conf_path }}/{{ php.mongodb_pecl }}.ini
    - contents: |
        extension={{ php.mongodb_ext }}
    - require:
      - pecl: php-mongodb

{% if grains['os_family'] == 'Debian' %}

php-mongodb-enable:
  cmd.run:
    - name: php5enmod {{ php.mongodb_pecl }}
    - onlyif: which php5enmod
    - unless: php --ini | grep mongo
    - require:
      - file: php-mongodb-conf

{% endif %}