<?php
require_once(__DIR__ . '/../../config.php');
require_login();

// URL of your Next.js Microcapsulas frontend
// LOCAL (development)
$externalurl = "http://localhost:3000";

// In PRODUCTION, change this to:
// $externalurl = "https://frontend-domain-or-subdomain/microcapsulas";

// Moodle standard header
echo $OUTPUT->header();

// Open frontend in a new tab and redirect Moodle tab back
echo "
<script>
    window.open('$externalurl', '_blank');
</script>
";

// Standard footer
echo $OUTPUT->footer();
