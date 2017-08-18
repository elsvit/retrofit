<?php


namespace Test\Integration\Xiag\Belimo\Import;


class DataProcessorTestBase extends \PHPUnit_Framework_TestCase
{
    protected function objIndex(array $objects, $id, $assertMsg = 'object was found in array')
    {
        $idx = array_search($id, array_column($objects, 'id'));
        $this->assertNotFalse($idx, $assertMsg);
        return $idx;
    }
}
