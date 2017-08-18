<?php

use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\HttpKernelInterface;
use Xiag\Controller;

require_once __DIR__ . '/../../vendor/autoload.php';

$app = new Silex\Application();

// Providers
$app->register(new Silex\Provider\SessionServiceProvider(), [
    'session.storage.options' => [
        'name' => 'Belimo',
        'cookie_httponly' => true,
    ]
]);
$app->register(new Xiag\Provider\ConfigurationServiceProvider());
$app->register(new Xiag\Provider\StorageServiceProvider($app['configuration']['storage']));

$app->before(function (Request $request, Application $app) {
    $target = $request->get('target');
    if(!empty($target)) {
        $app['storage']->setNamespace($target);
        $request->query->remove('target');
    }
});

// Routes
$app->get('/', function () use ($app) {
    $app['session']->set('csrf', time());
    return file_get_contents('index.html');
});

$app->mount('/data', new Controller\DataControllerProvider());

// SPA helpers (forwards to index)
$spaForwardHandler = function() use ($app) {
    return $app->handle(Request::create('/', 'GET'), HttpKernelInterface::SUB_REQUEST);
};

$app->get('/retrofit', $spaForwardHandler);
$app->get('/retrofit/{path}', $spaForwardHandler)->assert('path', '.*');
$app->get('/valve-sizer', $spaForwardHandler);
$app->get('/valve-sizer/{path}', $spaForwardHandler)->assert('path', '.*');
$app->get('/user', $spaForwardHandler);
$app->get('/user/{path}', $spaForwardHandler)->assert('path', '.*');


// CORS headers
$app->after(function (Request $request, Response $response) {
    if (preg_match('@^/data@', $request->getPathInfo())) {
        $response->headers->set('Access-Control-Allow-Methods', 'GET');
        $response->headers->set('Access-Control-Allow-Origin', '*');
    }
});

return $app;
