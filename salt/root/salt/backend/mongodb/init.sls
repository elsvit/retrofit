{% set mdb = salt['pillar.get']('mongodb', {}) %}

mongodb_repo:
  cmd.run:
{% if grains['os_family'] == 'Suse' %}
    - name: zypper addrepo --no-gpgcheck https://repo.mongodb.org/zypper/suse/11/mongodb-org/3.0/x86_64/ mongodb
    - unless: zypper repos -U | grep mongodb.org
{% endif %}
{% if grains['os_family'] == 'Debian' %}
    - name: |
        apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 'EA312927'
        echo 'deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main' | tee '/etc/apt/sources.list.d/mongodb-org-3.2.list'
        apt-get update
    - unless: test -f /etc/apt/sources.list.d/mongodb-org-3.2.list
{% endif %}

mongodb_package:
  pkg.installed:
    - name: {{ mdb.package }}
    {% if mdb.version is defined %}
    - version: {{ mdb.version }}
    {% endif %}
    - require:
      - cmd: mongodb_repo
    {% if grains['os_family'] == 'Suse' %}
    - fromrepo: mongodb
    {% endif %}
    - require_in:
      - file: mongodb_log_path
      - file: mongodb_configuration
      - file: mongodb_db_path

{% if grains['os_family'] == 'Suse' %}
# YES, their init script were broken
mongodb_pid_path_fix:
  cmd.run:
    - name: sed -i -r 's/^PIDFILEPATH[^\r\n]+/\0\nPIDDIR=`dirname $PIDFILEPATH`/' /etc/init.d/mongod
    - onlyif: test -f /etc/init.d/mongod -a "$(grep -E ^PIDDIR /etc/init.d/mongod | wc -l)" = "0"
    - require:
      - pkg: mongodb_package
{% endif %}

mongodb_db_path:
  file.directory:
    - name: {{ mdb.db_path }}
    - user: {{ mdb.user }}
    - group: {{ mdb.group }}
    - mode: 755
    - makedirs: True
    - recurse:
        - user
        - group

mongodb_log_path:
  file.directory:
    - name: {{ mdb.log_path }}
    - user: {{ mdb.user }}
    - group: {{ mdb.group }}
    - mode: 755
    - makedirs: True

mongodb_configuration:
  file.managed:
    - name: {{ mdb.conf_path }}
    - user: root
    - group: root
    - mode: 644
    - source: salt://backend/mongodb/files/conf.jinja
    - template: jinja

mongodb_service:
  {% if grains['os_family'] == 'Suse' %}
  service.running:
    - name: {{ mdb.mongod }}
    - enable: True
    - watch:
      - file: mongodb_configuration
  {% endif %}
  {% if grains['os_family'] == 'Debian' %}
  cmd.run:
    - name: /etc/init.d/mongod start
    - unless: /etc/init.d/mongod status | grep 'active (running)'
  {% endif %}
    - require:
      - file: mongodb_configuration
      - pkg: mongodb_package