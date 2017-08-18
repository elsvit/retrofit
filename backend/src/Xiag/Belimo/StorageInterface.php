<?php
namespace Xiag\Belimo;

/**
 * What do you want from Storage object, that will keep data
 */
interface StorageInterface extends Namespaced
{
    const DEFAULT_NAMESPACE = 'default';

    /**
     * true if Storage contains no collections in ALL namespaces
     * @return boolean
     */
    public function isEmpty();

    /**
     * Drop all existing collections in current namespace
     * @return void
     */
    public function dropSchema();

    /**
     * Drop all existing collections in current namespace
     * and then make initial setups, needed for Storage operation
     * @return void
     */
    public function recreateSchema();

    /**
     * Get information about records, that will be returned by set of parameters
     * @param string $collectionName
     * @param array $parameters
     * @return array Array with special structure
     */
    public function metadata($collectionName, $parameters);

    /**
     * Get records from collection having given values
     * @param $collectionName
     * @param $parameters
     * @return array Data of found records
     */
    public function find($collectionName, $parameters);

    /**
     * Perform text search in collection, using provided query string
     * @param string $collectionName
     * @param string $queryString
     * @return array Data of found records
     */
    public function text($collectionName, $queryString);

    /**
     * Insert or update record in collection
     * @param string $collectionName
     * @param array $map
     * @return string[] Identifiers of altered records
     */
    public function save($collectionName, $map);

    /**
     * Delete records from collection
     * @param string $collectionName
     * @param array $inputArray
     * @return integer Amount of altered records
     */
    public function delete($collectionName, $inputArray);

    /**
     * Drop whole collection
     *
     * @param $collectionName
     * @return mixed
     */
    public function dropCollection($collectionName);
}