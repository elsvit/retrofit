{% from "backend/php/map.jinja" import php with context %}

php-basic:
  pkg.installed:
    - pkgs:
      - {{ php.php_pkg }}
      - {{ php.curl_pkg }}
      - {{ php.dom_pkg }}
      - {{ php.json_pkg }}
      - {{ php.mbstring_pkg }}
      - {{ php.openssl_pkg }}
      - {{ php.xmlwriter_pkg }}

include:
  - .composer
  - .mongodb