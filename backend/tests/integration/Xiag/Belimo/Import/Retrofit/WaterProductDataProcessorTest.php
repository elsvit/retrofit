<?php


namespace Test\Integration\Xiag\Belimo\Import\Retrofit;

use Mockery as m;
use Test\Integration\Xiag\Belimo\Import\DataProcessorTestBase;
use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\Retrofit\WaterProductDataProcessor;

class WaterProductDataProcessorTest extends DataProcessorTestBase
{
    public function testProcessingWorks()
    {
        /** @var $validator ImportFilesValidator */
        $validator = m::mock('Xiag\Belimo\Import\ImportFilesValidator');
        $validator->shouldReceive('validate')
            ->andReturnUsing(function ($dsFile, $imgFile) {
                return [$dsFile, $imgFile];
            });
        $result = WaterProductDataProcessor::process([
            'product' => self::$products,
            'accessory' => self::$accessories,
            'original' => self::$originals
        ], $validator);

        $this->assertEquals(self::$expectedObjects, $result['objects'], 'produces expected objects');
        $this->assertEquals([self::BAD_REPLACEMENT_TITLE], $result['unavailableReplacements'],
            'detects unavailable replacements');
        $this->assertEquals([self::BAD_ACCESSORY_TITLE], $result['missingAccessories'],
            'detects unavailable accessories');
    }

    public function testHandlesNonExistentImages()
    {
        /** @var $validator ImportFilesValidator */
        $validator = m::mock('Xiag\Belimo\Import\ImportFilesValidator');
        $validator->shouldReceive('validate')
            ->andReturnUsing(function ($dsFile, $imgFile) {
                return [$dsFile, $imgFile === self::NONEXISTENT_IMAGE ? '' : $imgFile];
            });
        $products = self::$products;
        $idx = $this->objIndex($products, self::PRODUCT_WITH_IMAGE_ID, 'products fixture is correct');
        $existingImage = $products[$idx]['product_image'];
        $idx = $this->objIndex($products, self::PRODUCT_WITH_NO_IMAGE_ID, 'products fixture is correct');
        $products[$idx]['product_image'] = self::NONEXISTENT_IMAGE;

        $result = WaterProductDataProcessor::process([
            'product' => $products,
            'accessory' => self::$accessories,
            'original' => self::$originals
        ], $validator);

        $products = $result['objects'][EntityCollection::RETROFIT_WATER_PRODUCT];
        $idx = $this->objIndex($products, self::PRODUCT_WITH_NO_IMAGE_ID);
        $this->assertEquals('', $products[$idx]['product_image'], 'name of non-existing file was erased');
        $idx = $this->objIndex($products, self::PRODUCT_WITH_IMAGE_ID);
        $this->assertEquals($existingImage, $products[$idx]['product_image'], 'name of existing file was left intact');
    }

    const BAD_REPLACEMENT_TITLE = 'BAD_REP';
    const BAD_ACCESSORY_TITLE = 'BAD_ACC';
    const NONEXISTENT_IMAGE = 'noimage.jpg';
    const PRODUCT_WITH_NO_IMAGE_ID = '61713';
    const PRODUCT_WITH_IMAGE_ID = '61708';

    private static $originals = [
        [
            'id' => '300223',
            'title' => 'Ziva G_DN 65',
            'valve_type' => 'Rotary valve',
            'manufacturer' => 'ARI',
            'series' => 'Ziva G (Fig. 015)',
            'dn' => '65',
            'kvs' => '190 m³/h',
            'nominal_voltage' => null,
            'control_type' => null,
            'running_time' => null,
            'actuating_time' => null,
            'torque' => null,
            'actuating_force' => null,
            'fail_safe_function' => null,
            'replacement_1' => self::BAD_REPLACEMENT_TITLE . '|SR24A-MF-R|SR230A-R',
            'accessory_1_1' => null,
            'accessory_1_2' => 'ZSF-11',
            'accessory_1_3' => self::BAD_ACCESSORY_TITLE,
            'accessory_1_4' => null,
            'replacement_2' => 'SR230P-SR-R',
            'accessory_2_1' => null,
            'accessory_2_2' => 'ZPF-11',
            'accessory_2_3' => null,
            'replacement_3' => 'SRFA-S2-R',
            'accessory_3_1' => null,
            'accessory_3_2' => 'ZSFF-11',
            'replacement_4' => null,
            'accessory_4_1' => null,
            'accessory_4_2' => null,
            'type' => 'Ziva G_DN 65',
        ]
    ];

    private static $products = [
        [
            'id' => '61713',
            'title' => 'SR24A-MF-R',
            'datasheet_file_name' => 'SR24A-MF-R_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_SR24A-R_01_4C.jpg',
            'nominal_voltage' => 'AC/DC 24 V',
            'torque' => '20 Nm',
            'actuating_force' => null,
            'control_type' => 'modulating',
            'running_time' => '90 s',
            'actuating_time' => null,
            'actuating_time_motor' => null,
            'fail_safe_function' => null,
        ],
        [
            'id' => '61708',
            'title' => 'SR230A-R',
            'datasheet_file_name' => 'SR230A-R_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_SR24A-R_01_4C.jpg',
            'nominal_voltage' => 'AC 230 V',
            'torque' => '20 Nm',
            'actuating_force' => null,
            'control_type' => 'Open-close|3-point',
            'running_time' => '90 s',
            'actuating_time' => null,
            'actuating_time_motor' => null,
            'fail_safe_function' => null,
        ],
        [
            'id' => '61712',
            'title' => 'SR230P-SR-R',
            'datasheet_file_name' => 'SR230P-SR-R_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_Robustline-Water_2cab_4C.jpg',
            'nominal_voltage' => 'AC 230 V',
            'torque' => '20 Nm',
            'actuating_force' => null,
            'control_type' => 'modulating',
            'running_time' => '90 s',
            'actuating_time' => null,
            'actuating_time_motor' => null,
            'fail_safe_function' => null,
        ],
        [
            'id' => '102128',
            'title' => 'SRFA-S2-R',
            'datasheet_file_name' => 'SRFA-S2-R_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_SRF-S2-neutral-2K_01_4C.jpg',
            'nominal_voltage' => 'AC 24...240 V / DC 24...125 V',
            'torque' => '20 Nm',
            'actuating_force' => null,
            'control_type' => 'Open-close',
            'running_time' => '75 s',
            'actuating_time' => null,
            'actuating_time_motor' => null,
            'fail_safe_function' => 'With mechanical emergency control function',
        ]
    ];

    private static $accessories = [
        [
            'id' => '60044',
            'title' => 'ZPF-11',
            'product_image' => 'PIC_EU_ZPF_BW.jpg',
        ],
        [
            'id' => '60075',
            'title' => 'ZSFF-11',
            'product_image' => 'PIC_EU_ZSFF_Adapter two flats_BW.jpg',
        ],
        [
            'id' => '60070',
            'title' => 'ZSF-11',
            'product_image' => 'PIC_EU_ZSF_Form-fit adapter_BW.jpg',
        ]
    ];

    private static $expectedObjects = [
        EntityCollection::RETROFIT_WATER_PRODUCT => [
            [
                'id' => '61713',
                'title' => 'SR24A-MF-R',
                'datasheet_file_name' => 'SR24A-MF-R_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_SR24A-R_01_4C.jpg',
                'nominal_voltage' => 'AC/DC 24 V',
                'torque' => '20 Nm',
                'actuating_force' => null,
                'control_type' => 'modulating',
                'running_time' => '90 s',
                'actuating_time' => null,
                'actuating_time_motor' => null,
                'fail_safe_function' => null,
                'datasheet_file' => 'SR24A-MF-R_datasheet_en-gb.pdf',
            ],
            [
                'id' => '61708',
                'title' => 'SR230A-R',
                'datasheet_file_name' => 'SR230A-R_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_SR24A-R_01_4C.jpg',
                'nominal_voltage' => 'AC 230 V',
                'torque' => '20 Nm',
                'actuating_force' => null,
                'control_type' => 'Open-close|3-point',
                'running_time' => '90 s',
                'actuating_time' => null,
                'actuating_time_motor' => null,
                'fail_safe_function' => null,
                'datasheet_file' => 'SR230A-R_datasheet_en-gb.pdf',
            ],
            [
                'id' => '61712',
                'title' => 'SR230P-SR-R',
                'datasheet_file_name' => 'SR230P-SR-R_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_Robustline-Water_2cab_4C.jpg',
                'nominal_voltage' => 'AC 230 V',
                'torque' => '20 Nm',
                'actuating_force' => null,
                'control_type' => 'modulating',
                'running_time' => '90 s',
                'actuating_time' => null,
                'actuating_time_motor' => null,
                'fail_safe_function' => null,
                'datasheet_file' => 'SR230P-SR-R_datasheet_en-gb.pdf',
            ],
            [
                'id' => '102128',
                'title' => 'SRFA-S2-R',
                'datasheet_file_name' => 'SRFA-S2-R_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_SRF-S2-neutral-2K_01_4C.jpg',
                'nominal_voltage' => 'AC 24...240 V / DC 24...125 V',
                'torque' => '20 Nm',
                'actuating_force' => null,
                'control_type' => 'Open-close',
                'running_time' => '75 s',
                'actuating_time' => null,
                'actuating_time_motor' => null,
                'fail_safe_function' => 'With mechanical emergency control function',
                'datasheet_file' => 'SRFA-S2-R_datasheet_en-gb.pdf',
            ]
        ],
        EntityCollection::RETROFIT_WATER_ACCESSORY => [
            [
                'id' => '60044',
                'title' => 'ZPF-11',
                'product_image' => 'PIC_EU_ZPF_BW.jpg',
            ],
            [
                'id' => '60075',
                'title' => 'ZSFF-11',
                'product_image' => 'PIC_EU_ZSFF_Adapter two flats_BW.jpg',
            ],
            [
                'id' => '60070',
                'title' => 'ZSF-11',
                'product_image' => 'PIC_EU_ZSF_Form-fit adapter_BW.jpg',
            ],
        ],
        EntityCollection::RETROFIT_WATER_ORIGINAL => [
            [
                'id' => '300223',
                'title' => 'Ziva G_DN 65',
                'valve_type' => 'Rotary valve',
                'manufacturer' => 'ARI',
                'series' => 'Ziva G (Fig. 015)',
                'dn' => '65',
                'kvs' => '190 m³/h',
                'nominal_voltage' => null,
                'control_type' => null,
                'running_time' => null,
                'actuating_time' => null,
                'torque' => null,
                'actuating_force' => null,
                'fail_safe_function' => null,
                'type' => 'Ziva G_DN 65',
                'replacements' => [
                    ['product' => '61713', 'accessories' => ['60070']],
                    ['product' => '61708', 'accessories' => ['60070']],
                    ['product' => '61712', 'accessories' => ['60044']],
                    ['product' => '102128', 'accessories' => ['60075']],
                ],
            ]
        ]
    ];
}
