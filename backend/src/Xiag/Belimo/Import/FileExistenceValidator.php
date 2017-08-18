<?php

namespace Xiag\Belimo\Import;


class FileExistenceValidator
{
    /**
     * @var ValidatorInterface
     */
    private $validator;
    private $fileCategory;

    private $missing = [];
    private $numFound = 0;

    /**
     * FileExistenceValidator constructor.
     * @param ValidatorInterface $validator
     * @param int $fileCategory One of ValidatorInterface::FILE_*
     */
    public function __construct(ValidatorInterface $validator, $fileCategory)
    {
        $this->validator = $validator;
        $this->fileCategory = $fileCategory;
    }


    public function validate($fileName)
    {
        if (!empty($fileName) && !$this->validator->fileExists($fileName, $this->fileCategory)) {
            $this->missing[$fileName] = $fileName;
            return false;
        }
        $this->numFound++;
        return true;
    }

    public function report(Logger $logger, $typeDescription, $level = Logger::ERROR)
    {
        if (sizeof($this->missing) > 0) {
            foreach ($this->missing as $key => $missingFile) {
                $logger->log($level, "$typeDescription: missing %s", $missingFile);
            }
        }
        $logger->info("$typeDescription: found %d, missing %d", $this->numFound, sizeof($this->missing));
    }
}
