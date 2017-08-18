<?php

namespace Xiag\Controller;

use Silex\Application;
use Silex\ControllerProviderInterface;
use Symfony\Component\HttpFoundation\Request;


class DataControllerProvider implements ControllerProviderInterface
{
    public function connect(Application $app)
    {
        $controllers = $app['controllers_factory'];

        // metadata
        $controllers->get('/{entityFQN}/metadata', function ($entityFQN, Request $request) use ($app) {
            /*** @var $dao \Xiag\Belimo\DAOInterface */
            $dao = $app['DAO'];
            return $app->json($dao->metadata($entityFQN, $request->query->all()));
        });

        // identifiers
        $controllers->get('/{entityFQN}/identifiers', function ($entityFQN, Request $request) use ($app) {
            /*** @var $dao \Xiag\Belimo\DAOInterface */
            $dao = $app['DAO'];
            return $app->json($dao->identifiers($entityFQN, $request->query->all()));
        });

        // filter
        $controllers->get('/{entityFQN}/filter', function ($entityFQN, Request $request) use ($app) {
            /*** @var $dao \Xiag\Belimo\DAOInterface */
            $dao = $app['DAO'];
            return $app->json($dao->filter($entityFQN, $request->query->all()));
        });

        // search
        $controllers->get('/{entityFQN}/search/{queryString}', function ($entityFQN, $queryString) use ($app) {
            /*** @var $dao \Xiag\Belimo\DAOInterface */
            $dao = $app['DAO'];
            return $app->json($dao->search($entityFQN, $queryString));
        })->assert('queryString', '.{0,100}');

        return $controllers;
    }
}
