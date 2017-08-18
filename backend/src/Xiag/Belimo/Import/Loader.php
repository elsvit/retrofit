<?php

namespace Xiag\Belimo\Import;


interface Loader
{
    function load(array $files, ValidatorInterface $validator);
}
