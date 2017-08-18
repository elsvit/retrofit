<?php

namespace Xiag\Belimo\Import;


use ConsoleKit\Colors;

class OutputStreamLogger implements Logger
{
    private $level;
    private $useColors;
    private $stream;

    private static $tags = [
        Logger::TRACE => '[trace]',
        Logger::INFO => '[info]',
        Logger::WARN => '[warn]',
        Logger::ERROR => '[error]'
    ];

    private static $colors = [
        Logger::TRACE => Colors::CYAN,
        Logger::INFO => Colors::GREEN,
        Logger::WARN => Colors::YELLOW,
        Logger::ERROR => Colors::RED
    ];

    /**
     * OutputStreamLogger constructor.
     * @param bool $useColors
     * @param $level
     * @param resource $stream
     */
    public function __construct($useColors, $level = Logger::INFO, $stream = STDOUT)
    {
        $this->useColors = $useColors;
        $this->stream = $stream;
        $this->setLevel($level);
    }

    public function log($level, ...$sprintf)
    {
        if ($level <= $this->level) {
            $tag = self::$tags[$level];
            if ($this->useColors) {
                $tag = Colors::colorize($tag, self::$colors[$level]);
            }
            $this->write($tag, sprintf(...$sprintf));
        }
    }

    public function trace(...$sprintf)
    {
        $this->log(Logger::TRACE, sprintf(...$sprintf));
    }

    public function info(...$sprintf)
    {
        $this->log(Logger::INFO, sprintf(...$sprintf));
    }

    public function warn(...$sprintf)
    {
        $this->log(Logger::WARN, sprintf(...$sprintf));
    }

    public function error(...$sprintf)
    {
        $this->log(Logger::ERROR, sprintf(...$sprintf));
    }

    function setLevel($level)
    {
        $this->level = $level;
    }

    private function write($tag, $text)
    {
        fprintf($this->stream, "%s %s\n", $tag, $text);
    }
}
