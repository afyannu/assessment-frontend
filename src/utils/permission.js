export const hasPermission = (module, action) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = JSON.parse(localStorage.getItem("permissions") || "{}");

  if (user?.role?.name === "Super Admin") return true; 
  return !!permissions?.[module]?.[action];
};