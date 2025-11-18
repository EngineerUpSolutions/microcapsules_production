<?php
function local_microcapsulas_extend_navigation(global_navigation $root)
{
    global $PAGE, $USER, $CFG, $DB;

    // ---------------------------------------------------------
    // 0) Skip during install/upgrade to avoid DB errors
    // ---------------------------------------------------------
    if (function_exists('during_initial_install') && during_initial_install()) {
        return;
    }

    if ($PAGE->pagetype === 'admin-index') {
        return;
    }

    // Ensure DB and context constants are loaded
    if (!isset($DB)) {
        return;
    }
    require_once($CFG->dirroot . '/lib/accesslib.php');

    // ---------------------------------------------------------
    // 1) Do NOT show the button inside any course
    // ---------------------------------------------------------
    if (!empty($PAGE->course->id) && $PAGE->course->id != SITEID) {
        return;
    }

    // ---------------------------------------------------------
    // 2) Detect if user is a REAL student (roleid = 5)
    // ---------------------------------------------------------
    $isstudent = $DB->record_exists_sql("
        SELECT 1
          FROM {role_assignments} ra
          JOIN {context} ctx ON ctx.id = ra.contextid
         WHERE ra.userid = ?
           AND ra.roleid = 5
           AND ctx.contextlevel IN (".CONTEXT_COURSE.", ".CONTEXT_COURSECAT.")
         LIMIT 1
    ", [$USER->id]);

    if (!$isstudent) {
        return;
    }

    // ---------------------------------------------------------
    // 3) Check if student has at least one visible course in category 4
    // ---------------------------------------------------------
    require_once($CFG->dirroot . '/course/lib.php');
    $courses = enrol_get_users_courses($USER->id, true);

    $has_cat4_visible_course = false;
    foreach ($courses as $c) {
        if ($c->category == 4 && $c->visible == 1) {
            $has_cat4_visible_course = true;
            break;
        }
    }

    if (!$has_cat4_visible_course) {
        return;
    }

    // ---------------------------------------------------------
    // 4) Build Microcapsulas URL
    // ---------------------------------------------------------
    $main_url = new moodle_url(
        '/../lmsActividades/config/login_config.php',
        [
            'user'    => $USER->id,
            'sesskey' => sesskey()
        ]
    );

    $mynode = navigation_node::create(
        get_string('pluginname', 'local_microcapsulas'),
        $main_url,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas_global',
        new pix_icon('i/grades', '')
    );
    $mynode->showinflatnavigation = true;

    // ---------------------------------------------------------
    // 5) Insert node after "My courses"
    // ---------------------------------------------------------
    $mycoursesnode = null;

    foreach ($root->children as $child) {
        if ($child->key === 'mycourses') {
            $mycoursesnode = $child;
            break;
        }
    }

    if ($mycoursesnode) {
        $parent = $mycoursesnode->parent ?: $root;
        $parent->add_node($mynode, $mycoursesnode->key + 1);
    } else {
        $root->add_node($mynode);
    }
}
