<?php
namespace Xiag\Belimo;

use Xiag\Belimo\Storage\MongoDB;
use \MongoDB\Driver\Manager;
use \MongoDB\Database;

/**
 * How to setup and instantiate concrete storage for application needs
 */
class StorageFactory
{
    /**
     * How to instantiate concrete storage object by configuration options
     * @param array $config
     * @return StorageInterface
     */
    public static function getStorage($config)
    {
        if (array_key_exists('mongodb', $config)) {

            foreach (['host', 'port', 'dbname'] as $optionName) {
                if (empty($config['mongodb'][$optionName])) {
                    throw new \InvalidArgumentException(
                        "Error in " . __CLASS__ . ": supplied configuration argument missing option '{$optionName}'"
                    );
                }
            }

            $host   = $config['mongodb']['host'];
            $port   = $config['mongodb']['port'];
            $dbname = $config['mongodb']['dbname'];

            return new MongoDB(new Database(new Manager("mongodb://{$host}:{$port}"), $dbname));
        }

        throw new \InvalidArgumentException(
            "Error in " . __CLASS__ . ": supplied configuration argument missing known storage implementation"
        );
    }
}