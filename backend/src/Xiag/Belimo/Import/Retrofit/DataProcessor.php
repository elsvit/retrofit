<?php


namespace Xiag\Belimo\Import\Retrofit;



class DataProcessor
{
    public static function processOriginals($originals, $products, $accessories)
    {
        $missingAccessories = [];
        $unavailableReplacements = [];
        $processed = [];
        foreach ($originals as $original) {
            $replacements = self::findReplacements($original, $products, $accessories);
            if (sizeof($replacements['available']) > 0) {
                $original['replacements'] = $replacements['available'];
            }
            $unavailableReplacements =
                array_unique(array_merge($unavailableReplacements, $replacements['unavailable']));
            $missingAccessories =
                array_unique(array_merge($missingAccessories, $replacements['missingAccessories']));

            self::cleanupOriginalEntry($original);
            $processed[] = $original;
        }

        $result['originals'] = $processed;
        $result['unavailableReplacements'] = $unavailableReplacements;
        $result['missingAccessories'] = $missingAccessories;

        return $result;
    }

    private static function cleanupOriginalEntry(array &$originalEntry)
    {
        // Removing "replacement_*" and "accessory_*" columns
        foreach (range(1, 4) as $replacementColumnNumber) {
            unset($originalEntry["replacement_{$replacementColumnNumber}"]);
            unset($originalEntry["replacement_note_{$replacementColumnNumber}"]);
            foreach (range(1, 4) as $replacementAccessoryColumnNumber) {
                unset($originalEntry["accessory_{$replacementColumnNumber}_{$replacementAccessoryColumnNumber}"]);
            }
        }
    }

    private static function collectAccessories($original, $accessories, $replacementColumn)
    {
        $collectedAccessories = [];
        $missingAccessories = [];

        foreach (range(1, 4) as $accessoryColumn) {
            $columnName = 'accessory_' . $replacementColumn . '_' . $accessoryColumn;
            if (isset($original[$columnName]) && !empty($original[$columnName])) {
                $replacementAccessoryNumbers = explode('|', $original[$columnName]);
                foreach ($replacementAccessoryNumbers as $replacementAccessoryNumber) {
                    $accessoryKey = array_search($replacementAccessoryNumber, array_column($accessories, 'title'));

                    if ($accessoryKey !== false) {
                        $collectedAccessories[] = $accessories[$accessoryKey]['id'];
                    } else {
                        $missingAccessories[$replacementAccessoryNumber] = true;
                    }
                }
            }
        }
        return ['collected' => $collectedAccessories, 'missing' => array_keys($missingAccessories)];
    }

    private static function findReplacements($original, $products, $accessories)
    {
        $replacements = [];
        $unavailable = [];
        $missingAccessories = [];

        foreach (range(1, 4) as $replacementColumn) {
            $replacementNumbers = explode('|', $original['replacement_' . $replacementColumn]);

            foreach ($replacementNumbers as $replacementNumber) {
                $productKey = array_search($replacementNumber, array_column($products, 'title'));

                // Only add more actions if product was found (skip if not found)
                if ($productKey !== false) {
                    $result = self::collectAccessories($original, $accessories, $replacementColumn);
                    $missingAccessories = array_unique(array_merge($missingAccessories, $result['missing']));

                    $product = [
                        'product' => $products[$productKey]['id']
                    ];

                    if (sizeof($result['collected']) > 0) {
                        $product['accessories'] = $result['collected'];
                    }

                    // Add note for replacements
                    if (isset($original['replacement_note_' . $replacementColumn])) {
                        $product['note'] = $original['replacement_note_' . $replacementColumn];
                    }

                    $replacements[] = $product;
                } else {
                    if ($replacementNumber) {
                        $unavailable[$replacementNumber] = true;
                    }
                }
            }
        }

        return [
            'available' => $replacements,
            'unavailable' => array_keys($unavailable),
            'missingAccessories' => $missingAccessories
        ];
    }
}
