{#
installed_packages:
  pkg.installed:
    - pkgs:
      {% if grains['os_family'] == 'Suse' %}
      # Suse custom packages here
      {% endif %}
      {% if grains['os_family'] == 'Debian' %}
      # Debian custom packages here
      {% endif %}
#}

{% if grains['os_family'] == 'Debian' %}
# When installing php5-fpm in advance to prevent installing apache2 is not a variant, but you need nginx and php5
purged_packages:
  pkg.purged:
    - name: apache2
    - require_in:
      - pkg: nginx
{% endif %}

corepkgs:
  pkg.installed:
    - pkgs:
      - git-lfs
    - watch_in:
      - cmd: core
    - require:
      - cmd: packagecloud-repo-setup

configure_netrc:
  file.managed:
    - name: /home/{{ pillar['user'] }}/.netrc
    - source: salt://.netrc
    - user: {{ pillar['user'] }}
    - group: {{ pillar['group_www'] }}
    - mode: 600
    - template: jinja
    - require:
      - user: {{ pillar['user'] }}