<?php

namespace Xiag\Belimo\Import\Retrofit;


use Normalizer;
use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\FileExistenceValidator;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\Util;

class AirProductDataProcessor
{

    public static function process(
        array $data,
        ImportFilesValidator $productFilesValidator,
        FileExistenceValidator $accessoryImageValidator)
    {
        $products = $data['product'];
        $accessories = $data['accessory'];
        $originals = $data['original'];

        foreach ($products as &$_) {
            $_['datasheet_file'] = trim($_['datasheet_file_name']);
            $_['product_image'] = self::normalizeImageFileName($_['product_image']);
            list(, $_['product_image']) = $productFilesValidator->validate($_['datasheet_file'], $_['product_image']);

            self::adjustAttributes($_);
        }
        unset($_);

        foreach ($originals as &$_) {
            self::adjustAttributes($_, 'yesOrEmpty');
        }
        unset($_);

        $selfReplacements = array();
        foreach ($products as &$_) {
            $selfReplacement = array(
                'product' => $_['id'],
                'note' => "@@replacement11"
            );

            $replacements = array();
            array_push($replacements, $selfReplacement);

            array_push(
                $selfReplacements,
                array(
                    'id' => '1000' . $_['id'],
                    'title' => $_['title'],
                    'manufacturer' => 'Belimo',
                    'nominal_voltage' => $_['nominal_voltage'],
                    'torque' => $_['torque'],
                    'stroke' => $_['stroke'],
                    'running_time' => $_['running_time'],
                    'control_type' => $_['control_type'],
                    'safety_function' => $_['safety_function'],
                    'working_range' => $_['working_range'],
                    'replacements' => $replacements,
                    'is_modulating' => $_['is_modulating'],
                    'integrated_switch' => $_['integrated_switch']
                )
            );
        }
        unset($_);

        foreach ($accessories as &$_) {
            $_['product_image'] = self::normalizeImageFileName($_['product_image']);
            if (!$accessoryImageValidator->validate($_['product_image'])) {
                $_['product_image'] = '';
            }

            $_['safety_function'] = Util::valueOrEmpty($_, 'safety_function');
        }
        unset($_);

        $objects = [];
        $objects[EntityCollection::RETROFIT_AIR_PRODUCT] = $products;
        $objects[EntityCollection::RETROFIT_AIR_ACCESSORY] = $accessories;

        $procResult = DataProcessor::processOriginals($originals, $products, $accessories);
        $objects[EntityCollection::RETROFIT_AIR_ORIGINAL] = array_merge($procResult['originals'], $selfReplacements);

        $result['objects'] = $objects;
        $result['unavailableReplacements'] = $procResult['unavailableReplacements'];
        $result['missingAccessories'] = $procResult['missingAccessories'];

        return $result;
    }

    private static function adjustAttributes(&$_, $adjustSafetyFunction = 'valueOrEmpty')
    {
        $_['is_modulating'] = false;
        // TODO: translations of 'modulating'
        if (strpos($_['control_type'], 'modulating') !== false) {
            $_['is_modulating'] = true;
            $_['control_type'] = trim(Normalizer::normalize($_['control_type'], Normalizer::FORM_KC));
            $_['control_type'] = str_replace("|", ", ", $_['control_type']);
        }

        $_['safety_function'] = call_user_func(Util::class . "::$adjustSafetyFunction", $_, 'safety_function');
        $_['integrated_switch'] = Util::valueOrEmpty($_, 'integrated_switch');

        if (isset($_['nominal_voltage'])) {
            $_['nominal_voltage'] = trim(Normalizer::normalize($_['nominal_voltage'], Normalizer::FORM_KC));
        }
    }

    private static function normalizeImageFileName($fileName)
    {
        return trim(preg_replace('@^(.+?)\.tif$@ui', '$1.jpg', $fileName));
    }
}
