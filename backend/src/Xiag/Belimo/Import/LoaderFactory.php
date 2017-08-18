<?php

namespace Xiag\Belimo\Import;


class LoaderFactory
{
    private static $classes = [
        'valvesizer/water' => 'Xiag\Belimo\Import\Valvesizer\WaterProductLoader',
        'retrofit/air' => 'Xiag\Belimo\Import\Retrofit\AirProductLoader',
        'retrofit/water' => 'Xiag\Belimo\Import\Retrofit\WaterProductLoader'
    ];

    /**
     * @param $target
     * @param string $id
     * @param Logger $logger
     * @return Loader
     * @throws ImportException
     */
    public static function getLoader($target, $id, Logger $logger)
    {
        if(empty(self::$classes[$id])) {
            throw new ImportException("No loader registered for $id");
        }

        return new self::$classes[$id]($target, $logger);
    }
}