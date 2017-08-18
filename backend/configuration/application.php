<?php
$configuration = [
    'storage' => [
        'mongodb' => [
            'host' => '127.0.0.1',
            'port' => '27017',
            'dbname' => 'belimo',
        ]
    ],
    'import' => [
        'file_storage_root' => __DIR__ . '/../../public/belimo',
        'file_source_root' => __DIR__ . '/../data',
        'targets' => [
            'default' => [
                'valvesizer/water' => [
                    'products' => 'valvesizer_water_products_en_20170523.csv',
                    'combos' => 'valvesizer_water_combos_en_20170613.csv'
                ],
                'retrofit/air' => [
                    'products' => 'retrofit_air_en_20161221.csv'
                ],
                'retrofit/water' => [
                    'products' => 'retrofit_water_en_20170404.csv'
                ],
            ],
            'de-ch' => [
                'valvesizer/water' => [
                    'products' => 'valvesizer_water_products_de_20170523.csv',
                    'combos' => 'valvesizer_water_combos_de_20170613.csv'
                ],
                'retrofit/air' => [
                    'products' => 'retrofit_air_de_20161221.csv'
                ],
                'retrofit/water' => [
                    'products' => 'retrofit_water_de_20170403.csv'
                ],
            ],
        ],
    ]
];

return $configuration;
