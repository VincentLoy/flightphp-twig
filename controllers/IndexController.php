<?php

class IndexController
{
    public function __construct()
    {

    }

    public static function index()
    {
        $data = array(
            'name' => 'Vincent!',
            'count' => [1, 2, 3, 4, 5]
        );
        Flight::view()->display('page-hello.twig', $data);
    }
}