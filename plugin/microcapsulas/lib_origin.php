<?php
defined('MOODLE_INTERNAL') || die();

function local_microcapsulas_extend_navigation(global_navigation $root) {
    global $DB, $USER, $PAGE;

    // 0️⃣ User must be logged in
    if (!isloggedin() || isguestuser()) {
        return;
    }

    // ----------------------------------------
    // 1️⃣ Check enrolled courses in category 4 and visible courses
    // ----------------------------------------
    $courses = enrol_get_users_courses($USER->id, true, ['id', 'category', 'visible']);
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

    // ----------------------------------------
    // 2️⃣ Create navigation item WITHOUT URL (we’ll inject it)
    // ----------------------------------------
    //version1
    // $url = new moodle_url('http://localhost:3000');

    // $node = navigation_node::create(
    //     get_string('pluginname', 'local_microcapsulas'),
    //     $url,
    //     navigation_node::TYPE_CUSTOM,
    //     null,
    //     'local_microcapsulas'
    // );

    // // Force new tab without JS
    // $node->attributes['target'] = '_blank';
    // $node->attributes['rel'] = 'noopener';

    // $root->add_node($node);

    //version2 stable working on the same tab
    $externalurl = new moodle_url('http://localhost:3000');

    $node = $root->add(
        get_string('pluginname', 'local_microcapsulas'),
        $externalurl,
        navigation_node::TYPE_CUSTOM,
        null,
        'local_microcapsulas'
    );

    // This is the correct way in Moodle 4.x
    $node->openinnewwindow = true;




}
