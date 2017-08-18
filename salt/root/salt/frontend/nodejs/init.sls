nodejs_source:
  cmd.run:
    - name: curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
    - unless: grep node_4 /etc/apt/sources.list.d/nodesource.list

nodejs_installed:
  cmd.run:
    - name: sudo apt-get install -y nodejs
    - unless: node -v | grep -E ^v4
