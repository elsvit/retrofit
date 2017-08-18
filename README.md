"Retrofit & Project Planner" Project of XIAG AG for Belimo
==========================================================

# Purpose

ReactJS-based web-application for selecting parts in HVAC works.

* See [Belimo US Retrofit](https://www.belimo.us/ishop/theme/node/29028.xml) and [Belimo CH Retrofit](http://www.belimo.ch/CH/EN/Product/retrofit6/start.cfm) for Retrofit tool
* See [Belimo SelectPro](http://selectpro.belimo.ch/login.aspx) for Planner tool


# Developing

## Developer's environment requirements

  * [git](http://git-scm.com/) version control system
  * [virtualbox](http://www.virtualbox.org/) virtualization software
  * [vagrant](http://www.vagrantup.com/) as wrapper for virtualization software
  * [nfs-kernel-server](http://nfs.sourceforge.net/) package (or analog)
  * [Vagrant::Hostsupdater](https://github.com/cogitatio/vagrant-hostsupdater) plugin for Vagrant

## Installation

  1. Install git, create your own fork of this project
  
  2. Install virtualbox, nfs server and vagrant
  
  3. Install vagrant hostsupdater plugin
```sh
    vagrant plugin install vagrant-hostsupdater
```

  4. Navigate to your project root directory and create file `Vagrantfile`
```sh
    cp Vagrantfile.dist Vagrantfile
```
  
  5. Check what vagrant boxes you already have
```sh
    vagrant box list
```

  6. Add vagrant box if you need
```sh
    vagrant box add dj http://repos.xiag.ch/xiag/debian-jessie-amd64.box
```

  7. Open your `Vagrantfile` and check box name in respective configuration option
```
config.vm.box = "dj"
```

  8. Setup external configuration root of SaltStack configuration management software
```sh
    git submodule update --init externals/salt
```

  9. Make application's Salt's minion configuration file from default template
```sh
    cp salt/minion.conf salt/minion
```
        
  10. Up vagrant (This may take a while)
```sh
    vagrant up
```

  11. When vagrant machine is loaded, enter vagrant machine console:
```sh
    vagrant ssh
```

### Installation troubleshooting

  * Composer hit GitHub rate limit 
  (`vagrant up` hanging too long and inside vagrant you can see strace for `salt-call` process waiting for soket read)

Create own OAuth token on GitHub and add it inside vagrant    
```
vagrant@retrofit.vagrant:/var/www/retrofit (master)> composer config -g github-oauth.github.com <oauthtoken>
```

Run composer installation manually     
```
vagrant@retrofit.vagrant:/var/www/retrofit (master)> composer install
```
  
  * npm failed to complete
  (`vagrant up` finished, but you saw some red output from provisioner)

Just run installation manually
```
vagrant@retrofit.vagrant:/var/www/retrofit/react/DOM (master)> npm install
```

## Running

  1. To start developer's server for web-application's frontend
```
    vagrant@retrofit.vagrant:/var/www/retrofit/react/DOM (master)> npm run-script dev
```
> Use script `npm run-script design` if you don't need side panel with list of events from Redux

  2. Navigate to port **8888** at hostname, specified in your `Vagrantfile`, 
  f.e.: [http://retrofit.dev:8888/](http://retrofit.dev:8888/) 
> If for some reason, you changed domain name for your virtual machine, consider also changing it in `webpack.config.js`

## Building

  1. To make static build of web-application's frontend 
```
    vagrant@retrofit.vagrant:/var/www/retrofit/react/DOM (master)> npm run-script build
```

  2. Navigate to hostname, specified in your `Vagrantfile`, 
  f.e.: [http://retrofit.dev](http://retrofit.dev)

## Development

### Before every push/merge request run
```
    vagrant@retrofit.vagrant:/var/www/retrofit/react/DOM: npm run prepush
```

### UI database

1. To enable ui database run

```
    vagrant@retrofit.vagrant: cd /var/www/adminmongo && npm start
```

2. UI database URL: [retrofit.dev:1234](retrofit.dev:1234)
  
# Admin VPS checklist

### VPS Role
   - demo
   - nginx

### Base system
Debian Jessie

### PHP branch
php 5.6

### Webserver
nginx only

### Application folder:
/var/www/retrofit