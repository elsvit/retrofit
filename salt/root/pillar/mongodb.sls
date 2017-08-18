mongodb:
  {% if grains['os_family'] == 'Suse' %}
  package: mongodb-org
  version: 3.0.4-1.suse11
  user: mongod
  group: mongod
  mongod: mongod
  db_path: /var/lib/mongo
  conf_path: /etc/mongod.conf
  {% endif %}

  {% if grains['os_family'] == 'Debian' %}
  package: mongodb-org
  user: mongodb
  group: mongodb
  mongod: mongodb
  db_path: /var/lib/mongodb
  conf_path: /etc/mongodb.conf
  {% endif %}

  log_path: /var/log/mongodb
  pid_path: /var/run/mongodb/mongodb.pid

  replica_set:
    name: null

  settings:
    port: 27017
    bind_ip: 127.0.0.1