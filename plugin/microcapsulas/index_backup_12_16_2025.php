<?php
require_once(__DIR__ . '/../../config.php');
require_login();
$PAGE->set_context(context_system::instance());
$PAGE->set_url(new moodle_url('/local/microcapsulas/index.php'));
$userid = $USER->id;
$fullname = fullname($USER);

// Collect courses exactly as before:
$courses = enrol_get_users_courses(
    $USER->id,
    true,
    ['id', 'category', 'visible', 'fullname']
);

$filteredcourses = [];

foreach ($courses as $c) {
    if ((int)$c->category !== 4 || (int)$c->visible !== 1) {
        continue;
    }

    $context = context_course::instance($c->id);
    $roles = get_user_roles($context, $USER->id);

    foreach ($roles as $r) {
        if (in_array((int)$r->roleid, [1, 2, 5], true)) {
            $filteredcourses[] = [
                'id' => $c->id,
                'fullname' => $c->fullname
            ];
            break;
        }
    }
}

// Create raw string
$raw = $userid . '|' . $fullname . '|' . json_encode($filteredcourses);


// SIGNATURE: secret read from plugin configuration.
$secret = get_config('local_microcapsulas', 'secret');
if (empty($secret)) {
    // Si no hay clave configurada, mejor avisar claramente.
    die('Microcápsulas: clave HMAC no configurada. Contacte al administrador del sistema.');
}
$sig = hash_hmac('sha256', $raw, $secret);


$encodedcourses = urlencode(json_encode($filteredcourses));

$externalurl = "https://zajunavideo.com/microcapsulas"
    . "?uid={$userid}"
    . "&name=" . urlencode($fullname)
    . "&courses={$encodedcourses}"
    . "&sig={$sig}";

echo $OUTPUT->header();
// echo "
// <script>
//     window.open('$externalurl', '_blank');
//     window.location.href = '$CFG->wwwroot';
// </script>
// ";
//new
echo html_writer::start_div('microcapsulas-launch', [
    'style' => 'text-align:center; margin-top:40px;'
]);

echo html_writer::tag('h3', 'Microcápsulas');

echo html_writer::tag(
    'p',
    'Haz clic en el botón para abrir Microcápsulas en una nueva pestaña.'
);

echo html_writer::link(
    $externalurl,
    'Abrir Microcápsulas',
    [
        'target' => '_blank',
        'rel' => 'noopener noreferrer',
        'class' => 'btn btn-primary btn-lg'
    ]
);

echo html_writer::end_div();
//end
echo $OUTPUT->footer();
