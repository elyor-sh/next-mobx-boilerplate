import { GlobalsContextType } from "@/providers/global/config";
import { createEffect } from "@/shared/lib/create-effect";
import { ViewModelConstructor } from "@/shared/lib/create-use-store";
import { makeViewModel } from "@/shared/lib/make-view-model";
import { getUsers, Users } from "@/users/api";

type ViewModel = ViewModelConstructor<GlobalsContextType>;

type UserLookup = {
  id: number;
  name: string;
};

export class UsersSelectVM implements ViewModel {
  users: UserLookup[] = [];

  constructor(public context: GlobalsContextType) {
    makeViewModel(this);
  }

  loadUsers = createEffect(async ({ signal }) => {
    const res = await getUsers({ signal });
    this.setUsersLookup(res);
  });

  setUsersLookup(users: Users[]) {
    this.users = users.map((user) => ({
      id: user.id,
      name: user.name,
    }));
  }

  afterMount() {
    void this.loadUsers();
  }
}
