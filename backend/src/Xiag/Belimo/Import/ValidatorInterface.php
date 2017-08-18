<?php

namespace Xiag\Belimo\Import;


interface ValidatorInterface
{
    const FILE_DATASHEET = 1;
    const FILE_IMAGE = 2;

    function fileExists($name, $category);
}