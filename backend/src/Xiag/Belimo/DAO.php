<?php
namespace Xiag\Belimo;

/**
 * Access control & Storage querying
 */
class DAO implements DAOInterface
{
    /**
     * Business-login for site user is that he can modify only certain collections
     * @var string[]
     */
    protected static $alterableCollections = [];

    /**
     * @var StorageInterface
     */
    protected $storage;

    /**
     * DAO constructor.
     * @param StorageInterface $storage
     */
    public function __construct(StorageInterface $storage)
    {
        $this->storage = $storage;
    }

    //------------------------------------------------------------------------------------------------------------------

    public function metadata($entityFQN, $parameters)
    {
        return $this->storage->metadata(
            self::collectionName($entityFQN),
            $parameters
        );
    }

    public function identifiers($entityFQN, $parameters)
    {
        return array_map(
            function($record) { return $record['id']; },
            $this->storage->find(
                self::collectionName($entityFQN),
                $parameters
            )
        );
    }

    public function filter($entityFQN, $parameters)
    {
        $records = $this->storage->find(
            self::collectionName($entityFQN),
            $parameters
        );
        return self::alterableOutputFilter($entityFQN, $records);
    }

    public function search($entityFQN, $queryString)
    {
        $records = array_map(
            function($record) { return $record['id']; },
            $this->storage->text(
                self::collectionName($entityFQN),
                self::sanitizeQueryString($queryString)
            )
        );
        return self::alterableOutputFilter($entityFQN, $records);
    }

    public function save($entityFQN, $map)
    {
        return $this->storage->save(
            self::collectionName($entityFQN),
            self::alterableInputFilter($entityFQN, $map)
        );
    }

    public function delete($entityFQN, $parameters)
    {
        return $this->storage->delete(
            self::collectionName($entityFQN),
            self::alterableInputFilter($entityFQN, $parameters)
        );
    }

    //------------------------------------------------------------------------------------------------------------------

    /**
     * Incoming value - lodash path in Redux state.
     * Output value - name of table / collection / file
     * @param string $entityFQN
     * @return string
     */
    protected static function collectionName($entityFQN)
    {
        $collectionName = str_replace('.', '_', strtolower(trim($entityFQN)));
        return $collectionName;
    }

    /**
     * Sanitize user query string for text search
     * @param $queryString
     * @return mixed|string
     */
    protected static function sanitizeQueryString($queryString)
    {
        $queryString = substr($queryString, 0, 50);
        $queryString = preg_replace('@[^\p{L}\p{N}\p{P}\h]++@u', '', $queryString);
        $queryString = trim($queryString);
        return $queryString;
    }

    /**
     * Business-logic. Nobody from frontend should be able to save/delete record without specifying userId
     * @param string $entityFQN
     * @param array $records
     * @return array
     */
    protected static function alterableInputFilter($entityFQN, $records)
    {
        if (in_array($entityFQN, self::$alterableCollections)) {
            foreach ($records as $key => $record) {
                if (!array_key_exists('userId', $record)) {
                    unset($records[$key]);
                }
            }
        }
        return $records;
    }

    /**
     * Business-logic. Nobody on frontend should be aware about userId in served records
     * @param string $entityFQN
     * @param array $records
     * @return mixed
     */
    protected static function alterableOutputFilter($entityFQN, $records)
    {
        if (in_array($entityFQN, self::$alterableCollections)) {
            foreach ($records as &$record) {
                unset($record['userId']);
            }
        }
        return $records;
    }
}