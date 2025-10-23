"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSuperAdmin = exports.isTeamAdmin = exports.canAccessTeam = void 0;
const canAccessTeam = (user, teamId) => {
    return user?.teamMemberships?.some((m) => m.teamId === teamId);
};
exports.canAccessTeam = canAccessTeam;
const isTeamAdmin = (user, teamId) => {
    return user?.teamMemberships?.some((m) => m.teamId === teamId && ['ADMIN', 'OWNER'].includes(m.role));
};
exports.isTeamAdmin = isTeamAdmin;
const isSuperAdmin = (user) => {
    return user?.admin?.level === 'SUPER';
};
exports.isSuperAdmin = isSuperAdmin;
