export const endpoints = {
  auth: {
    me: "/auth/me",
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },

  students: {
    list: "/students",
    detail: (id: string) => `/students/${id}`,
    registrationFee: (id: string) => `/students/${id}/registration-fee`,
  },

  examSlots: {
    list: "/exam-slots",
    all: "/exam-slots/all",
    detail: (id: string) => `/exam-slots/${id}`,
    book: (id: string) => `/exam-slots/${id}/book`,
  },

  admission: {
    applications: "/admission/applications",
    applicationDetail: (id: string) => `/admission/applications/${id}`,
    score: (id: string) => `/admission/applications/${id}/score`,
    assignCourse: (id: string) => `/admission/applications/${id}/assign-course`,
  },
} as const;
