<?php

namespace Xiag\Belimo\Import\Retrofit;


use Normalizer;
use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\AbstractLoader;
use Xiag\Belimo\Import\FileExistenceValidator;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\Logger;
use Xiag\Belimo\Import\ValidatorInterface;

class AirProductLoader extends AbstractLoader
{
    private static $descriptors = [
        'product' => [
            'columns' => [
                // Basic properties
                'A' => 'id',                         // PdmarticleID
                'B' => 'title',                      // Label
                'AF' => 'datasheet_file_name',        // 660
                'AD' => 'product_image',              // 377

                // Specification Properties
                'D' => 'nominal_voltage',            // 83
                'I' => 'torque',                     // 260
                'K' => 'stroke',                     // 118 (Actuating force)
                'U' => 'working_range',              // 121
                'N' => 'running_time',               // 230
                'R' => 'control_type',               // 281
                'L' => 'safety_function',            // 890
                'X' => 'degree_of_protection',       // 144
                'Z' => 'integrated_switch'           // 112
            ],
            'filter' => [
                'AG' => 'NO_VALUE'                    // 7687
            ]
        ],
        'accessory' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'AD' => 'product_image',

                // Specification Properties
                'D' => 'nominal_voltage',            // 83
                'I' => 'torque',                     // 260
                'K' => 'stroke',                     // 118 (Actuating force)
                'U' => 'working_range',              // 121
                'N' => 'running_time',               // 230
                'R' => 'control_type',               // 281
                'L' => 'safety_function',            // 890
                'X' => 'degree_of_protection',       // 144
                'Z' => 'integrated_switch'           // 112
            ],
            'filter' => [
                'AG' => 'NO_VALUE'                    // 7687
            ]
        ],
        'original' => [
            'columns' => [
                // Basic Properties
                'A' => 'id',
                'B' => 'title',
                'AG' => 'manufacturer',               // 7687

                // Specification Properties
                'AJ' => 'nominal_voltage',            // 7607
                'AO' => 'torque',                     // 7611
                'AP' => 'stroke',                     // 7612
                'AM' => 'running_time',               // 7610
                'AS' => 'safety_function',            // 7683
                'AL' => 'control_type',               // 7609
                'AV' => 'degree_of_protection',       // 7686
                'AX' => 'working_range',              // 7772
                'AT' => 'integrated_switch',          // 7684

                // Replacement mappings
                'BC' => 'replacement_1',              // 7597
                'BD' => 'accessory_1_1',              // 7604
                'BE' => 'accessory_1_2',              // 7777
                'BF' => 'replacement_note_1',         // 7881

                'BG' => 'replacement_2',              // 7680
                'BH' => 'accessory_2_1',              // 7697
                'BI' => 'accessory_2_2',              // 7778
                'BJ' => 'replacement_note_2',         // 7882

                'BK' => 'replacement_3',              // #7688
                'BL' => 'accessory_3_1',              // #7698
                'BM' => 'replacement_note_3',         // #7883

                'BN' => 'replacement_4',              // #7704
                'BO' => 'accessory_4_1',              // #7705
                'BP' => 'replacement_note_4',         // #7884
            ],
            'filter' => [
                'AG' => 'NOT_EMPTY'
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
        $productFilesValidator = new ImportFilesValidator($validator);
        $accessoryImageValidator = new FileExistenceValidator($validator, ValidatorInterface::FILE_IMAGE);
        $result = AirProductDataProcessor::process($data, $productFilesValidator, $accessoryImageValidator);
        $productFilesValidator->report($this->logger, 'Product datasheets', 'Product images');
        $accessoryImageValidator->report($this->logger, 'Accessory images', Logger::WARN);

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
