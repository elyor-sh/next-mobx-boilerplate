/**
 * Mock data for use in tests
 */

import { Todo } from "@/todos/api";
import { Users } from "@/users/api";

export const mockTodos: Todo[] = [
  {
    id: 1,
    userId: 1,
    title: "Complete project documentation",
    completed: false,
  },
  {
    id: 2,
    userId: 1,
    title: "Review pull requests",
    completed: true,
  },
  {
    id: 3,
    userId: 2,
    title: "Fix bug in authentication",
    completed: false,
  },
  {
    id: 4,
    userId: 2,
    title: "Update dependencies",
    completed: true,
  },
  {
    id: 5,
    userId: 3,
    title: "Write unit tests",
    completed: false,
  },
];

export const mockUsers: Users[] = [
  {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    address: {
      street: "123 Main St",
      suite: "Apt. 1",
      city: "New York",
      zipcode: "10001",
      geo: {
        lat: "40.7128",
        lng: "-74.0060",
      },
    },
    phone: "1-555-123-4567",
    website: "johndoe.com",
    company: {
      name: "Acme Corporation",
      catchPhrase: "Innovative solutions for modern problems",
      bs: "synergize cutting-edge technologies",
    },
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "janesmith",
    email: "jane.smith@example.com",
    address: {
      street: "456 Oak Ave",
      suite: "Suite 200",
      city: "Los Angeles",
      zipcode: "90001",
      geo: {
        lat: "34.0522",
        lng: "-118.2437",
      },
    },
    phone: "1-555-987-6543",
    website: "janesmith.io",
    company: {
      name: "Tech Innovations Inc",
      catchPhrase: "Building the future today",
      bs: "revolutionize digital experiences",
    },
  },
  {
    id: 3,
    name: "Bob Johnson",
    username: "bobjohnson",
    email: "bob.johnson@example.com",
    address: {
      street: "789 Pine Rd",
      suite: "Unit 5",
      city: "Chicago",
      zipcode: "60601",
      geo: {
        lat: "41.8781",
        lng: "-87.6298",
      },
    },
    phone: "1-555-456-7890",
    website: "bobjohnson.dev",
    company: {
      name: "Digital Solutions LLC",
      catchPhrase: "Your success is our mission",
      bs: "optimize enterprise workflows",
    },
  },
];

export const createMockTodo = (overrides?: Partial<Todo>): Todo => ({
  id: 1,
  userId: 1,
  title: "Mock Todo",
  completed: false,
  ...overrides,
});

export const createMockUser = (overrides?: Partial<Users>): Users => ({
  id: 1,
  name: "Mock User",
  username: "mockuser",
  email: "mock@example.com",
  address: {
    street: "Mock St",
    suite: "Apt 1",
    city: "Mock City",
    zipcode: "00000",
    geo: {
      lat: "0",
      lng: "0",
    },
  },
  phone: "000-000-0000",
  website: "mock.com",
  company: {
    name: "Mock Company",
    catchPhrase: "Mock Phrase",
    bs: "mock",
  },
  ...overrides,
});

export const createMockTodos = (count: number, userId = 1): Todo[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockTodo({
      id: index + 1,
      userId,
      title: `Todo ${index + 1}`,
      completed: index % 2 === 0,
    }),
  );
};

export const createMockUsers = (count: number): Users[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockUser({
      id: index + 1,
      name: `User ${index + 1}`,
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
    }),
  );
};
