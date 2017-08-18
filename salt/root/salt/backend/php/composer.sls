{% from "backend/php/map.jinja" import php with context %}
{% set install_file = php.local_bin + '/' + php.composer_bin %}

php-phar:
  pkg.installed:
    - name : {{ php.phar_pkg }}

downloaded-composer:
   cmd.run:
      - name: wget -q -O "{{ php.temp_dir }}/composer-installer" "https://getcomposer.org/installer"
      - cwd: {{ php.temp_dir }}
      - unless: test -f {{ install_file }}
      - require:
        - pkg: php-basic
        - pkg: php-phar

checked-composer:
  file.managed:
    - source: {{ php.temp_dir }}/composer-installer
    - name: {{ php.local_bin }}/composer-installer
    - source_hash: {{ php.composer_hash }}
    - mode: 744
    - onlyif: test -f {{ php.temp_dir }}/composer-installer
    - require:
      - cmd: downloaded-composer

installed-composer:
  file.absent:
    - name: {{ php.temp_dir }}/composer-installer
    - require:
      - file: checked-composer
  cmd.run:
    - name: php {{ php.local_bin }}/composer-installer --filename={{ php.composer_bin }} --install-dir={{ php.local_bin }}
    - unless: test -f {{ install_file }}
    - require:
      - file: checked-composer


cleanup-installation-file-composer:
  file.absent:
    - name: {{ php.local_bin }}/composer-installer
    - require:
      - cmd: installed-composer

# Get COMPOSER_DEV_WARNING_TIME from the installed composer, and if that time has passed
# then it's time to run `composer selfupdate`
#
# It would be nice if composer had a command line switch to get this, but it doesn't,
# and so we just grep for it.
#
updated-composer:
  cmd.run:
    - name: "{{ install_file }} selfupdate"
    - unless: test $(grep --text COMPOSER_DEV_WARNING_TIME {{ install_file }} | egrep '^\s*define' | sed -e 's,[^[:digit:]],,g') \> $(php -r 'echo time();')
    - cwd: {{ php.local_bin }}
    - require:
      - cmd: installed-composer
