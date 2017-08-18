<?php


namespace Test\Integration\Xiag\Belimo\Import\Retrofit;


use Mockery as m;
use Test\Integration\Xiag\Belimo\Import\DataProcessorTestBase;
use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\FileExistenceValidator;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\Retrofit\AirProductDataProcessor;

class AirProductDataProcessorTest extends DataProcessorTestBase
{

    public function testProcessingWorks()
    {
        /** @var $productValidator ImportFilesValidator */
        $productValidator = m::mock('Xiag\Belimo\Import\ImportFilesValidator');
        $productValidator->shouldReceive('validate')
            ->andReturnUsing(function ($dsFile, $imgFile) {
                return [$dsFile, $imgFile];
            });
        /** @var  $accessoryValidator FileExistenceValidator */
        $accessoryValidator = m::mock('Xiag\Belimo\Import\FileExistenceValidator');
        $accessoryValidator->shouldReceive('validate')->andReturn(true);

        $result = AirProductDataProcessor::process([
            'product' => self::$products,
            'accessory' => self::$accessories,
            'original' => self::$originals
        ], $productValidator, $accessoryValidator);

        $this->assertEquals(self::$expectedObjects, $result['objects'], 'produces expected objects');
        $this->assertEquals([self::BAD_REPLACEMENT_TITLE], $result['unavailableReplacements'],
            'detects unavailable replacements');
        $this->assertEquals([self::BAD_ACCESSORY_TITLE], $result['missingAccessories'],
            'detects unavailable accessories');
    }

    public function testHandlesNonExistentImagesInProduct()
    {
        /** @var $productValidator ImportFilesValidator */
        $productValidator = m::mock('Xiag\Belimo\Import\ImportFilesValidator');
        $productValidator->shouldReceive('validate')
            ->andReturnUsing(function ($dsFile, $imgFile) {
                return [$dsFile, $imgFile === self::NONEXISTENT_IMAGE ? '' : $imgFile];
            });
        $products = self::$products;
        $idx = $this->objIndex($products, self::PRODUCT_WITH_IMAGE_ID, 'products fixture is correct');
        $existingImage = $products[$idx]['product_image'];
        $idx = $this->objIndex($products, self::PRODUCT_WITH_NO_IMAGE_ID, 'products fixture is correct');
        $products[$idx]['product_image'] = self::NONEXISTENT_IMAGE;

        /** @var  $accessoryValidator FileExistenceValidator */
        $accessoryValidator = m::mock('Xiag\Belimo\Import\FileExistenceValidator');
        $accessoryValidator->shouldReceive('validate')->andReturn(true);

        $result = AirProductDataProcessor::process([
            'product' => $products,
            'accessory' => self::$accessories,
            'original' => self::$originals
        ], $productValidator, $accessoryValidator);

        $products = $result['objects'][EntityCollection::RETROFIT_AIR_PRODUCT];
        $idx = $this->objIndex($products, self::PRODUCT_WITH_NO_IMAGE_ID);
        $this->assertEquals('', $products[$idx]['product_image'], 'name of non-existing file was erased');
        $idx = $this->objIndex($products, self::PRODUCT_WITH_IMAGE_ID);
        $this->assertEquals($existingImage, $products[$idx]['product_image'], 'name of existing file was left intact');
    }

    public function testHandlesNonExistentImagesInAccessory()
    {
        /** @var $productValidator ImportFilesValidator */
        $productValidator = m::mock('Xiag\Belimo\Import\ImportFilesValidator');
        $productValidator->shouldReceive('validate')
            ->andReturnUsing(function ($dsFile, $imgFile) {
                return [$dsFile, $imgFile === self::NONEXISTENT_IMAGE ? '' : $imgFile];
            });
        $accessories = self::$accessories;
        $idx = $this->objIndex($accessories, self::ACCESSORY_WITH_NO_IMAGE_ID, 'accessory fixture is correct');
        $accessories[$idx]['product_image'] = self::NONEXISTENT_IMAGE;

        /** @var  $accessoryValidator FileExistenceValidator */
        $accessoryValidator = m::mock('Xiag\Belimo\Import\FileExistenceValidator');
        $accessoryValidator->shouldReceive('validate')
            ->andReturnUsing(function ($file) {
                return $file !== self::NONEXISTENT_IMAGE;
            });

        $result = AirProductDataProcessor::process([
            'product' => self::$products,
            'accessory' => $accessories,
            'original' => self::$originals
        ], $productValidator, $accessoryValidator);

        $accessories = $result['objects'][EntityCollection::RETROFIT_AIR_ACCESSORY];
        $idx = $this->objIndex($accessories, self::ACCESSORY_WITH_NO_IMAGE_ID);
        $this->assertEquals('', $accessories[$idx]['product_image'], 'name of non-existing file was erased');
    }

    const BAD_REPLACEMENT_TITLE = 'BAD_REP';
    const BAD_ACCESSORY_TITLE = 'BAD_ACC';
    const NONEXISTENT_IMAGE = 'noimage.jpg';
    const PRODUCT_WITH_NO_IMAGE_ID = '277726';
    const PRODUCT_WITH_IMAGE_ID = '4732';
    const ACCESSORY_WITH_NO_IMAGE_ID = '59457';

    private static $originals = [
        [
            'id' => '301553',
            'title' => 'SAL1.23S',
            'manufacturer' => 'Joventa',
            'nominal_voltage' => 'AC/DC 24 V',
            'torque' => '24 Nm',
            'stroke' => NULL,
            'running_time' => '125 s',
            'safety_function' => NULL,
            'control_type' => '2- / 3-point',
            'degree_of_protection' => 'IP54',
            'working_range' => NULL,
            'integrated_switch' => '2 x SPDT',
            'replacement_1' => self::BAD_REPLACEMENT_TITLE . '|GM24A-TP',
            'accessory_1_1' => 'S2A',
            'accessory_1_2' => NULL,
            'replacement_note_1' => 'accessory S2A with 2 adjustable switching points|',
            'replacement_2' => 'GM24A-MP-TP',
            'accessory_2_1' => self::BAD_ACCESSORY_TITLE . '|S2A',
            'accessory_2_2' => NULL,
            'replacement_note_2' => 'for 3-point control, AC only|',
            'replacement_3' => NULL,
            'accessory_3_1' => NULL,
            'replacement_note_3' => NULL,
            'replacement_4' => NULL,
            'accessory_4_1' => NULL,
            'replacement_note_4' => NULL,
        ]
    ];

    private static $products = [
        [
            'id' => '4732',
            'title' => 'GM24A-TP',
            'datasheet_file_name' => 'GM24A-TP_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_GM24A-TP_4C.jpg',
            'nominal_voltage' => 'AC/DC 24 V',
            'torque' => '40 Nm',
            'stroke' => NULL,
            'working_range' => NULL,
            'running_time' => '150 s',
            'control_type' => 'Open-close',
            'safety_function' => 'safety-function-for-tests',
            'degree_of_protection' => 'IP54',
            'integrated_switch' => NULL,
        ],
        [
            'id' => '277726',
            'title' => 'GM24A-MP-TP',
            'datasheet_file_name' => 'GM24A-MP-TP_datasheet_en-gb.pdf',
            'product_image' => 'PIC_EU_GM24A-MF-TP_4C.tif',
            'nominal_voltage' => null,
            'torque' => '40 Nm',
            'stroke' => null,
            'working_range' => 'DC 2...10 V',
            'running_time' => '150 s',
            'control_type' => 'modulating|communicative',
            'safety_function' => null,
            'degree_of_protection' => 'IP54',
            'integrated_switch' => 'test X test',
        ]
    ];

    private static $accessories = [
        [
            'id' => '59457',
            'title' => 'S2A',
            'product_image' => 'PIC_EU_S2A_4C.jpg',
            'nominal_voltage' => NULL,
            'torque' => NULL,
            'stroke' => NULL,
            'working_range' => NULL,
            'running_time' => NULL,
            'control_type' => NULL,
            'safety_function' => NULL,
            'degree_of_protection' => 'IP54',
            'integrated_switch' => '2 x SPDT',
        ]
    ];

    private static $expectedObjects = [
        EntityCollection::RETROFIT_AIR_PRODUCT => [
            [
                'id' => '4732',
                'title' => 'GM24A-TP',
                'datasheet_file_name' => 'GM24A-TP_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_GM24A-TP_4C.jpg',
                'nominal_voltage' => 'AC/DC 24 V',
                'torque' => '40 Nm',
                'stroke' => NULL,
                'working_range' => NULL,
                'running_time' => '150 s',
                'control_type' => 'Open-close',
                'safety_function' => 'safety-function-for-tests',
                'degree_of_protection' => 'IP54',
                'integrated_switch' => 'no',
                'datasheet_file' => 'GM24A-TP_datasheet_en-gb.pdf',
                'is_modulating' => false,
            ],
            [
                'id' => '277726',
                'title' => 'GM24A-MP-TP',
                'datasheet_file_name' => 'GM24A-MP-TP_datasheet_en-gb.pdf',
                'product_image' => 'PIC_EU_GM24A-MF-TP_4C.jpg',
                'nominal_voltage' => null,
                'torque' => '40 Nm',
                'stroke' => NULL,
                'working_range' => 'DC 2...10 V',
                'running_time' => '150 s',
                'control_type' => 'modulating, communicative',
                'safety_function' => 'no',
                'degree_of_protection' => 'IP54',
                'integrated_switch' => 'test X test',
                'datasheet_file' => 'GM24A-MP-TP_datasheet_en-gb.pdf',
                'is_modulating' => true,
            ],
        ],
        EntityCollection::RETROFIT_AIR_ACCESSORY => [
            [
                'id' => '59457',
                'title' => 'S2A',
                'product_image' => 'PIC_EU_S2A_4C.jpg',
                'nominal_voltage' => NULL,
                'torque' => NULL,
                'stroke' => NULL,
                'working_range' => NULL,
                'running_time' => NULL,
                'control_type' => NULL,
                'safety_function' => 'no',
                'degree_of_protection' => 'IP54',
                'integrated_switch' => '2 x SPDT',
            ],
        ],
        EntityCollection::RETROFIT_AIR_ORIGINAL => [
            [
                'id' => '301553',
                'title' => 'SAL1.23S',
                'manufacturer' => 'Joventa',
                'nominal_voltage' => 'AC/DC 24 V',
                'torque' => '24 Nm',
                'stroke' => NULL,
                'running_time' => '125 s',
                'safety_function' => 'no',
                'control_type' => '2- / 3-point',
                'degree_of_protection' => 'IP54',
                'working_range' => NULL,
                'integrated_switch' => '2 x SPDT',
                'is_modulating' => false,
                'replacements' => [
                    [
                        'product' => '4732',
                        'accessories' => ['59457'],
                        'note' => 'accessory S2A with 2 adjustable switching points|',
                    ],
                    [
                        'product' => '277726',
                        'accessories' => ['59457'],
                        'note' => 'for 3-point control, AC only|',
                    ],
                ],
            ],
            [
                'id' => '10004732',
                'title' => 'GM24A-TP',
                'manufacturer' => 'Belimo',
                'nominal_voltage' => 'AC/DC 24 V',
                'torque' => '40 Nm',
                'stroke' => NULL,
                'running_time' => '150 s',
                'control_type' => 'Open-close',
                'safety_function' => 'safety-function-for-tests',
                'working_range' => NULL,
                'replacements' => [
                    [
                        'product' => '4732',
                        'note' => 'This is a 1:1 replacement',
                    ],
                ],
                'is_modulating' => false,
                'integrated_switch' => 'no',
            ],
            [
                'id' => '1000277726',
                'title' => 'GM24A-MP-TP',
                'manufacturer' => 'Belimo',
                'nominal_voltage' => null,
                'torque' => '40 Nm',
                'stroke' => NULL,
                'running_time' => '150 s',
                'control_type' => 'modulating, communicative',
                'safety_function' => 'no',
                'working_range' => 'DC 2...10 V',
                'replacements' => [
                    [
                        'product' => '277726',
                        'note' => 'This is a 1:1 replacement',
                    ],
                ],
                'is_modulating' => true,
                'integrated_switch' => 'test X test',
            ]
        ]
    ];
}

