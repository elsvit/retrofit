<?php

namespace Xiag\Belimo\Ruleset;


class ClipPosition
{

    // Clip position definition A
    protected $clipPositionValves_A = array(
        'C215QP-B', 'C215QPT-B'
    );

    // Clip position definition B
    protected $clipPositionValves_B = array(
        'C215QP-D', 'C215QPT-D'
    );

    // Clip position definition C
    protected $clipPositionValves_C = array(
        'C215QP-B', 'C215QP-D', 'C220QP-F', 'C220QPT-F', 'C215QPT-B', 'C215QPT-D'
    );

    // Clip position definition D
    protected $clipPositionValves_D = array(
        'C215Q-J', 'C220Q-K'
    );

    /**
     * @param array $valveData
     * @return int|void
     */
    public function getClipPosition(array $valveData)
    {
        if (in_array($valveData['title'], $this->clipPositionValves_A)) {
            return 1;
        }

        if (in_array($valveData['title'], $this->clipPositionValves_B)) {
            return 2;
        }

        if (in_array($valveData['title'], $this->clipPositionValves_C)) {
            return 3;
        }

        if (in_array($valveData['title'], $this->clipPositionValves_D)) {
            return 4;
        }

        return 0;
    }

}
