logrotate_mongodb:
  file.managed:
    - name: /etc/logrotate.d/mongodb
    - source: salt://backend/logrotate/files/mongodb
    - user: root
    - group: root
    - mode: 440
    - unless: which mongod
