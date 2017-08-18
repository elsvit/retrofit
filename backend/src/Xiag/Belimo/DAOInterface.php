<?php
namespace Xiag\Belimo;

/**
 * JSON RPC Data API, that Silex can call
 */
interface DAOInterface
{
    /**
     * Get some info about set of filtered records from [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param string $parameters
     * @return array
     */
    public function metadata($entityFQN, $parameters);

    /**
     * Filter records & return only their identifiers from [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param array $parameters [ storage_column_name => value_or_array_of_values, ... ]
     * @return array
     */
    public function identifiers($entityFQN, $parameters);

    /**
     * Find records by exact values of fields values in [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param array $parameters [ storage_column_name => value_or_array_of_values, ... ]
     * @return array
     */
    public function filter($entityFQN, $parameters);

    /**
     * Find records by text search in [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param string $queryString f.e.: 'LM24-MFT2'
     * @return array
     */
    public function search($entityFQN, $queryString);

    /**
     * Save records to [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param array $map [ frontend_entity_identifier => record_data, ... ]
     * @return string[] Identifiers of altered records
     */
    public function save($entityFQN, $map);

    /**
     * Delete records by parameters from [sql table | mongodb collection | file]
     * @param string $entityFQN
     * @param array $parameters [ [userId1, id1], [userId2, id2], ... ]
     * @return integer amount of altered records
     */
    public function delete($entityFQN, $parameters);
}