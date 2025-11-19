<?php
require_once(__DIR__ . '/../../config.php');
require_login();

$externalurl = "http://localhost:3000"; 
// In production change to: https://domain/microcapsulas

echo $OUTPUT->header();

echo "
<script>
    // Open frontend in NEW TAB
    window.open('$externalurl', '_blank');

    // Keep Moodle tab intact (go back home or stay on this page)
    window.location.href = '$CFG->wwwroot';
</script>
";

echo $OUTPUT->footer();
