packagecloud-repo-setup:
  cmd.script:
    - source: salt://packagecloud/install.sh
    - unless: apt-key list | grep 'packagecloud.io'
