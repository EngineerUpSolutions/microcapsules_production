<?php
require_once(__DIR__ . '/../../config.php');
require_login();

$externalurl = "http://localhost:3000";

echo $OUTPUT->header();

echo "
<script>
    window.open('$externalurl', '_blank');
    window.location.href = '$CFG->wwwroot';
</script>
";

echo $OUTPUT->footer();
