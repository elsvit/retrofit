<?php

namespace Xiag\Belimo\Import;


class Validator implements ValidatorInterface
{

    private $conf;

    /**
     * CheckImpl constructor.
     * @param $conf
     */
    public function __construct($conf)
    {
        $this->conf = $conf;
    }


    function fileExists($name, $category)
    {
        $root = $this->conf['file_storage_root'] . "/retrofit";
        switch($category) {
            case ValidatorInterface::FILE_DATASHEET: return file_exists("$root/specifications/$name");
            case ValidatorInterface::FILE_IMAGE: return file_exists("$root/images/$name");
            default: throw new ImportException("Unknown file category $category");
        }
    }
}