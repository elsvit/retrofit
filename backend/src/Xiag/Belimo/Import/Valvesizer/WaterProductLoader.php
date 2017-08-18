<?php

namespace Xiag\Belimo\Import\Valvesizer;


use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\Import\AbstractLoader;
use Xiag\Belimo\Import\FileExistenceValidator;
use Xiag\Belimo\Import\ImportException;
use Xiag\Belimo\Import\ImportFilesValidator;
use Xiag\Belimo\Import\Logger;
use Xiag\Belimo\Import\ValidatorInterface;
use Xiag\Belimo\Ruleset\ClipPosition;
use Xiag\Belimo\Ruleset\Ruleset;


class WaterProductLoader extends AbstractLoader
{
    private static $descriptors = [
        'valve' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'U' => 'product_image',                               // 377
                'S' => 'data_sheet_file',                             // 660

                'C' => 'valve_family',                                // 891
                'V' => 'dn',                                          // 15
                'W' => 'pn',                                          // 528
                'X' => 'pressure_max',                                // 23
                'AB' => 'kvs',                                         // 14
                'AE' => 'kvmax',                                       // 78
                'AR' => 'pipe_connector',                              // 6561
                'AQ' => 'pipe_connector_count',                        // 6560
                'AJ' => 'vnom_l_min',                                  // 6516
                'R' => 'family',                                      // 406
                'D' => 'family_short',                                // 6667
                'AU' => 'valve_type',                                  // 6666
                'AK' => 'vnom',                                        // 7153
                'AL' => 'vpos_max_1',                                  // 548
                'AM' => 'vpos_max_2',                                  // 549
                'AN' => 'vpos_max_3',                                  // 7311
                'E' => 'product_type',                                // 6691
                'AA' => 'differential_pressure_max',                   // 28
                'AG' => 'kvs_theoretical',                             // 6827
                'F' => 'medium_temp'                                  // 22
            ],
            'filter' => []
        ],
        'actuator' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'S' => 'data_sheet_file',                             // 660

                'P' => 'torque',                                       // 260
                'Q' => 'degree_of_protection',                         // 144
                'U' => 'product_image',                                // 377
                'K' => 'running_time',                                 // 230
                'L' => 'actuating_time',                               // 6650
                'M' => 'actuating_force',                              // 118
                'O' => 'nominal_voltage',                              // 83
                'G' => 'control',                                      // 281
                'J' => 'emergency_control_function'                    // 6577
            ],
            'filter' => [
                // '{actuator}' is replaced with actual word in a certain language, see below
                'E' => 'CONTAINS:{actuator}'
            ]
        ],
        'combos' => [
            'columns' => [
                'A' => 'id',
                'B' => 'title',
                'E' => 'valve',
                'G' => 'actuator',
                'J' => 'ruleset',
                'Q' => 'closing_pressure',
                'R' => 'differential_pressure_max'
            ],
            'filter' => []
        ]
    ];

    // TODO: get rid of this garbage and use machine-readable codes. Requires changing format
    // and reimplementing export on customer's side
    private static $constants = [
        'actuator' => ['default' => 'Actuator', 'de-ch' => 'Antrieb'],
        'internal_thread' => ['default' => 'Internal thread', 'de-ch' => 'Innengewinde'],
        'external_thread' => ['default' => 'External thread', 'de-ch' => 'Aussengewinde'],
        'flange' => ['default' => 'Flange', 'de-ch' => 'Flansch'],
        '2-way' => ['default' => '2-way', 'de-ch' => '2-Weg'],
        '3-way' => ['default' => '3-way', 'de-ch' => '3-Weg'],
        '6-way' => ['default' => '6-way', 'de-ch' => '6-Weg'],
        'control_valve' => ['default' => 'Control valve', 'de-ch' => 'Regelventil'],
        'change_over_valve' => ['default' => 'Change-over valve', 'de-ch' => 'Umschaltventil'],
        'shut_off_valve' => ['default' => 'Shutt-off valve', 'de-ch' => 'Absperrventil'],
        'pressure_independent' => ['default' => 'Pressure independent', 'de-ch' => 'Druckunabhängig'],
    ];

    private function langVal($key)
    {
        if (!isset(self::$constants[$key])) {
            throw new ImportException("Unknown language value key $key");
        }
        if (!isset(self::$constants[$key][$this->target])) {
            throw new ImportException("Unknown language value $key:$this->target");
        }
        return self::$constants[$key][$this->target];
    }

    protected function getFileDescriptors(array $files)
    {
        $descriptors = self::$descriptors;
        $filter = $descriptors['actuator']['filter']['E'];
        $descriptors['actuator']['filter']['E'] = str_replace('{actuator}', $this->langVal('actuator'), $filter);
        return self::createFileDescriptors([
            'valve' => $files['products'],
            'actuator' => $files['products'],
            'combos' => $files['combos'],
        ], $descriptors);
    }

    protected function doLoad(array $data, ValidatorInterface $validator)
    {
        $products = $data['valve'];
        $actuators = $data['actuator'];
        $combos = $data['combos'];

        $ruleSet = new Ruleset();
        $clipPosition = new ClipPosition();


        $this->logger->trace('Processing actuators (%d)', count($actuators));
        $filesValidator = new ImportFilesValidator($validator);
        foreach ($actuators as &$_) {
            $_['data_sheet_file'] = trim($_['data_sheet_file']);
            list(, $_['product_image']) = $filesValidator->validate($_['data_sheet_file'], trim($_['product_image']));
        }
        $filesValidator->report($this->logger, 'Actuator datasheets', 'Actuator images');


        $this->logger->trace('Processing valves (%d)', count($products));
        $filesValidator = new ImportFilesValidator($validator);
        // Mutations
        foreach ($products as &$_) {

            $_['data_sheet_file'] = trim($_['data_sheet_file']);
            list(, $_['product_image']) = $filesValidator->validate($_['data_sheet_file'], trim($_['product_image']));

            // Special handling for empty KVS values
            if (!isset($_['kvs']) && isset($_['kvmax'])) {
                $_['kvs'] = $_['kvmax'];
            }

            // Special handling for energy valves
            if (!isset($_['kvs']) && isset($_['kvs_theoretical'])) {
                $_['kvs'] = $_['kvs_theoretical'];
            }

            if (isset($_['title'])) {
                $_['clip_position'] = $clipPosition->getClipPosition($_);
            }

            if (isset($_['pressure_max'])) {
                $_['pressure_max'] = (int)trim(str_replace("kPa", "", $_['pressure_max']));
            }

            if (isset($_['kvs'])) {
                $_['kvs'] = (float)trim(str_replace("m³/h", "", $_['kvs']));
            }

            if (isset($_['kvs_theoretical'])) {
                $_['kvs_theoretical'] = (float)trim(str_replace("m³/h", "", $_['kvs_theoretical']));
            }

            if (isset($_['vnom'])) {
                $_['vnom'] = (float)trim(str_replace("l/h", "", $_['vnom']));
            }

            if (isset($_['vnom_l_min'])) {
                $_['vnom_l_min'] = (float)trim(str_replace("l/min", "", $_['vnom_l_min']));
                $_['kvs'] = $_['vnom_l_min'] * 0.06; // Recalculate it to m3/h and store as kvs
            }

            // Special handling for pressure independent valves
            if ($_['kvs'] == 0 && isset($_['vnom'])) {
                $_['kvs'] = $_['vnom'] / 1000;
            }

            if (isset($_['vpos_max_1'])) {
                $_['vpos_max_1'] = (int)trim(str_replace("l/h", "", $_['vpos_max_1']));
            }

            if (isset($_['vpos_max_2'])) {
                $_['vpos_max_2'] = (int)trim(str_replace("l/h", "", $_['vpos_max_2']));
            }

            if (isset($_['vpos_max_3'])) {
                $_['vpos_max_3'] = (int)trim(str_replace("l/h", "", $_['vpos_max_3']));
            }

            if (isset($_['differential_pressure_max'])) {
                $_['differential_pressure_max'] = (float)trim(str_replace("kPa", "", $_['differential_pressure_max']));
            }

            // PN
            if (isset($_['pn']) && !empty($_['pn'])) {
                $pnSplit = explode("/", $_['pn']);
                $_['pn'] = intval(trim($pnSplit[0]));
                $pnTemp = array();
                foreach ($pnSplit as $key => $pnStringValue) {
                    $pnTemp[] = (int)trim($pnStringValue);
                }
                $_['pn_values'] = $pnTemp;
            }

            // Pipe connector definition
            // Internal thread: 1, External thread: 2, Flange: 3
            if (isset($_['pipe_connector'])) {
                switch (trim($_['pipe_connector'])) {
                    case $this->langVal('internal_thread'):
                        $_['pipe_connector_type'] = 1;
                        $_['pipe_connector_type_def'] = 'internal_thread';
                        break;
                    case $this->langVal('external_thread'):
                        $_['pipe_connector_type'] = 2;
                        $_['pipe_connector_type_def'] = 'external_thread';
                        break;
                    case $this->langVal('flange'):
                        $_['pipe_connector_type'] = 3;
                        $_['pipe_connector_type_def'] = 'flange';
                        break;
                    case '':
                        $_['pipe_connector_type'] = 0;
                        break;
                    default:
                        throw new ImportException(sprintf("Unknown pipe connector '%s'", $_['pipe_connector']));
                }
            }

            // Pipe connector count
            if (isset($_['pipe_connector_count'])) {
                switch (trim($_['pipe_connector_count'])) {
                    case $this->langVal('2-way'):
                        $_['pipe_connector_count'] = '2';
                        $_['pipe_connector_count_def'] = '2_way';
                        break;
                    case $this->langVal('3-way'):
                        $_['pipe_connector_count'] = '3';
                        $_['pipe_connector_count_def'] = '3_way';
                        break;
                    case $this->langVal('6-way'):
                        $_['pipe_connector_count'] = '6';
                        $_['pipe_connector_count_def'] = '6_way';
                        break;
                    case '':
                        $_['pipe_connector_count'] = 0;
                        break;
                    default:
                        throw new ImportException(
                            sprintf("Unknown pipe connector count '%s'", $_['pipe_connector_count']));
                }
            }

            // Valve type
            // Control valve: 1, Change-over valve: 2, Shut-off valve: 3
            if (isset($_['valve_type'])) {
                switch (trim($_['valve_type'])) {
                    case $this->langVal('control_valve'):
                        $_['valve_type'] = 1;
                        $_['valve_def'] = 'control_valve';
                        $_['valve_pressure_def'] = 'pressure_dependent';
                        break;
                    case $this->langVal('change_over_valve'):
                        $_['valve_type'] = 2;
                        $_['valve_def'] = 'change_over_valve';
                        $_['valve_pressure_def'] = 'pressure_dependent';
                        break;
                    case $this->langVal('shut_off_valve'):
                        $_['valve_type'] = 3;
                        $_['valve_def'] = 'shut_off_valve';
                        $_['valve_pressure_def'] = 'pressure_dependent';
                        break;
                    case $this->langVal('pressure_independent'):
                    case '':
                        $_['valve_type'] = 1;
                        $_['valve_def'] = 'control_valve';
                        $_['valve_pressure_def'] = 'pressure_independent';
                        break;
                    default:
                        throw new ImportException(sprintf("Unknown valve type '%s'", $_['valve_type']));
                }
            }

            // Filter all actuators
            if ($_['product_type'] == $this->langVal('actuator')) {
                $_ = false;
            } else {
                // Apply ruleset for a valve
                $_['ruleset'] = $ruleSet->getRuleSet($_);
            }
        }
        unset($_);
        $filesValidator->report($this->logger, 'Product datasheets', 'Product images');

        $this->logger->trace('Processing combos (%d)', count($combos));
        // Mutations for combinations
        foreach ($combos as &$_) {

            if (isset($_['ruleset'])) {
                $rules = explode(PHP_EOL, $_['ruleset']);
                $_['rulesets'] = $rules;
            }

            // filtering combos with unavailable rulesets
            if (!empty($_['rulesets'])) {
                $availableRulesets = ['Scenario 1', 'Scenario 2', 'Scenario 3', 'Scenario 4'];
                $bHaveAvailableRulesets = (count(array_intersect($_['rulesets'], $availableRulesets)) > 0);
                if (!$bHaveAvailableRulesets) {
                    $_ = false;
                    continue;
                }
            }

            if (isset($_['differential_pressure_max'])) {
                $_['differential_pressure_max'] = (float)trim(str_replace("kPa", "", $_['differential_pressure_max']));
            }

            // 'valve_id' column to 'combo' collection
            foreach ($products as $key => $product) {
                if (isset($product['title']) && $_['valve'] === $product['title']) {
                    $_['valve_id'] = $product['id'];

                    // Update products differential pressure max to the maximal combination value
                    if (isset($_['differential_pressure_max']) &&
                        (!isset($product['differential_pressure_max']) ||
                            $_['differential_pressure_max'] > $product['differential_pressure_max'])
                    ) {
                        $products[$key]['differential_pressure_max'] = $_['differential_pressure_max'];
                    }

                    break;
                }
            }
            unset($product);

            // filtering out meaningless combinations
            if (empty($_['valve']) && empty($_['actuator'])) {
                $_ = false;
            }
        }
        unset($_);
        // filtering empty values, appeared after searching for 'valve'=null and 'actuator'=null in combos
        $combos = array_filter($combos);

        foreach ($products as &$_) {
            $mappingExists = array_search($_['id'], array_column($combos, 'valve_id'));
            if ($mappingExists === false) {
                switch ($_['ruleset']) {
                    case 3:
                        break;
                    default:
                        $_ = false;
                        break;
                }
            }
        }
        // Filter all unmapped valves (export contains more products than should be used for app)
        $products = array_filter($products);
        unset($_);


        // Serie collection creation
        $series = [];
        $serieFields = [
            'dn',
            'pn',
            'pressure_max',
            'kvs',
            'pipe_connector',
            'pipe_connector_count',
            'valve_type'
        ];
        foreach ($products as $product) {
            if (!empty($product['family'])) {
                // making new serie if needed
                if (!array_key_exists($product['family'], $series)) {
                    $series[$product['family']] = [
                        'id' => $product['family']
                    ];
                }

                // adding valve to serie
                $series[$product['family']]['valves'][] = $product['id'];
                natcasesort($series[$product['family']]['valves']);
                // killing unordered keys
                $series[$product['family']]['valves'] = array_values($series[$product['family']]['valves']);

                // collecting possible values of fields from products
                foreach ($serieFields as $serieField) {
                    if (!empty($serieField)) {
                        // each field in serie except title is an array
                        if (!array_key_exists($serieField, $series[$product['family']])) {
                            $series[$product['family']][$serieField] = [];
                        }
                        // pushing to serie field new possible value
                        $series[$product['family']][$serieField][] = $product[$serieField];
                        $series[$product['family']][$serieField] = array_unique($series[$product['family']][$serieField]);
                        natcasesort($series[$product['family']][$serieField]);
                        // killing unordered keys
                        $series[$product['family']][$serieField] = array_values($series[$product['family']][$serieField]);
                    }
                }
            }
        }

        $result = [];
        $result[EntityCollection::VALVESIZER_SERIE] = $series;
        $result[EntityCollection::VALVESIZER_VALVE] = $products;
        $result[EntityCollection::VALVESIZER_ACTUATOR] = $actuators;
        $result[EntityCollection::VALVESIZER_COMBO] = $combos;

        return $result;
    }

}
