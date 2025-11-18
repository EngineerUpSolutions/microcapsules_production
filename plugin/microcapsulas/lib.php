<?php
defined('MOODLE_INTERNAL') || die();

/**
 * Añade "Microcapsulas" al menú lateral GLOBAL
 * y automáticamente queda al final del menú.
 */
function local_microcapsulas_extend_navigation(global_navigation $root) {
    global $USER;

    $url = new moodle_url('/local/microcapsulas/index.php');

    // Creamos el nodo manualmente
    $newnode = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas'
    );

    // IMPORTANTE: añadir con add_node() → siempre lo coloca al final
    $root->add_node($newnode);
}
