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

// Definir las capacidades del plugin
defined('MOODLE_INTERNAL') || die();

$capabilities = [
    // Ver microcapsulas (solo lectura).
    'local/microcapsulas:view' => [
        'captype' => 'read',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            // Manager: todo permitido
            'manager' => CAP_ALLOW,
            // Docentes nativos: pueden ver (además de editar más abajo).
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
            // Estudiante: solo ver
            'student' => CAP_ALLOW,
        ],
    ],

    // Editar microcapsulas (escritura).
    'local/microcapsulas:edit' => [
        'riskbitmask' => RISK_PERSONAL | RISK_DATALOSS,
        'captype' => 'write',
        'contextlevel' => CONTEXT_COURSE,
        'archetypes' => [
            // Manager: todo permitido
            'manager' => CAP_ALLOW,
            // Docentes nativos con edición
            'teacher' => CAP_ALLOW,
            'editingteacher' => CAP_ALLOW,
        ],
    ],
];