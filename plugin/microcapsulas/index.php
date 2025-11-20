<?php
// require_once(__DIR__ . '/../../config.php');
// require_login();

// // $externalurl = "http://localhost:3000";
// $externalurl = "http://127.0.0.1/microcapsulas";


// echo $OUTPUT->header();

// echo "
// <script>
//     window.open('$externalurl', '_blank');
//     window.location.href = '$CFG->wwwroot';
// </script>
// ";

// echo $OUTPUT->footer();
require_once(__DIR__ . '/../../config.php');
require_login();

// ---------------------------
// 1. Collect user information
// ---------------------------
$userid = $USER->id;
$fullname = urlencode(fullname($USER));

// ---------------------------------------
// 2. Collect filtered courses (same rules)
// ---------------------------------------
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

// Encode the course list
$encodedcourses = urlencode(json_encode($filteredcourses));

// --------------------------------------------------------
// 3. Build target URL with all data included (Option A)
// --------------------------------------------------------
$externalurl = "http://127.0.0.1/microcapsulas"
    . "?uid={$userid}"
    . "&name={$fullname}"
    . "&courses={$encodedcourses}";

// --------------------------
// 4. Render & redirect
// --------------------------
echo $OUTPUT->header();

echo "
<script>
    window.open('$externalurl', '_blank');
    window.location.href = '$CFG->wwwroot';
</script>
";

echo $OUTPUT->footer();

