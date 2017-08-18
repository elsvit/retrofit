<?php

namespace Xiag\Belimo\Import;


abstract class AbstractLoader implements Loader
{
    /**
     * @var Logger
     */
    protected $logger;
    protected $target;

    private $cache = [];

    public function __construct($target, Logger $logger)
    {
        $this->target = $target;
        $this->logger = $logger;
    }

    public function load(array $files, ValidatorInterface $validator)
    {
        $this->logger->trace('Loader started');

        $data = [];
        $descriptors = $this->getFileDescriptors($files);
        /** @var  FileDescriptor $descriptor */
        foreach($descriptors as $id => $descriptor) {
            $path = $descriptor->getFilePath();
            if (isset($this->cache[$path])) {
                $this->logger->trace('Taking from cache: %s', $path);
                $rows = $this->cache[$path];
            } else {
                $this->logger->trace('Reading %s', $path);
                $rows = Util::readFile($path);
                $this->logger->trace('Read %d rows', count($rows));
                $this->cache[$path] = $rows;
            }
            $data[$id] = Util::extractColumns($rows, $descriptor->getColumnExtractorConfig());
        }
        $this->cache = [];

        $this->logger->trace('Begin processing');
        $result = $this->doLoad($data, $validator);
        $this->logger->trace('Done processing');
        return $result;
    }

    abstract protected function getFileDescriptors(array $files);

    abstract protected function doLoad(array $data, ValidatorInterface $validator);

    protected static function createFileDescriptors(array $files, array $conf)
    {
        $result = [];
        foreach($files as $id => $file) {
            if(empty($conf[$id])) {
                throw new ImportException("Unknown file ID: '$id''");
            }
            $descriptor = $conf[$id];
            $ec = new ColumnExtractorConfig($descriptor['columns'], $descriptor['filter']);
            $result[$id] = new FileDescriptor($file, $ec);
        }
        return $result;
    }

}