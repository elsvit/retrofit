application_backend_dependencies:
  cmd.run:
    - name: composer install && composer dump-autoload
    - cwd: {{ pillar['project_path_app'] }}
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - require:
      - cmd: updated-composer
    #- unless: test -f {{ pillar['project_path_app'] }}/vendor/autoload.php

application_installed:
  cmd.run:
    - unless: php {{ pillar['project_path_app'] }}/backend/scripts/belimo check-installed
    - name: php {{ pillar['project_path_app'] }}/backend/scripts/belimo install all
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - require:
      - cmd: application_backend_dependencies
      - sls: backend.mongodb
