<?php

namespace Xiag\Belimo\Import;


class FileDescriptor
{
    /**
     * @var string
     */
    private $filePath;
    /**
     * @var ColumnExtractorConfig
     */
    private $columnExtractorConfig;

    /**
     * FileDescriptor constructor.
     * @param string $filePath
     * @param ColumnExtractorConfig $columnExtractorConfig
     * @throws ImportException
     */
    public function __construct($filePath, ColumnExtractorConfig $columnExtractorConfig)
    {
        $this->filePath = realpath($filePath);
        if ($this->filePath === false) {
            throw new ImportException("Cannot get real path of $filePath");
        }
        $this->columnExtractorConfig = $columnExtractorConfig;
    }

    /**
     * @return string
     */
    public function getFilePath()
    {
        return $this->filePath;
    }

    /**
     * @return ColumnExtractorConfig
     */
    public function getColumnExtractorConfig()
    {
        return $this->columnExtractorConfig;
    }


}
