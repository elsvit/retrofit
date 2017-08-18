<?php
namespace Xiag\Provider;

use Silex\Application;
use Silex\ServiceProviderInterface;

class ConfigurationServiceProvider implements ServiceProviderInterface
{
    public function register(Application $app)
    {
        // @todo set path to config as parameter
        $app['configuration'] = require_once __DIR__ . '/../../../configuration/application.php';
    }

    public function boot(Application $app)
    {
    }
}
