<?php
defined('MOODLE_INTERNAL') || die();

require_once(__DIR__ . '/../../config.php');


// Función para extender la navegación del curso
function local_microcapsulas_extend_navigation_course(
    navigation_node $parentnode, stdClass $course, context_course $context
) {
    // Muestra el enlace solo a quien tenga la capacidad.
    if (!has_capability('local/microcapsulas:view', $context)) {
        return;
    }

    $url = new moodle_url('/local/microcapsulas/index.php', ['courseid' => $course->id]);

    // Agrega el nodo bajo la configuración del curso.
    $parentnode->add(
        get_string('pluginname', 'local_microcapsulas'),
        $url,
        navigation_node::TYPE_SETTING,
        null,
        'local_microcapsulas'
    );
}

/**
 * (Opcional) Utilidad para breadcrumbs si la usas desde tus páginas.
 */
function local_microcapsulas_build_breadcrumbs(int $courseid, string $pagekey, array $pagelink = []) {
    global $PAGE;
    $PAGE->navbar->add(
        get_string('pluginname','local_microcapsulas'),
        new moodle_url('/local/microcapsulas/index.php',['courseid'=>$courseid])
    );
    $PAGE->navbar->add(
        get_string('menuasistencia','local_microcapsulas'),
        new moodle_url('/local/microcapsulas/index.php',['courseid'=>$courseid])
    );
    if ($pagelink) {
        $PAGE->navbar->add(
            get_string($pagekey,'local_microcapsulas'),
            new moodle_url($pagelink['url'], $pagelink['params'])
        );
    } else {
        $PAGE->navbar->add(get_string($pagekey,'local_microcapsulas'));
    }
}