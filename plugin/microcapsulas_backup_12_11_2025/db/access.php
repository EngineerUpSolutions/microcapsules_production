<?php
defined('MOODLE_INTERNAL') || die();

$capabilities = [

    'local/microcapsulas:view' => [
        'captype'      => 'read',
        'contextlevel' => CONTEXT_SYSTEM, // System-level, safest for launcher
        'archetypes'   => [
            'student'        => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            'teacher'        => CAP_ALLOW,
            'manager'        => CAP_ALLOW
        ],
    ],

];
