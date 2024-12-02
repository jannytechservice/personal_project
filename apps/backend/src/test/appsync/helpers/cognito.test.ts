import { describe, expect, it } from 'vitest';
import {
  USER_GROUPS,
  isInGroup,
  isAdmin,
} from '../../../appsync/helpers/cognito';

describe('cognito.ts', () => {
  describe('isInGroup', () => {
    it('returns true when user is in the specified group', () => {
      const claims = { 'cognito:groups': [USER_GROUPS.ADMINS] };
      expect(isInGroup(claims, USER_GROUPS.ADMINS)).toBe(true);
    });

    it('returns false when user is not in the specified group', () => {
      const claims = { 'cognito:groups': [USER_GROUPS.USERS] };
      expect(isInGroup(claims, USER_GROUPS.ADMINS)).toBe(false);
    });

    it('returns false when claims object is null', () => {
      expect(isInGroup(null, USER_GROUPS.ADMINS)).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('returns true when user is in the SuperAdmins group', () => {
      const groups = [USER_GROUPS.SUPER_ADMINS];
      expect(isAdmin(groups)).toBe(true);
    });

    it('returns true when user is in the Admins group', () => {
      const groups = [USER_GROUPS.ADMINS];
      expect(isAdmin(groups)).toBe(true);
    });

    it('returns false when user is not in the Admins or SuperAdmins group', () => {
      const groups = [USER_GROUPS.USERS];
      expect(isAdmin(groups)).toBe(false);
    });

    it('returns false when groups array is null', () => {
      expect(isAdmin(null)).toBe(false);
    });
  });
});
