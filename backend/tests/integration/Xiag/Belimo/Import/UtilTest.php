<?php


namespace Test\Integration\Xiag\Belimo\Import;


use Xiag\Belimo\Import\ColumnExtractorConfig;
use Xiag\Belimo\Import\Util;

class UtilTest extends \PHPUnit_Framework_TestCase
{
    public function testExtractsColumns()
    {
        $data = [
            ['A' => 'aaa1', 'C' => 'a + b', 'E' => ''],
            ['A' => 'aaa2', 'C' => 'f - g', 'E' => 'eee2']
        ];

        $columns = [
            'A' => 'column_a',
            'C' => 'column_c',
            'E' => 'column_e',
        ];
        $filter = [
            'C' => 'CONTAINS:+'
        ];

        $result = Util::extractColumns($data, new ColumnExtractorConfig($columns, $filter));
        $this->assertEquals([['column_a' => 'aaa1', 'column_c' => 'a + b', 'column_e' => null]], $result);
    }
}
