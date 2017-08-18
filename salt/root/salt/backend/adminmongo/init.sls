{% set am = salt['pillar.get']('adminmongo', {}) %}

adminmongo_directory:
  file.directory:
    - name: {{ am.directory }}
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - mode: 755
    - makedirs: True

adminmongo_source:
  git.latest:
    - name: https://github.com/mrvautin/adminMongo.git
    - user: {{ pillar['user'] }}
    - target: {{ am.directory }}
    - require:
      - file: adminmongo_directory

adminmongo_installed:
  cmd.run:
    - name: npm install
    - cwd: {{ am.directory }}
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - require:
      - git: adminmongo_source
      - cmd: nodejs_installed
    - unless: test -d {{ am.dependencies }}
