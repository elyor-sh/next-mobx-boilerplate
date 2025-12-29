import { getUsers } from "@/users/api";
import { UsersProvider } from "@/users/provider";
import { UsersList } from "@/users/ui/list";

export default async function Home() {
  const users = await getUsers({});

  return (
    <UsersProvider initialUsers={users}>
      <h1 className="mb-3">Users</h1>
      <UsersList />
    </UsersProvider>
  );
}
