<?php

namespace Xiag\Belimo\Import;


use Xiag\Belimo\StorageInterface;

class Importer
{
    /**
     * @var ImportConfig
     */
    private $config;
    /**
     * @var Logger
     */
    private $logger;
    /**
     * @var StorageInterface $storage
     */
    private $storage;

    /**
     * Importer constructor.
     * @param ImportConfig $config Configuration from conf file
     * @param StorageInterface $storage
     * @param Logger $logger
     */
    public function __construct(
        ImportConfig $config, StorageInterface $storage, Logger $logger)
    {
        $this->config = $config;
        $this->logger = $logger;
        $this->storage = $storage;
    }

    public function isSetupNeeded() {
        return $this->storage->isEmpty();
    }

    public function purgeStorage($target)
    {
        $targets = $this->targetsToProcess($target);
        $this->logger->trace('Dropping all collections from DB, targets: %s', implode(', ', $targets));
        foreach ($targets as $t) {
            $this->storage->setNamespace($t);
            $this->storage->dropSchema();
        }
    }

    public function import($target, array $groups, ValidatorInterface $validator, array $options)
    {
        $options = array_merge([
            'dryRun' => false
        ], $options);

        $this->logger->trace('Starting import %s', $options['dryRun'] ? '(dry run)' : '');

        foreach($this->targetsToProcess($target) as $t) {
            $this->importTarget($t, $groups, $validator, $options);
        }

        $this->logger->trace(sprintf('Finished import %s', $options['dryRun'] ? '(dry run)' : ''));
    }


    private function importTarget($target, $groups, ValidatorInterface $validator, array $options)
    {
        $groupConf = $this->config->getGroupsConfig($target);
        if (empty($groups)) {
            $actualGroups = $groupConf->listGroups();
        } else {
            $actualGroups = array_filter($groupConf->listGroups(), function ($g) use ($groups) {
                return in_array($g, $groups);
            });
            $unknownGroups = array_diff($groups, $actualGroups);
            if(count($unknownGroups)) {
                throw new InvalidParameterException("Unknown groups in target $target: " . implode(', ', $unknownGroups));
            }
        }
        $this->logger->trace('Importing target %s, groups: %s', $target, implode(', ', $actualGroups));

        if(!$options['dryRun']) {
            $this->logger->trace('Recreating DB schema for target %s', $target);
            $this->storage->setNamespace($target);
            $this->storage->recreateSchema();
        }

        foreach($actualGroups as $group) {
            $this->importGroup($target, $group, $validator, $options);
        }

        $this->logger->trace('Finished importing target %s', $target);
    }

    private function importGroup($target, $group, ValidatorInterface $validator, array $options)
    {
        $importName = "$target!$group";
        $this->logger->trace('Importing %s', $importName);

        $files = $this->config->getGroupsConfig($target)->getFiles($group);
        $loader = LoaderFactory::getLoader($target, $group, new TagLoggerDecorator($this->logger, "$importName: "));
        $data = $loader->load($files, $validator);

        if (!$options['dryRun']) {
            $this->storage->setNamespace($target);
            foreach ($data as $collection => $values) {
                $this->logger->trace('Saving to DB: %s (%d)', $collection, count($values));
                $this->storage->save($collection, array_values($values));
            }
        }
    }

    private function targetsToProcess($target)
    {
        $allTargets = $this->config->listTargets();
        if (empty($target)) {
            return $allTargets;
        }
        if (!in_array($target, $allTargets)) {
            throw new InvalidParameterException("Unknown target $target");
        }
        return [$target];
    }
}
