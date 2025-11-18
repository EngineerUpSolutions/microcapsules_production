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
function xmldb_local_microcapsulas_upgrade($oldversion)
{
    global $DB, $CFG;
    require_once($CFG->libdir . '/accesslib.php');

    $targetversion = 2025090101;
    if ($oldversion < $targetversion) {
        $sysctx = \context_system::instance();

        // Helper: obtener o crear rol por shortname.
        $ensure_role = function (string $shortname, string $name, string $description = '') use ($DB) {
            if ($role = $DB->get_record('role', ['shortname' => $shortname])) {
                return (int) $role->id;
            }
            // Crea el rol con archetype vacío para no heredar nada accidentalmente.
            return create_role($name, $shortname, $description);
        };

        // 1) Asegura existencia de los roles personalizados:
        $r_acad = $ensure_role('academiccoordinator', 'Academic Coordinator');
        $r_acomp = $ensure_role('acompanamientofacilitador', 'Acompañamiento Facilitador');
        $r_train = $ensure_role('training', 'Training');
        $r_repo = $ensure_role('repository', 'Repository');
        $r_sup = $ensure_role('support', 'Support');

        // 2) Roles nativos (siempre existen):
        $rid_student = $DB->get_field('role', 'id', ['shortname' => 'student']);
        $rid_teacher = $DB->get_field('role', 'id', ['shortname' => 'teacher']);
        $rid_editingteacher = $DB->get_field('role', 'id', ['shortname' => 'editingteacher']);
        $rid_manager = $DB->get_field('role', 'id', ['shortname' => 'manager']);

        // 3) Asignaciones:
        $viewcap = 'local/microcapsulas:view';
        $editcap = 'local/microcapsulas:edit';

        // View-only: academiccoordinator, acompanamientofacilitador, training, student
        foreach ([$r_acad, $r_acomp, $r_train, $rid_student] as $rid) {
            if ($rid) {
                assign_capability($viewcap, CAP_ALLOW, $rid, $sysctx, /*overwrite*/ true);
                assign_capability($editcap, CAP_PREVENT, $rid, $sysctx, /*overwrite*/ true);
            }
        }

        // Edit: repository, support, teacher, editingteacher
        foreach ([$r_repo, $r_sup, $rid_teacher, $rid_editingteacher] as $rid) {
            if ($rid) {
                assign_capability($viewcap, CAP_ALLOW, $rid, $sysctx, true);
                assign_capability($editcap, CAP_ALLOW, $rid, $sysctx, true);
            }
        }
        // Manager: todo
        if ($rid_manager) {
            assign_capability($viewcap, CAP_ALLOW, $rid_manager, $sysctx, true);
            assign_capability($editcap, CAP_ALLOW, $rid_manager, $sysctx, true);
        }

        upgrade_plugin_savepoint(true, $targetversion, 'local', 'microcapsulas');
    }
    return true;
}