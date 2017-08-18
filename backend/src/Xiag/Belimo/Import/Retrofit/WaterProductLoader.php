<?php

namespace Xiag\Belimo\Import\Retrofit;


use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\AbstractLoader;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\ValidatorInterface;

class WaterProductLoader extends AbstractLoader
{
    private static $descriptors = [
        'product' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'AD' => 'datasheet_file_name',
                'AB' => 'product_image',

                // Properties
                'D' => 'nominal_voltage',
                'I' => 'torque',                   // Butterfly Valve
                'K' => 'actuating_force',          // Globe Valve
                'T' => 'control_type',
                'N' => 'running_time',             // Drehventile
                'Q' => 'actuating_time',           // Hubventile
                'P' => 'actuating_time_motor',     // Hubventile
                'L' => 'fail_safe_function',
            ],
            'filter' => [
                'AE' => 'NO_VALUE'
            ]
        ],
        'accessory' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'AB' => 'product_image',
            ],
            'filter' => [
                'AE' => 'NO_VALUE'
            ]
        ],
        'original' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',


                // Filterable properties
                'AI' => 'valve_type',                   // 7700
                'AE' => 'manufacturer',                 // 7686
                'AF' => 'series',                       // 7699
                'AJ' => 'dn',                           // 15
                'AK' => 'kvs',                          // 14

                'D' => 'nominal_voltage',               // 83 ????
                'U' => 'control_type',                  //
                'N' => 'running_time',                  // Drehventile
                'P' => 'actuating_time',                // Hubventile
                'I' => 'torque',
                'K' => 'actuating_force',
                'L' => 'fail_safe_function',

                // Replacement definition
                'BG' => 'replacement_1',
                'BH' => 'accessory_1_1',
                'BI' => 'accessory_1_2',
                'BJ' => 'accessory_1_3',
                'BK' => 'accessory_1_4',

                'BL' => 'replacement_2',
                'BM' => 'accessory_2_1',
                'BN' => 'accessory_2_2',
                'BO' => 'accessory_2_3',

                'BP' => 'replacement_3',
                'BQ' => 'accessory_3_1',
                'BR' => 'accessory_3_2',

                'BS' => 'replacement_4',
                'BT' => 'accessory_4_1',
                'BU' => 'accessory_4_2',
            ],
            'filter' => [
                'AE' => 'NOT_EMPTY'
            ]
        ]
    ];

    protected function getFileDescriptors(array $files)
    {
        return self::createFileDescriptors([
            'product' => $files['products'],
            'accessory' => $files['products'],
            'original' => $files['products']
        ], self::$descriptors);
    }

    protected function doLoad(array $data, ValidatorInterface $validator)
    {
        $filesValidator = new ImportFilesValidator($validator);
        $result = WaterProductDataProcessor::process($data, $filesValidator);
        $filesValidator->report($this->logger, 'Product datasheets', 'Product images');

        foreach ($result['unavailableReplacements'] as $title) {
            $this->logger->error('Replacement was defined but not available as product: %s', $title);
        }

        $missingAccessories = $result['missingAccessories'];
        if (sizeof($missingAccessories)) {
            $this->logger->error('Missing Accessories (%d): %s',
                sizeof($missingAccessories), implode(', ', $missingAccessories));
        }

        return $result['objects'];
    }
}
