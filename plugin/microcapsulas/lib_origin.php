<?php
function local_microcapsulas_extend_navigation(global_navigation $root)
{
    global $PAGE, $USER;

    // Solo dentro de un curso (no portada).
    if (!empty($PAGE->course->id) && $PAGE->course->id != SITEID) {
        $course = $PAGE->course;
        $context = context_course::instance($course->id);

        if (!has_capability('local/microcapsulas:view', $context)) {
            return;
        }

        global $DB, $USER;

        // ID del curso
        $context = context_course::instance($course->id);

        // Obtiene roles del usuario en el curso
        $roles = get_user_roles($context, $USER->id, false);

        if ($roles) {
            // Si tiene rol en el curso, tomar el primero
            $first = reset($roles);
            $roleid = $first->roleid ?? null;
        } else {
            // Si no tiene rol en el curso, obtener roles globales
            $roles = get_user_roles(context_system::instance(), $USER->id, false);

            if ($roles) {
                $first = reset($roles);
                $roleid = $first->roleid ?? null;
            } else {
                $roleid = null;
            }
        }

        //Validar si es administrador del sitio (siteadmins)
        if (is_siteadmin($USER->id)) {
            $roleid = 2; // Asignar roleid = 2 si es admin del sitio
        }

        // ✅ Verificación de rol temporal
        $temporal_roleid = null;
        if (!empty($USER->access['rsw'])) {
            $temporal_roleid = reset($USER->access['rsw']);
        }


        // REDIRECCIÓN CONSOLIDADA AL VIEW PRINCIPAL
        $main_url_params = array(
            'user' => $USER->id,
            'courseid' => $course->id,
            'roleid' => $roleid,
            'sesskey' => sesskey()
        );
        // Añadir rol temporal si existe
        if ($temporal_roleid !== null) {
            $main_url_params['rol_temp'] = $temporal_roleid;
        }
        // Construir la URL consolidada
        if ($coursenode = $root->find($course->id, navigation_node::TYPE_COURSE)) {
            $main_url = new moodle_url('/../lmsActividades/config/login_config.php', $main_url_params);
            // $url = new moodle_url('/local/microcapsulas/index.php', $params);

            $mynode = navigation_node::create(
                get_string('pluginname', 'local_microcapsulas'),
                $main_url,
                navigation_node::TYPE_CUSTOM,
                null,
                'local_microcapsulas_global',
                new pix_icon('i/grades', '')
            );
            $mynode->showinflatnavigation = true;

            // --- Agrega JUSTO DESPUÉS de "grades" usando $beforekey ---
            $keys = $coursenode->get_children_key_list(); // orden real de hijos
            $beforekey = null;

            $pos = array_search('grades', $keys, true);
            if ($pos !== false) {
                // clave del nodo que viene después de "grades"
                $beforekey = $keys[$pos + 1] ?? null;
            }

            if ($beforekey) {
                $coursenode->add_node($mynode, $beforekey); // queda después de grades
            } else {
                // si no existe, lo agrega al final.
                $candidatos = ['participants', 'reports', 'competencies', 'badges', 'moremenu'];
                $placed = false;
                foreach ($candidatos as $cand) {
                    if (in_array($cand, $keys, true)) {
                        $coursenode->add_node($mynode, $cand);
                        $placed = true;
                        break;
                    }
                }
                if (!$placed) {
                    $coursenode->add_node($mynode); 
                }
            }
        }
        return;
    }
}