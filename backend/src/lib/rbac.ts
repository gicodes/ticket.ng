import { User } from "../types/user";

export const canAccessTeam = (user: User, teamId: string) => {
  return user?.teamMemberships?.some((m: any) => m.teamId === teamId);
};

export const isTeamAdmin = (user: User, teamId: string) => {
  return user?.teamMemberships?.some(
    (m) => m.teamId === teamId && ['ADMIN', 'OWNER'].includes(m.role)
  );
};

export const isSuperAdmin = (user: User) => {
  return user?.admin?.level === 'SUPER';
};
