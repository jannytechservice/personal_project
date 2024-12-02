export const USER_GROUPS = {
  SUPER_ADMINS: 'SuperAdmins',
  ADMINS: 'Admins',
  USERS: 'Users',
};
export const isInGroup = (claims: any, group: string) => {
  if (!claims || !claims['cognito:groups']) {
    return false;
  }

  return claims['cognito:groups'].includes(group);
};

export function isAdmin(groups: string[] | null): boolean {
  if (!groups) {
    return false;
  }
  return (
    groups.includes(USER_GROUPS.ADMINS) ||
    groups.includes(USER_GROUPS.SUPER_ADMINS)
  );
}

// With String.prototype.replace(), the pattern can be a
// string or a regex. However, APPSYNC_JS only accepts a
// string that is treated as a regex!
//const AUTH0_PROVIDER_PREFIX = '^twitter\\|';
//
//export function authorize(
//  userId: string,
//  identity?: AppSyncIdentityOIDC
//): string {
//  if (identity?.sub && identity.sub !== userId) {
//    util.unauthorized();
//  }
//  return userId.replace(AUTH0_PROVIDER_PREFIX, '');
//}
