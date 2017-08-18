<?php

namespace Xiag\Belimo\Import;


use Box\Spout\Common\Type;
use Box\Spout\Reader\ReaderFactory;

class Util
{
    const FILE_TYPES = [
        'xlsx' => Type::XLSX,
        'csv' => Type::CSV
    ];

    // Number of header lines in a file (not to be parsed)
    const XLSX_SKIP_ROWS = 2;
    const CSV_SKIP_ROWS = 2;

    /**
     * Load data file, file format is detected from extension
     * @param string $filePath realpath to the file
     * @return array sheet data with columns named like in office document and numeric rows
     * @throws ImportException
     * @throws \Box\Spout\Common\Exception\UnsupportedTypeException
     */
    public static function readFile($filePath)
    {
        $fileType = self::getFileTypeByExtension($filePath);
        switch($fileType) {
            case Type::XLSX: return self::readXlsxFile($filePath);
            case Type::CSV: return self::readCsvFile($filePath);
            default: throw new ImportException("Source file has unknown extension: $filePath");
        }
    }

    public static function extractColumns(array $data, ColumnExtractorConfig $config)
    {
        $mappedData = [];
        foreach ($data as $sheetRowNumber => $sheetRowData) {
            foreach ($config->getFilter() as $filterColumn => $filterDefinition) {
                // Only import row if filter applies
                if (!Filter::isTrue($filterDefinition, $sheetRowData[$filterColumn])) {
                    continue 2;
                }
            }

            $mappedRow = [];
            // Copy column definitions to each row
            foreach ($config->getColumns() as $columnSymbolName => $columnVerboseName) {
                $mappedRow[$columnVerboseName] = (!empty($sheetRowData[$columnSymbolName])) ? $sheetRowData[$columnSymbolName] : null;
            }
            $mappedData[] = $mappedRow;
        }

        // Sanitize value
        foreach ($mappedData as $rowNumber => $rowData) {
            foreach ($rowData as $columnName => $value) {
                $mappedData[$rowNumber][$columnName] = self::sanitizeValue($value);
            }
        }

        return $mappedData;
    }

    private static function getFileTypeByExtension($filePath)
    {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        return empty(self::FILE_TYPES[$ext]) ? false : self::FILE_TYPES[$ext];
    }

    private static function readXlsxFile($filePath, $sheetNumber = 1)
    {
        $sheetData = [];
        $reader = ReaderFactory::create(Type::XLSX);
        $reader->open($filePath);

        foreach ($reader->getSheetIterator() as $number => $sheet) {
            if ($sheetNumber !== $number) {
                continue;
            }
            $rowIdx = 0;
            foreach ($sheet->getRowIterator() as $row) {
                if ($rowIdx++ < self::XLSX_SKIP_ROWS) {
                    continue;
                }
                $rowWithNamedColumns = [];
                $columnName = 'A';
                foreach ($row as $value) {
                    $rowWithNamedColumns[$columnName] = strlen($value) ? $value : null;
                    $columnName++;
                }
                $sheetData[] = $rowWithNamedColumns;
            }
        }
        $reader->close();

        return $sheetData;
    }

    private static function readCsvFile($filePath)
    {
        if (!is_readable($filePath)) {
            throw new ImportException('CSV source file is not readable: ' . $filePath);
        }
        // Most PHP CSV parsers out there (including Box\Spout) cannot handle newlines in fields.
        // This one is somewhat strange, but it can.
        $parser = new \parseCSV();
        //$parser->encoding('UTF-8');
        //$parser->delimiter = ',';
        $parser->enclosure = '"';
        $parser->heading = false;
        // autodetect delimiter and parse file
        $parser->auto($filePath);
        if (empty($parser->data)) {
            throw new ImportException('Could not parse CSV from ' . $filePath);
        }

        $result = [];
        for ($i = 0; $i < count($parser->data); $i++) {
            if ($i < self::CSV_SKIP_ROWS) {
                continue;
            }
            $rowWithNamedColumns = [];
            $columnName = 'A';
            foreach ($parser->data[$i] as $value) {
                $rowWithNamedColumns[$columnName++] = strlen($value) ? $value : null;
            }
            $result[] = $rowWithNamedColumns;
        }

        return $result;
    }

    public static function yesOrEmpty(array $arr, $key)
    {
        if (empty($arr[$key])) {
            return '@@no';
        }

        $value = strtolower(trim($arr[$key]));
        // !!!LANG
        return $value !== 'yes' && $value !== 'ja' ? '@@no' : '@@yes';
    }

    public static function valueOrEmpty(array $arr, $key)
    {
        return empty($arr[$key]) ? '@@no' : $arr[$key];
    }

    /**
     * Some technical symbols have no representation in some browsers and may hurt search and filtering process.
     * This function replaces some of such symbols to more common analogs.
     * @param null|string $value
     * @return null|string
     */
    private static function sanitizeValue($value)
    {
        if (is_null($value)) {
            // no transformation needed
            return $value;
        }

        // OHM SIGN -> GREEK CAPITAL LETTER OMEGA
        $value = str_replace(pack('H*', 'E284A6'), pack('H*', 'CEA9'), $value);
        // replace no break space html entity
        $valueWithHtmlEntities = htmlentities($value);
        $valueWithHtmlEntities = str_replace('&nbsp;', ' ', $valueWithHtmlEntities);
        $value = html_entity_decode($valueWithHtmlEntities);

        return $value;
    }
}
