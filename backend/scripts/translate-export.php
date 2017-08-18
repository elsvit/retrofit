<?php
require_once __DIR__ . '/../../vendor/autoload.php';

// Configuration
$configuration = require_once __DIR__ . '/../configuration/application.php';

// Arguments
foreach ($argv as &$v) {
    $v = 0 === strpos($v, '--') ? strtolower($v) : $v;
}
unset($v);

// Operation mode
if (in_array('-h', $argv) || in_array('--help', $argv)) {
    echo
    "\nUsage: php {$argv[0]} [--help|-h] [--test|-t] [--quiet|-q]\n\n",
    str_repeat(' ', 4), "--help\n",
    str_repeat(' ', 4), "-h\n",
    str_repeat(' ', 8), "Output this help\n\n";
    die (0);
}
$quietMode = (in_array('-q', $argv) || in_array('--quiet', $argv));
$testMode = (in_array('-t', $argv) || in_array('--test', $argv));

if ($quietMode) {
    ob_start();
}

function file_get_contents_utf8($fn) {
     $content = file_get_contents($fn);
      return mb_convert_encoding($content, 'UTF-8',
          mb_detect_encoding($content, 'UTF-8, ISO-8859-1', true));
}

function collectKeys(array $translations, $prefix = "") {

    if (is_array($translations)) {
        $translationsMapping = array();
        foreach ($translations as $key => $value) {
            if (is_array($value)) {
                $translationsMapping = array_merge($translationsMapping, collectKeys($value, $prefix . $key . "."));
            } else {
              $translationsMapping[$prefix . $key] = $value;
            }
        }
        return $translationsMapping;
    } else {
        return $translations;
    }

}

$locales = array('de_CH', 'en_US', 'it_CH');
//$locales = array('de_CH');

$translationsComplete = array();

foreach ($locales as $key => $localeString) {
    $translationsCommonRaw  = file_get_contents_utf8(__DIR__ . '/../../react/DOM/translations/' . $localeString . '.common.json');
    $translationsRetrofitRaw  = file_get_contents_utf8(__DIR__ . '/../../react/DOM/translations/' . $localeString . '.retrofit.json');

    $translationsCommonArray = json_decode($translationsCommonRaw, true);
    $translationsRetroFitArray = json_decode($translationsRetrofitRaw, true);

    $translationsComplete[$localeString] = array_merge(
      collectKeys($translationsCommonArray),
      collectKeys($translationsRetroFitArray)
    );
}

$csv = array();
$csv[] = "KEY|EN|DE|IT\n";

// Iterate master sheet
foreach ($translationsComplete['en_US'] as $translateKey => $translation) {
    $csvRow = $translateKey . "|" . "" . $translation . "|";

    if (isset($translationsComplete['de_CH'][$translateKey])) {
        $csvRow .= "" . $translationsComplete['de_CH'][$translateKey] . "|";
    } else {
        $csvRow .= "|";
    }

    if (isset($translationsComplete['it_CH'][$translateKey])) {
        $csvRow .= "" . $translationsComplete['it_CH'][$translateKey] . "|";
    } else {
        $csvRow .= "|";
    }
    $csvRow .= "\n";

    $csv[] = $csvRow;
}

file_put_contents("retrofit_export.csv", utf8_encode(implode($csv, "")));

// Output something
echo PHP_EOL, 'Export finished';

echo PHP_EOL, PHP_EOL;
if ($quietMode) {
    ob_end_clean();
}
die(0);
