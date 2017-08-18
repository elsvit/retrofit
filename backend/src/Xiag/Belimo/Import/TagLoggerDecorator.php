<?php

namespace Xiag\Belimo\Import;

class TagLoggerDecorator implements Logger
{
    private $logger;
    private $tag;

    /**
     * TagLoggerDecorator constructor.
     * @param Logger $logger
     * @param string $tag
     */
    public function __construct(Logger $logger, $tag)
    {
        $this->logger = $logger;
        $this->tag = $tag;
    }


    public function log($level, ...$sprintf)
    {
        $this->logger->log($level, $this->tag . sprintf(...$sprintf));
    }

    function trace(...$sprintf)
    {
        $this->log(Logger::TRACE, ...$sprintf);
    }

    function info(...$sprintf)
    {
        $this->log(Logger::INFO, ...$sprintf);
    }

    function warn(...$sprintf)
    {
        $this->log(Logger::WARN, ...$sprintf);
    }

    function error(...$sprintf)
    {
        $this->log(Logger::ERROR, ...$sprintf);
    }

    function setLevel($level)
    {
        $this->logger->setLevel($level);
    }
}
