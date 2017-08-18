<?php

namespace Xiag\Belimo\Import;


class ImportConfig
{
    private $conf;

    /**
     * ImportConfig constructor.
     * @param $conf
     */
    public function __construct($conf)
    {
        $this->conf = $conf;
    }


    /**
     * @retrun string[]
     */
    public function listTargets()
    {
        return array_keys($this->conf['targets']);
    }

    /**
     * @param string $target
     * @return ImportGroupsConfig
     */
    public function getGroupsConfig($target)
    {
        return new ImportGroupsConfig(
            $this->conf['targets'][$target],
            $this->conf['file_source_root'] . '/' . $target
        );
    }
}
