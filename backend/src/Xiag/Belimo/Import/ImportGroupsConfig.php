<?php

namespace Xiag\Belimo\Import;


class ImportGroupsConfig
{
    private $conf;

    /**
     * ImportGroupsConfig constructor.
     * @param array $conf
     * @param string $baseDir
     */
    public function __construct($conf, $baseDir)
    {
        $this->conf = [];
        foreach ($conf as $group => $cfg) {
            $this->conf[$group] = [];
            foreach ($conf[$group] as $id => $fileName) {
                $this->conf[$group][$id] = $baseDir . '/' . $group . '/' . $fileName;
            }
        }
    }


    public function listGroups() {
        return array_keys($this->conf);
    }

    public function getFiles($group)
    {
        return $this->conf[$group];
    }
}
