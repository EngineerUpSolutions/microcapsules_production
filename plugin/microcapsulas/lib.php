<?php
function local_microcapsulas_extend_navigation(global_navigation $root)
{
    global $PAGE, $USER;

    /***********************************************************
     * 1) SI ESTÁS DENTRO DE UN CURSO → NO AÑADIR NADA
     ***********************************************************/
    if (!empty($PAGE->course->id) && $PAGE->course->id != SITEID) {
        return;
    }

    /***********************************************************
     * 2) VERIFICAR CAPACIDAD
     ***********************************************************/
    $systemcontext = context_system::instance();
    if (!has_capability('local/microcapsulas:view', $systemcontext)) {
        return;
    }

    /***********************************************************
     * 3) DEBUG DE NODOS: MOSTRAR ESTRUCTURA REAL
     ***********************************************************/
    error_log("===== MICROCAPSULAS DEBUG START =====");
    foreach ($root->children as $key => $node) {
        $text = is_string($node->text) ? $node->text : $node->text->out();
        error_log("NODE KEY: $key | TEXT: " . $text . " | TYPE: " . $node->type);
    }
    error_log("===== MICROCAPSULAS DEBUG END =====");

    /***********************************************************
     * 4) CREAR URL
     ***********************************************************/
    $main_url = new moodle_url(
        '/../lmsActividades/config/login_config.php',
        [
            'user' => $USER->id,
            'sesskey' => sesskey()
        ]
    );

    /***********************************************************
     * 5) CREAR NODO
     ***********************************************************/
    $mynode = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $main_url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas_global',
        new pix_icon('i/grades', '')
    );
    $mynode->showinflatnavigation = true;

    /***********************************************************
     * 6) INTENTAR UBICAR EL NODO "MIS CURSOS"
     ***********************************************************/
    $target = null;

    // Intento 1: nodo clásico
    $target = $root->find('mycourses', navigation_node::TYPE_CATEGORY);

    // Intento 2: nodo sin tipo
    if (!$target) {
        $target = $root->find('mycourses');
    }

    // Intento 3: en algunas versiones está como "courses"
    if (!$target) {
        $target = $root->find('courses', navigation_node::TYPE_CATEGORY);
    }

    // Intento 4: tema Boost 4.x
    if (!$target) {
        $target = $root->find('courseindex');
    }

    /***********************************************************
     * 7) INSERTAR MICROCAPSULAS (DEPENDIENDO DEL TARGET)
     ***********************************************************/
    if ($target) {
        // Insertar justo DESPUÉS de “Mis cursos”
        $parent = $target->parent ?: $root;
        $parent->add_node($mynode, $target->key + 1);
        error_log("[MICROCAPSULAS] Insertado después de 'Mis cursos'.");
    } else {
        // ÚLTIMO fallback: agregar al final del root
        $root->add_node($mynode);
        error_log("[MICROCAPSULAS] Insertado en root (fallback).");
    }
}
