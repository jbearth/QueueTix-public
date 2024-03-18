import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

export interface DataUserLists {
  id: string,
  avatarUrl: string,
  name: string,
  email: string,
  role: string
  phone: string,
  status: string,
}

const users: DataUserLists[] = [...Array(100)].map((_, _index) => ({
  id: faker.string.uuid(),
  avatarUrl: faker.image.avatar(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  status: sample(['active', 'banned', 'inactive', 'pending']) || 'pending',
  role: sample([
    'Admin',
    'Manager',
    'Officer',
    'User',
    'Support',
  ]) || 'No Role',
}));

export default users;
