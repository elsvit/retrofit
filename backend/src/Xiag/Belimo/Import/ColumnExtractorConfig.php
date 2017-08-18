<?php

namespace Xiag\Belimo\Import;


class ColumnExtractorConfig
{
    /**
     * @var array $columns
     */
    private $columns;
    /**
     * @var array $filter
     */
    private $filter;

    /**
     * PreprocessorConfig constructor.
     * @param array $columns
     * @param array $filter
     */
    public function __construct(array $columns, array $filter)
    {
        $this->columns = $columns;
        $this->filter = $filter;
    }

    /**
     * @return array
     */
    public function getColumns()
    {
        return $this->columns;
    }

    /**
     * @return array
     */
    public function getFilter()
    {
        return $this->filter;
    }


}
