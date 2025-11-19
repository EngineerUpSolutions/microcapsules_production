<?php
defined('MOODLE_INTERNAL') || die();

function local_microcapsulas_extend_navigation(global_navigation $root) {
    global $DB, $USER;

    // 0️⃣ Usuario no válido → no mostrar nada
    if (!isloggedin() || isguestuser()) {
        return;
    }

    // ----------------------------------------
    // 1️⃣ Verificar si el usuario es ESTUDIANTE (roleid = 5)
    // SIN LIMIT 1 → Moodle ya lo añade internamente
    // ----------------------------------------
    $sqlstudent = "
        SELECT 1
        FROM {role_assignments} ra
        JOIN {context} ctx ON ctx.id = ra.contextid
        WHERE ra.userid = :userid
          AND ra.roleid = 5
    ";

    $isstudent = $DB->record_exists_sql($sqlstudent, ['userid' => $USER->id]);

    if (!$isstudent) {
        return;
    }

    // ----------------------------------------
    // 2️⃣ & 3️⃣ Verificar cursos matriculados categoría 4 y visibles
    // USAR API OFICIAL DE MOODLE para evitar errores de navegación
    // ----------------------------------------
    $courses = enrol_get_users_courses($USER->id, true, ['id', 'category', 'visible']);

    $eligible = false;

    foreach ($courses as $course) {
        if ((int)$course->category === 4 && (int)$course->visible === 1) {
            $eligible = true;
            break;
        }
    }

    if (!$eligible) {
        return;
    }

    // ----------------------------------------
    // 4️⃣ Todas las condiciones cumplen → mostrar botón
    // ----------------------------------------
    $url = new moodle_url('/local/microcapsulas/index.php');

    $node = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas'
    );

    // Agregar al menú lateral global
    $root->add_node($node);
}
