<?php
namespace Xiag\Belimo\Import;

class Filter
{
    const CONTAINS = "CONTAINS";
    const NOT_EMPTY = "NOT_EMPTY";
    const NO_VALUE = "NO_VALUE";

    /**
     * @param $filterDefinition
     * @param $value
     * @return bool
     */
    public static function isTrue($filterDefinition, $value)
    {
        // Contains rule
        if (self::contains($filterDefinition, self::CONTAINS)) {
            return self::contains($value, str_replace(self::CONTAINS . ":", '', $filterDefinition));
        }

        // Not empty rule
        if (self::contains($filterDefinition, self::NOT_EMPTY)) {
            return !empty($value);
        }

        // Not value rule
        if (self::contains($filterDefinition, self::NO_VALUE)) {
            return empty($value);
        }

        return false;
    }

    /**
     * Helper method
     *
     * @param $haystack
     * @param $needle
     * @return bool
     */
    private static function contains($haystack, $needle)
    {
        return strpos($haystack, $needle) !== false;
    }

}