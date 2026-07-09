export const routes = {
  home: "/",
  login: "/login",
  register: "/register",

  parent: {
    dashboard: "/parent/dashboard",
    students: "/parent/students",
    newStudent: "/parent/students/new",
    studentDetail: (id: string) => `/parent/students/${id}`,
  },

  admissionTeam: {
    dashboard: "/admission-team/dashboard",
    applications: "/admission-team/applications",
    applicationDetail: (id: string) => `/admission-team/applications/${id}`,
    applicationScore: (id: string) => `/admission-team/applications/${id}/score`,
    applicationAssign: (id: string) => `/admission-team/applications/${id}/assign`,
    slots: "/admission-team/slots",
  },
} as const;

export const publicRoutes = new Set([
  routes.home,
  routes.login,
  routes.register,
  "/public",
]);

export const parentRoutePrefix = "/parent" as const;
export const admissionTeamRoutePrefix = "/admission-team" as const;

export function isPublicRoute(pathname: string): boolean {
  return (
    pathname === routes.home ||
    pathname === routes.login ||
    pathname === routes.register ||
    pathname.startsWith("/public/")
  );
}

export function isParentRoute(pathname: string): boolean {
  return pathname.startsWith(parentRoutePrefix);
}

export function isAdmissionTeamRoute(pathname: string): boolean {
  return pathname.startsWith(admissionTeamRoutePrefix);
}

export function getDashboardForRole(role: string | null | undefined): string {
  return role === "ADMISSION_TEAM"
    ? routes.admissionTeam.dashboard
    : routes.parent.dashboard;
}
