<?php

namespace Xiag\Provider;


use Silex\Application;
use Silex\ServiceProviderInterface;
use Xiag\Belimo\DAO;
use Xiag\Belimo\StorageFactory;

class StorageServiceProvider implements ServiceProviderInterface
{

    /**
     * Array with list of storage options
     * @var array
     */
    private $storageConfiguration;

    public function __construct($storageConfiguration)
    {
        $this->storageConfiguration = $storageConfiguration;
    }

    public function register(Application $app)
    {
        $app['storage'] = StorageFactory::getStorage($this->storageConfiguration);
        $app['DAO'] = new DAO($app['storage']);
    }

    public function boot(Application $app)
    {
    }
}
