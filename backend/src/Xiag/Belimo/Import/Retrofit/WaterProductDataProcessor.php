<?php


namespace Xiag\Belimo\Import\Retrofit;


use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\ImportFilesValidator;

class WaterProductDataProcessor
{

    public static function process(array $data, ImportFilesValidator $filesValidator)
    {
        $products = $data['product'];
        $accessories = $data['accessory'];
        $originals = $data['original'];

        foreach ($originals as &$_) {
            $_['type'] = $_['title'];
        }
        unset($_);

        // Mutations for products
        foreach ($products as &$_) {
            $_['datasheet_file'] = trim($_['datasheet_file_name']);
            list(, $_['product_image']) = $filesValidator->validate($_['datasheet_file'], trim($_['product_image']));

            if (isset($_['actuating_time_motor'])) {
                $_['actuating_time'] = $_['actuating_time_motor'];
            }
        }
        unset($_);

        // Products saving
        $objects = [];
        $objects[EntityCollection::RETROFIT_WATER_PRODUCT] = $products;
        $objects[EntityCollection::RETROFIT_WATER_ACCESSORY] = $accessories;

        $procResult = DataProcessor::processOriginals($originals, $products, $accessories);
        $objects[EntityCollection::RETROFIT_WATER_ORIGINAL] = $procResult['originals'];

        $result['objects'] = $objects;
        $result['unavailableReplacements'] = $procResult['unavailableReplacements'];
        $result['missingAccessories'] = $procResult['missingAccessories'];

        return $result;
    }
}
