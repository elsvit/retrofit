#!/bin/bash
dir=$(cd "$(dirname "$0")";pwd);

cd $dir/integration
../../../vendor/bin/phpunit .
