<?php
namespace Xiag\Belimo\Storage;

/**
 * Say you have some collection / table / JSON file with same schema of data inside.
 * What fields should be used for collecting filtering set?
 * What fields should be used for full-text search?
 */
class Schema
{
    /**
     * These fields are used mostly by Storage
     * @return string[]
     */
    public static function serviceFields()
    {
        return [
            '_id',
            '_lastModified'
        ];
    }

    /**
     * What fields of records present in collection/table/file
     * @param string $collection
     * @return string[]
     */
    public static function allFields($collection)
    {
        $fields = [];

        // specials
        $fields = array_merge($fields, self::serviceFields());

        switch ($collection) {
            case 'retrofit_air_original':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'nominal_voltage',
                    'power_consumption',
                    'connection',
                    'sound_power_level',
                    'torque',
                    'running_time',
                    'control_type',
                    'integrated_switch',
                    'integrated_potentiometer',
                    'degree_of_protection',
                    'manufacturer',
                    'replacements',
                    'safety_function'
                ]);
                break;

            case 'retrofit_water_original':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'series',
                    'manufacturer',
                    'dn',
                    'valve_type',
                    'type',
                    'replacements',
                ]);
                break;

            case 'retrofit_air_product':
            case 'retrofit_air_accessory':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'ambient_temperature',
                    'auxiliary_switch',
                    'data_sheet_name',
                    'protection_iec_en',
                    'nominal_voltage',
                    'supply_port_control',
                    'product_image',
                    'datasheet_file',
                    'safety_function',
                    'working_range',
                    'actuating_signal_y_changeable',
                    'engine_torque',
                    'spindle_driver',
                    'dampers_up_to',
                    'power_consumption_operation',
                    'power_consumption_idle',
                    'power_consumption_dimensioning',
                    'engine_runtime',
                    'engine_sound_level',
                    'driving',
                    'engine_running_direction',
                ]);
                break;

            case 'retrofit_water_product':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'datasheet_file_name',
                    'product_image',
                    'nominal_voltage',
                    'torque',
                    'actuating_force',
                    'control_type',
                    'running_time',
                    'actuating_time',
                    'fail_safe_function',
                    'datasheet_file',
                ]);
                break;

            case 'valvesizer_product':
                $fields = array_merge($fields, [
                    'valve_type',
                    'pipe_connector_type',
                    'pipe_connector_count',
                    'pn',
                    'pn_values',
                ]);
                break;

            case 'valvesizer_combo':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'valve',
                    'actuator',
                    'ruleset',
                    'closing_pressure',
                    'differential_pressure',
                    'rulesets'
                ]);
                break;

            case 'valvesizer_valve':
                $fields = array_merge($fields, [
                    'id',
                    'title',
                    'product_image',
                    'data_sheet_file',
                    'dn',
                    'pn',
                    'pressure_max',
                    'kvs',
                    'pipe_connector',
                    'pipe_connector_count',
                    'family',
                    'valve_type',
                    'pn_values',
                    'pipe_connector_type',
                    'pipe_connector_type_def',
                    'valve_def',
                    'valve_pressure_def'
                ]);
                break;

            default:
                $fields = [];
                break;
        }

        return $fields;
    }

    /**
     * What fields are reasonable for DISTINCT for external user
     * @param string $collection
     * @return string[]
     */
    public static function filteringFields($collection)
    {
        $fields = self::allFields($collection);

        // removing specials
        $fields = array_diff($fields, self::serviceFields());

        switch ($collection) {
            case 'retrofit_air_original':
                $fields = array_diff($fields, [
                    'id',
                    'title',
                    'replacements'
                ]);
                break;

            case 'retrofit_water_original':
                $fields = array_diff($fields, [
                    'id',
                    'title',
                    'replacements'
                ]);
                break;

            case 'retrofit_air_product':
            case 'retrofit_air_accessory':
                $fields = array_diff($fields, [
                    'id',
                    'title',
                    'product_image'
                ]);
                break;

            case 'retrofit_water_product':
            case 'retrofit_water_accessory':
                $fields = array_diff($fields, [
                    'id',
                    'title',
                    'datasheet_file_name',
                    'product_image',
                    'datasheet_file',
                ]);
                break;

            case 'valvesizer_product':
                $fields = array_merge($fields, [
                    'valve_type',
                    'pipe_connector_type',
                    'pipe_connector_count',
                    'pn',
                    'pn_values'
                ]);
                break;

            case 'valvesizer_combo':
                $fields = array_diff($fields, [
                    'id',
                    'title',
                    'ruleset',
                    'closing_pressure',
                    'differential_pressure',
                    'rulesets'
                ]);
                break;

            case 'valvesizer_valve':
                $fields = array_diff($fields, [
                    'id',
                    'pn',
                    'valve_def',
                    'pipe_connector_type_def',
                    'pipe_connector_count',
                    'valve_pressure_def'
                ]);
                break;

            default:
                $fields = [];
                break;
        }

        return $fields;
    }

    /**
     * What fields are eligable for text search
     * @param string $collection
     * @return string[]
     */
    public static function textSearchFields($collection)
    {
        switch ($collection) {
            case 'retrofit_air_original':
                $fields = [
                    'title',
                    'manufacturer'
                ];
                break;
            case 'retrofit_air_product':
            case 'retrofit_air_accessory':
            case 'retrofit_water_original':
                $fields = [
                    'title',
                    'manufacturer'
                ];
                break;
            case 'retrofit_water_product':
                $fields = [
                    'title'
                ];
                break;
            case 'valvesizer_product':
                $fields = [
                    'title'
                ];
                break;

            default:
                $fields = [];
                break;
        }

        return $fields;
    }
}
