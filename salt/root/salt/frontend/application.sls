application_frontend_dependencies_development:
  cmd.run:
    - name: npm install
    - cwd: {{ pillar['project_path_frontend'] }}
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - require:
      - cmd: nodejs_installed
    #- unless: test -d {{ pillar['project_path_frontend'] }}/node_modules


application_frontend_configuration_development:
    file.managed:
      - name: {{ pillar['project_path_frontend'] }}/webpack.config.js
      - source: salt://frontend/files/webpack.config.js.jinja
      - template: jinja
      - mode: 644
      - require:
        - cmd: application_frontend_dependencies_development
