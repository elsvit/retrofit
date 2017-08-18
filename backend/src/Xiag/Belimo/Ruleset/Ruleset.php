<?php
namespace Xiag\Belimo\Ruleset;


class Ruleset
{

    protected $ruleSet1 = array(
        'pressure'              => array('pressure_dependent'),
        'valve_type'            => array('change_over_valve', 'shut_off_valve'),
        'pipe_connector'        => array('internal_thread', 'external_thread', 'flange'),
        'pipe_connector_count'  => array('2_way', '3_way'),
        'pn'                    => array('6', '10', '16')
    );

    protected $ruleSet2 = array(
        'pressure'              => array('pressure_dependent'),
        'valve_type'            => array('control_valve'),
        'pipe_connector'        => array('internal_thread', 'external_thread', 'flange'),
        'pipe_connector_count'  => array('2_way', '3_way'),
        'pn'                    => array('6', '10', '16', '25', '40')
    );

    protected $ruleSet3 = array(
        'pressure'              => array('pressure_independent'),
        'valve_type'            => array('control_valve'),
        'pipe_connector'        => array('internal_thread', 'flange'),
        'pipe_connector_count'  => array('2_way'),
        'pn'                    => array('16')
    );

    protected $ruleSet4 = array(
        'pressure'              => array('pressure_independent'),
        'valve_type'            => array('control_valve'),
        'pipe_connector'        => array('internal_thread'),
        'pipe_connector_count'  => array('2_way'),
        'pn'                    => array('25')
    );

    /**
     * @param array $valveData
     * @return int|void
     */
    public function getRuleSet(array $valveData)
    {
        if ($this->isRuleset($valveData, $this->ruleSet1)) {
            return 1;
        }

        if ($this->isRuleset($valveData, $this->ruleSet2)) {
            return 2;
        }

        if ($this->isRuleset($valveData, $this->ruleSet3)) {
            return 3;
        }

        if ($this->isRuleset($valveData, $this->ruleSet4)) {
            return 4;
        }

        return 0;
    }

    /**
     * @param array $valveData
     * @param array $ruleSet
     * @return bool
     */
    protected function isRuleset(array $valveData, array $ruleSet)
    {
        if (in_array($valveData['valve_pressure_def'], $ruleSet['pressure'])
            && in_array($valveData['valve_def'], $ruleSet['valve_type'])
            && isset($valveData['pipe_connector_count_def'])
            && in_array($valveData['pipe_connector_type_def'], $ruleSet['pipe_connector'])
            && in_array($valveData['pipe_connector_count_def'], $ruleSet['pipe_connector_count'])
            && in_array($valveData['pn'], $ruleSet['pn'])) {
            return true;
        }
        return false;
    }

}