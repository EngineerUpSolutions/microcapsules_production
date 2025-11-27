<?php
require_once(__DIR__ . '/../../config.php');
require_login();

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

// SIGNATURE
$secret = 'k8Z3pL9qT2vX6sR1yB4nW7cH5mD0fG8Q';
$sig = hash_hmac('sha256', $raw, $secret);

$encodedcourses = urlencode(json_encode($filteredcourses));

$externalurl = "http://127.0.0.1/microcapsulas"
    . "?uid={$userid}"
    . "&name=" . urlencode($fullname)
    . "&courses={$encodedcourses}"
    . "&sig={$sig}";

echo $OUTPUT->header();
echo "
<script>
    window.open('$externalurl', '_blank');
    window.location.href = '$CFG->wwwroot';
</script>
";
echo $OUTPUT->footer();
