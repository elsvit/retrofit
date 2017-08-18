<?php


namespace Xiag\Belimo\Import;


class ImportFilesValidator
{
    /**
     * @var FileExistenceValidator
     */
    private $datasheetValidator;
    /**
     * @var FileExistenceValidator
     */
    private $imageValidator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->datasheetValidator = new FileExistenceValidator($validator, ValidatorInterface::FILE_DATASHEET);
        $this->imageValidator = new FileExistenceValidator($validator, ValidatorInterface::FILE_IMAGE);
    }


    public function validate($datasheetFile, $imageFile)
    {
        if (!$this->datasheetValidator->validate($datasheetFile)) {
            $datasheetFile = '';
        }
        if (!$this->imageValidator->validate($imageFile)) {
            $imageFile = '';
        }

        return [$datasheetFile, $imageFile];
    }

    public function report(Logger $logger, $datasheetDescr, $imageDescr)
    {
        $this->datasheetValidator->report($logger, $datasheetDescr, Logger::ERROR);
        $this->imageValidator->report($logger, $imageDescr, Logger::WARN);
    }
}
