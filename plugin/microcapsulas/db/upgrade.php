<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Plugin capabilities for the local_microcapsulas plugin.
 *
 * @package   local_microcapsulas
 * @copyright Equipo zajuna
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

/**
 * Upgrade hook for local_microcapsulas.
 */
function xmldb_local_microcapsulas_upgrade($oldversion) {
    global $DB, $CFG;
    require_once($CFG->libdir . '/accesslib.php');

    // Usa un número de versión mayor al actual del plugin.
    $targetversion = 2025090100;

    if ($oldversion < $targetversion) {
        // Roles con permiso SOLO de visualizar.
        $roles_view_only = [
            'academiccoordinator',
            'acompanamientofacilitador',
            'training',
            'student',
        ];

        // Roles con permiso de editar (implica ver).
        $roles_edit = [
            'repository',
            'support',
            'teacher',
            'editingteacher',
        ];

        // Manager: todo.
        $roles_manager_all = ['manager'];

        // Contexto base (hereda a inferiores).
        $sysctx = \context_system::instance();

        // Helper para asignar capacidad a un rol por shortname si existe.
        $assign = function(string $shortname, string $cap, int $perm) use ($DB, $sysctx) {
            if ($role = $DB->get_record('role', ['shortname' => $shortname], 'id,shortname')) {
                assign_capability($cap, $perm, $role->id, $sysctx, true);
            }
        };

        // 1) View-only.
        foreach ($roles_view_only as $shortname) {
            $assign($shortname, 'local/microcapsulas:view', CAP_ALLOW);
            // Asegura que no tengan edit (por si lo traían de antes).
            $assign($shortname, 'local/microcapsulas:edit', CAP_PREVENT);
        }

        // 2) Edit roles (edit + view).
        foreach ($roles_edit as $shortname) {
            $assign($shortname, 'local/microcapsulas:view', CAP_ALLOW);
            $assign($shortname, 'local/microcapsulas:edit', CAP_ALLOW);
        }

        // 3) Manager: todo.
        foreach ($roles_manager_all as $shortname) {
            $assign($shortname, 'local/microcapsulas:view', CAP_ALLOW);
            $assign($shortname, 'local/microcapsulas:edit', CAP_ALLOW);
        }

        // Recomienda limpiar cachés de permisos/contextos.
        // No es estrictamente necesario llamar a rebuild_contexts aquí,
        // Moodle invalida cachés; pero si quieres forzar:
        // rebuild_contexts(\context_system::instance()->id);

        upgrade_plugin_savepoint(true, $targetversion, 'local', 'microcapsulas');
    }

    return true;
}
