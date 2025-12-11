<?php
defined('MOODLE_INTERNAL') || die();

if ($hassiteconfig) {
    // Página de configuración del plugin local_microcapsulas
    $settings = new admin_settingpage(
        'local_microcapsulas',
        get_string('pluginname', 'local_microcapsulas')
    );

    // Campo para la clave HMAC
    $settings->add(new admin_setting_configpasswordunmask(
        'local_microcapsulas/secret',
        get_string('secret', 'local_microcapsulas'),
        get_string('secret_desc', 'local_microcapsulas'),
        ''
    ));

    // Agregar la página al árbol de administración (Plugins locales)
    $ADMIN->add('localplugins', $settings);
}
