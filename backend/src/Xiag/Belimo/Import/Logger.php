<?php


namespace Xiag\Belimo\Import;


interface Logger
{
    const TRACE = 4;
    const INFO = 3;
    const WARN = 2;
    const ERROR = 1;
    const NONE = 0;

    function log($level, ...$sprintf);

    function trace(...$sprintf);

    function info(...$sprintf);

    function warn(...$sprintf);

    function error(...$sprintf);

    function setLevel($level);
}
