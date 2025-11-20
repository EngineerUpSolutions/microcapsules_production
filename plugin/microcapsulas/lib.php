<?php
defined('MOODLE_INTERNAL') || die();

function local_microcapsulas_extend_navigation(global_navigation $root) {
    global $DB, $USER, $PAGE;
    if (!isloggedin() || isguestuser()) {
        return;
    }
    $courses = enrol_get_users_courses($USER->id, true, ['id', 'category', 'visible', 'fullname']);
    $eligible = false;
    foreach ($courses as $course) {
        // Must be category 4 AND visible
        if ((int)$course->category !== 4 || (int)$course->visible !== 1) {
            continue;
        }

        // Check user role in this course
        $context = context_course::instance($course->id);
        $roles = get_user_roles($context, $USER->id);

        foreach ($roles as $r) {
            if (in_array((int)$r->roleid, [1, 2, 5], true)) {
                $eligible = true;
                break 2;
            }
        }
    }

    if (!$eligible) {
        return;
    }
    $url = new moodle_url('/local/microcapsulas/index.php');
    $node = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas'
    );
    $root->add_node($node);
}
