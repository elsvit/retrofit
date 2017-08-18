<?php
namespace Xiag\Belimo\Storage;

use Xiag\Belimo\EntityCollection;
use Xiag\Belimo\StorageInterface;

use \MongoDB\Database;
use \MongoDB\BSON\ObjectID;
use \MongoDB\Driver\Cursor;
use \MongoDB\BSON\UTCDatetime;


/**
 * How to connect objects of Business-Logic to concrete storage Handlers
 */
class MongoDB implements StorageInterface
{
    private $namespace = StorageInterface::DEFAULT_NAMESPACE;

    /**
     * Amount of seconds documents in collection may be vanished after
     */
    const DATA_TTL = 2592000; // 30 days

    /**
     * MongoDB userland object
     * @var Database
     */
    private $db;

    private static $collections = [
        EntityCollection::RETROFIT_AIR_ORIGINAL,
        EntityCollection::RETROFIT_AIR_PRODUCT,
        EntityCollection::RETROFIT_AIR_ACCESSORY,
        EntityCollection::RETROFIT_WATER_ORIGINAL,
        EntityCollection::RETROFIT_WATER_PRODUCT,
        EntityCollection::RETROFIT_WATER_ACCESSORY,
        EntityCollection::VALVESIZER_SERIE,
        EntityCollection::VALVESIZER_VALVE,
        EntityCollection::VALVESIZER_ACTUATOR,
        EntityCollection::VALVESIZER_COMBO
    ];

    /**
     * MongoDB constructor.
     * @param Database $db
     */
    public function __construct($db)
    {
        $this->db = $db;
    }

    public function isEmpty()
    {
        foreach($this->db->listCollections() as $coll) {
            return false;
        }
        return true;
    }

    public function dropSchema()
    {
        foreach (self::$collections as $name) {
            $this->dropCollection($name);
        }
    }

    /**
     * Drop and then create proper collections, indexes, etc.
     */
    public function recreateSchema()
    {
        $this->dropSchema();
        foreach (self::$collections as $name) {
            $this->setupCollection($name);
        }
    }

    public function metadata($collectionName, $parameters)
    {
        $metadata = [
            'amount' => 0,
            'uniqueValues' => [],
        ];

        // MongoDB Collection
        $collection = $this->selectCollection($collectionName);

        // MongoDB filter parameters
        $filter = self::filterFromParameters($parameters);

        // amount of documents
        $metadata['amount'] = $collection->count($filter);

        // unique values of filtering fields
        $uniqueValues = [];
        foreach (Schema::filteringFields($collectionName) as $field) {
            $result = array_values($collection->distinct($field, $filter));
            natsort($result);

            $uniqueValues[$field] = array_values($result);
        }
        $metadata['uniqueValues'] = array_filter($uniqueValues);

        return $metadata;
    }

    public function find($collectionName, $parameters)
    {
        // MongoDB Collection
        $collection = $this->selectCollection($collectionName);

        // MongoDB filter parameters
        $filter = self::filterFromParameters($parameters);

        // cursor
        $cursor = $collection->find($filter);

        $documents = self::cursorToDocuments($cursor);

        return $documents;
    }

    public function text($collectionName, $queryString)
    {
        $queryStringsPlain = explode(" ", $queryString);
        $searchStrings = array();

        foreach($queryStringsPlain as $queryStringPlain) {
            $searchStrings[] = preg_quote($queryStringPlain);
        }

        // MongoDB Collection
        $collection = $this->selectCollection($collectionName);

        // Take eligible fields for text search
        $textSearchFields = Schema::textSearchFields($collectionName);

        if (!count($searchStrings)) {
            return [];
        }

        // form search expression for each field
        $fieldExpressions = [];

        foreach ($textSearchFields as $textSearchField) {

            foreach ($searchStrings as $searchTerm) {

                $fieldExpressions[] = [
                    $textSearchField => [
                        '$regex' => $searchTerm,
                        '$options' => 'i'
                    ]
                ];
            }

        }

        // cursor
        $cursor = $collection->find([ '$or' => $fieldExpressions ]);

        // documents
        $documents = self::cursorToDocuments($cursor);

        // calculating Levenshtein distance for each search field in document and taking minimal one
        foreach ($documents as &$document) {
            $levenshteinDistances = [];
            foreach ($textSearchFields as $textSearchField) {
                $levenshteinDistance = levenshtein($document[$textSearchField], $queryString);
                if ($levenshteinDistance !== -1) {
                    $levenshteinDistances[] = $levenshteinDistance;
                }
            }
            $document['_levenshteinDistance'] = min($levenshteinDistances);
        }

        // sorting documents by distance
        usort($documents, function($a, $b) {
            if ($a['_levenshteinDistance'] === $b['_levenshteinDistance']) {
                return 0;
            }
            return ($a['_levenshteinDistance'] < $b['_levenshteinDistance']) ? -1 : 1;
        });

        // removing distance field
        foreach($documents as &$document) {
            unset($document['_levenshteinDistance']);
        }

        return $documents;
    }

    public function save($collectionName, $inputMap)
    {
        // MongoDB Collection
        $collection = $this->selectCollection($collectionName);

        // saving
        $outputMap = array_map(
            function ($document) use ($collection) {
                // special fields
                unset($document['_id']); // 'id' is a king, we do not care about what storage generates
                $document['_lastModified'] = new UTCDatetime(intval(microtime(true) * 1000));

                if (!empty($document['id'])) { // not a '_id'!
                    // update or insert (f.e. we importing for the first time)!
                    $collection->updateOne(['id' => $document['id']], ['$set' => $document], ['upsert' => true]);
                } else {
                    // insert with some new id
                    //$document['id'] = Shortid::generate();
                    $document['id'] = uniqid();
                    $collection->insertOne($document);
                }
                return $document['id'];
            },
            $inputMap
        );

        return $outputMap;
    }

    public function delete($collectionName, $inputArray)
    {
        // counter
        $counter = 0;

        // MongoDB Collection
        $collection = $this->selectCollection($collectionName);

        foreach ($inputArray as $parameters) {
            // MongoDB filter parameters
            $filter = self::filterFromParameters($parameters);
            // removing
            $deleteResult = $collection->deleteMany($filter);
            // updating counter
            $counter += $deleteResult->getDeletedCount();
        }

        return $counter;
    }

    /**
     * @param $collectionName
     * @return array|mixed|object
     */
    public function dropCollection($collectionName)
    {
        return $this->db->dropCollection($this->nsAdd($collectionName));
    }

    function setNamespace($namespace)
    {
        $this->namespace = preg_replace('/\W/', '_', strtolower($namespace));
    }


    // -----------------------------------------------------------------------------------------------------------------

    /**
     * Prepare input parameters for Collection->find().
     * [ field => [ value1, value2 ], ... ] into [ field => [ '$in' => [ value1, value2 ] ], ... ]
     * @param array $parameters
     * @return array
     */
    protected static function filterFromParameters($parameters)
    {
        // cleanup
        $checkedParameters = array_map(
            function ($value) {
                // Value should be an array
                $values = is_array($value) ? $value : [$value];

                // Non-scalars, and empty strings becomes NULL
                $values = array_map(function ($_) {
                    return ('' === $_ || !is_scalar($_)) ? null : $_;
                }, $values);

                return $values;
            },
            $parameters
        );

        // special cases for some fields
        if (array_key_exists('_id', $checkedParameters)) {
            $checkedParameters['_id'] = array_map(
                function ($_id) {
                    return new ObjectID($_id);
                },
                $checkedParameters['_id']
            );
        }
        if (array_key_exists('_lastModified', $checkedParameters)) {
            $checkedParameters['_lastModified'] = array_map(
                function ($_lastModified) {
                    return new UTCDatetime(intval($_lastModified));
                },
                $checkedParameters['_lastModified']
            );
        }

        // MongoDB driver form
        $filterParameters = array_map(
            function ($values) {
                return ['$in' => $values];
            },
            $checkedParameters
        );

        // #54923 :: More results should be shown in series results list for PN filter
        if (is_array($checkedParameters['pn'])) {
            $filterParameters['pn'] = ['$gte' => intval($checkedParameters['pn'][0])];
        }

        return $filterParameters;
    }

    /**
     * Get all documents ( each as array of strings ) from Cursor
     * @param Cursor $cursor
     * @return array
     */
    protected static function cursorToDocuments(Cursor $cursor)
    {
        $cursor->setTypeMap(['document' => 'array']);

        $documents = array_map(
            function ($document) {
                $document = (array)$document;
                // removing special fields
                foreach (Schema::serviceFields() as $field) {
                    unset($document[$field]);
                }
                return $document;
            },
            $cursor->toArray()
        );

        return $documents;
    }

    private function nsRegexp()
    {
        return "/^{$this->namespace}_(.*)/";
    }

    private function nsAdd($names)
    {
        $scalar = !is_array($names);
        if ($scalar) {
            $names = [$names];
        }
        $result = array_map(function($name) {
            return $this->namespace . '_' . $name;
        }, $names);
        return $scalar ? $result[0] : $result;
    }

    private function nsRemove($names)
    {
        $scalar = !is_array($names);
        if ($scalar) {
            $names = [$names];
        }
        $result = array_map(function($name) {
            return preg_replace($this->nsRegexp(), '$1', $name);
        }, $names);
        return $scalar ? $result[0] : $result;
    }

    private function listCollections()
    {
        $result = [];
        foreach ($this->db->listCollections() as $collection) {
            $name = $collection->getName();
            if (preg_match($this->nsRegexp(), $name)) {
                $result[] = $this->nsRemove($name);
            }
        }
        return $result;
    }

    private function setupCollection($name)
    {
        $nameWithNs = $this->nsAdd($name);
        $this->db->createCollection($nameWithNs);
        $collection = $this->db->selectCollection($nameWithNs);
        $textSearchFields = Schema::textSearchFields($name);
        if(!empty($textSearchFields)) {
            $collection->createIndex(array_fill_keys($textSearchFields, 'text'));
        }
    }

    private function selectCollection($name) {
        return $this->db->selectCollection($this->nsAdd($name));
    }
}
