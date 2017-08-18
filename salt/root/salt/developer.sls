bashrc:
  file.append:
    - name: /home/{{ pillar['user'] }}/.bashrc
    - makedirs: True
    - text:
      - umask 0002
      - PS1='\u@retrofit{%if grains['virtual'] == 'VirtualBox' %}.vagrant{% else %}{% if 'live' in grains['roles'] %}.live{% else %}.rc{% endif %}{% endif %}:\w\[\033[01;34m\]`__git_ps1`\[\033[00m\]> '
      - cd {{ pillar['project_path_app'] }}
    - require:
      - user: {{ pillar['user'] }}

gitconfig:
  file.managed:
    - name: /home/{{ pillar['user'] }}/.gitconfig
    - source: salt://.gitconfig
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - mode: 600