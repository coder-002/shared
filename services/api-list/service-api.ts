export const api = {
  user: {
    meta: "/user/meta",
    users: "/user",
    userRole: "/role",
  },
  branch: {
    currentBranch: "/branch/current",
    allBranches: "/branch/all/ui",
    branchById: "/branch/{id}",
  },
  menu: {
    allMenus: "/menu",
    permittedMenus: "/menu/my-menu-permissions",
  },
  member: {
    memberSearch: "/member/search",
  },
  collector: {
    getAllBranchCollector:
      "/administration/employee-collector/{activeOnly}/{allBranch}",
    getCollectorByBranchId:
      "/core/collectors/by-branch/{activeOnly}/{branchId}",
    getCollectorByStatus: "/core/collectors/dd/{activeOnly}/false",
  },
};
