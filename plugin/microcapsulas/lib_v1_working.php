<?php
function local_microcapsulas_extend_navigation(global_navigation $root)
{
    global $PAGE, $USER;

    // 1) Si está dentro de un curso, no mostrar nada
    if (!empty($PAGE->course->id) && $PAGE->course->id != SITEID) {
        return;
    }

    // 2) Verificar permiso global
    $systemcontext = context_system::instance();
    if (!has_capability('local/microcapsulas:view', $systemcontext)) {
        return;
    }

    // 3) DEBUG: imprimir todos los nodos disponibles
    error_log("===== MICROCAPSULAS DEBUG START =====");
    foreach ($root->children as $key => $child) {
        $text = is_string($child->text) ? $child->text : $child->text->out();
        error_log("KEY: $key | TEXT: $text | TYPE: {$child->type}");
    }
    error_log("===== MICROCAPSULAS DEBUG END =====");

    // 4) Crear URL
    $main_url = new moodle_url(
        '/../lmsActividades/config/login_config.php',
        ['user' => $USER->id, 'sesskey' => sesskey()]
    );

    // 5) Crear nodo de Microcapsulas
    $mynode = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $main_url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas_global',
        new pix_icon('i/grades', '')
    );

    $mynode->showinflatnavigation = true;

    // 6) Buscar el nodo "mycourses" MANUALMENTE (sin find)
    $mycoursesnode = null;

    foreach ($root->children as $key => $child) {
        $text = is_string($child->text) ? $child->text : $child->text->out();
        if (trim($text) === "Mis cursos") {  // EXACTAMENTE igual a lo que se ve en pantalla
            $mycoursesnode = $child;
            break;
        }
    }

    // 7) Insertar Microcapsulas justo debajo de Mis cursos
    if ($mycoursesnode) {
        $parent = $mycoursesnode->parent ?: $root;
        $parent->add_node($mynode, $mycoursesnode->key + 1);

        error_log("[MICROCAPSULAS] Insertado debajo de 'Mis cursos'");
    } else {
        // Fallback: lo pone al final del root
        $root->add_node($mynode);
        error_log("[MICROCAPSULAS] Insertado en root (fallback)");
    }
}
