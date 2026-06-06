export type UserRole = 'super_admin' | 'admin' | 'assessor' | 'content_editor' | 'office';

export const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
  'dashboard':        ['super_admin', 'admin', 'assessor', 'content_editor', 'office'],
  'bookings':         ['super_admin', 'admin', 'assessor', 'office'],
  'quotes':           ['super_admin', 'admin', 'office'],
  'customers':        ['super_admin', 'admin', 'assessor', 'office'],
  'content':          ['super_admin', 'admin', 'content_editor'],
  'services':         ['super_admin', 'admin'],
  'seo':              ['super_admin', 'admin', 'content_editor'],
  'analytics':        ['super_admin', 'admin', 'content_editor', 'office'],
  'integrations':     ['super_admin'],
  'settings':         ['super_admin', 'admin'],
  'users':            ['super_admin'],
  'qa':               ['super_admin', 'admin'],
};

export function hasPermission(role: UserRole, moduleName: string): boolean {
  const allowedRoles = MODULE_PERMISSIONS[moduleName];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}
