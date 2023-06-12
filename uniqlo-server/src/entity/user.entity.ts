import { Role } from 'src/utils/roles/role.enum';

export class User {
  email: string;
  displayName: string;
  roles: Role[];
}
