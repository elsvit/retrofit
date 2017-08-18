{% from "backend/nginx/map.jinja" import nginx with context %}

include:
  - base: nginx

nginx_basic_pw:
  file.managed:
    - name: /etc/nginx/basic_pw
    - source: salt://backend/nginx/files/basic_pw
    - user: root
    - group: {{ pillar['group_www'] }}
    - mode: 640
    - require:
      - pkg: nginx

nginx_config_retrofit:
  file.managed:
    - name: {{ nginx.nginx_vhosts }}/retrofit.conf
    - source: salt://backend/nginx/files/retrofit.conf.jinja
    - template: jinja
    - mode: 644
    - require:
      - pkg: nginx
    - watch_in:
      - service: nginx

{% if grains['os_family'] == 'Debian' %}
nginx_config_retrofit_symlink:
  file.symlink:
    - name: /etc/nginx/sites-enabled/retrofit.conf
    - target: {{ nginx.nginx_vhosts }}/retrofit.conf
    - require:
      - pkg: nginx
      - file: nginx_config_retrofit
    - require_in:
      - service: nginx
{% endif %}
