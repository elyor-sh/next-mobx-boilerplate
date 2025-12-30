# Next.js + MobX Boilerplate

A production-ready boilerplate for building scalable web applications using **Next.js** with **MobX** state management, following the **MVVM (Model-View-ViewModel)** architectural pattern. This project demonstrates complete separation of business logic from UI components, making your code more maintainable, testable, and scalable.

## 🚀 Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[MobX 6](https://mobx.js.org/)** - Simple, scalable state management
- **[React Hook Form](https://react-hook-form.com/)** - Performant, flexible forms
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication for Next.js

## 🏗️ Architecture: MVVM Pattern

This project strictly follows the **MVVM (Model-View-ViewModel)** pattern, ensuring complete separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                         View (UI)                        │
│  - Pure presentational components                        │
│  - No business logic                                     │
│  - Observes ViewModel state                             │
└─────────────────┬───────────────────────────────────────┘
                  │ (observer)
┌─────────────────▼───────────────────────────────────────┐
│                      ViewModel                           │
│  - Business logic and state management                   │
│  - Form handling and validation                          │
│  - Async operations (effects)                            │
│  - Computed values                                       │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│                        Model                             │
│  - Pure data storage (observable state)                  │
│  - No business logic                                     │
│  - Simple data structures                                │
└─────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Complete Logic Separation**: All business logic lives in ViewModels, not in UI components
2. **Observable State**: MobX makes state management reactive and simple
3. **Type Safety**: Full TypeScript support with Zod schemas
4. **Testability**: ViewModels can be tested independently from UI

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── shared/
│   └── lib/               # 🔧 Important helper utilities (see below)
├── providers/             # Global context providers
├── session/               # Authentication module
├── todos/                 # Example feature module
│   ├── api/              # API calls and schemas (Model)
│   ├── model/            # Data models
│   ├── view-model/       # Business logic (ViewModel)
│   ├── ui/               # UI components (View)
│   ├── features/         # Feature-specific components
│   └── provider/         # Module context provider
└── users/                 # Another example module
```

## 🔧 Important Helpers (`shared/lib`)

The `shared/lib` folder contains essential utilities that power the MVVM architecture:

### 1. **`createUseStore`**

Creates a custom hook for accessing ViewModels with lifecycle management.

```typescript
// Step 1: Create context and hook
import { createContext } from "react";
import { createUseStore } from "@/shared/lib/create-use-store";

export const TodosPageModuleContext = createContext<
  TodosPageModule | undefined
>(undefined);

export const useTodosPageModuleContext = createUseStore(TodosPageModuleContext);

// Step 2: Use in components without ViewModel (access context only)
const { context } = useTodosPageModuleContext();

// Step 3: Use with ViewModel
const { vm, context } = useTodosPageModuleContext(TodoListVM);

// Step 4: Use with ViewModel that requires props
export class ItemVM implements ViewModelConstructor<GlobalsContextType> {
  constructor(
    public context: GlobalsContextType,
    public props: { itemId: number; mode: string },
  ) {
    makeViewModel(this);
  }

  get item() {
    return this.context.items.find((i) => i.id === this.props.itemId);
  }
}

// In component
const { vm } = useGlobalsContext(ItemVM, { itemId: 123, mode: "edit" });
// Props are observable and reactive
```

**Features:**

- Automatic ViewModel instantiation
- Lifecycle hooks: `beforeMount`, `afterMount`, `beforeUnmount`
- Automatic cleanup of disposers (autoruns, reactions)
- Context injection
- Optional props support with reactive updates
- Type-safe context and ViewModel access

### 2. **`makeViewModel`**

Converts a class into a reactive MobX ViewModel with automatic observable detection.

```typescript
export class LoginVM {
  constructor(public context: GlobalsContextType) {
    makeViewModel(this); // Makes all properties observable
  }
}
```

**Features:**

- Auto-detects and excludes `createEffect` and `createForm` from observables
- Automatically binds methods to instance
- Excludes `context` and `props` from being observable

### 3. **`createEffect`**

Wraps async operations with loading/error/success states and automatic request cancellation.

```typescript
loadTodos = createEffect(async ({ signal }) => {
  const todos = await getTodos({ signal });
  this.setTodos(todos);
});

// In UI: vm.loadTodos.state.loading
```

**Features:**

- Automatic loading state management
- Built-in AbortController for request cancellation
- Error handling
- Observable state: `loading`, `error`, `fulfilled`

### 4. **`createForm` & `createFormState`**

Integrates React Hook Form with MobX for reactive form state.

```typescript
form = createForm({
  defaultValues: { email: "", password: "" },
  resolver: zodResolver(loginSchema),
});

private state = createFormState(this, this.form.control);

get formState() {
  return this.state.formState; // Observable form state
}
```

**Features:**

- Full React Hook Form API
- MobX-compatible (excluded from auto-observable)
- Works with Zod validation
- `createFormState` makes form state observable for reactive UI updates

### 5. **`ValidatedQueryParams`**

Type-safe URL query parameter management with Zod validation.

```typescript
queryParams = new ValidatedQueryParams(
  router.queryParams,
  router.setQueryParams,
  todoListQueryParamsSchema,
);

// Usage
queryParams.set({ userId: 1 }); // Type-safe and validated
```

**Features:**

- Automatic validation with Zod schemas
- Type-safe parameter access
- Reactive updates
- URL synchronization

### 6. **`appendAutoRun`**

Manages MobX autoruns with automatic cleanup.

```typescript
afterMount() {
  appendAutoRun(this, () => this.loadTodos());
}
```

**Features:**

- Automatic disposal on component unmount
- Multiple autorun support
- Prevents memory leaks

### 7. **`useInitRouter`**

Observable wrapper around Next.js router with reactive state.

```typescript
const appRouter = useInitRouter();
// appRouter.pathname, appRouter.queryParams are observable
```

**Features:**

- Observable pathname, params, and query params
- Type-safe navigation methods
- Reactive URL state

## 💡 How It Works: Complete Example

### 1. Define API Layer (Schema + API Calls)

```typescript
// todos/api/index.ts
export const todoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;

export async function getTodos({ signal }: { signal?: AbortSignal }) {
  const { data } = await http.get<Todo[]>("/todos", { signal });
  return todoSchema.array().parse(data);
}
```

### 2. Create Model (Pure Data Storage)

```typescript
// todos/model/index.ts
export class TodosModel {
  todoList: Todo[];

  constructor(initialTodos: Todo[]) {
    this.todoList = initialTodos;
    makeAutoObservable(this, undefined, { autoBind: true });
  }
}
```

### 3. Create ViewModel (Business Logic)

```typescript
// todos/view-model/index.ts
export class TodoListVM implements ViewModelConstructor<TodosPageModuleContextType> {
  constructor(public context: TodosPageModuleContextType) {
    makeViewModel(this);
  }

  loadTodos = createEffect(async ({ signal }) => {
    const todos = await getTodos({ signal });
    this.context.todosModel.todoList = todos; // Updates Model
  });

  afterMount() {
    appendAutoRun(this, () => this.loadTodos());
  }

  beforeUnmount() {
    this.loadTodos.abortController?.abort();
  }
}
```

### 4. Create View (UI Component)

```typescript
// todos/ui/index.tsx
export const TodosList = observer(() => {
  const { vm } = useTodosPageModuleContext(TodoListVM);

  if (vm.loadTodos.state.loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {vm.context.todosModel.todoList.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
});
```

## 🔐 Authentication Example

The project includes a complete authentication example using NextAuth.js:

```typescript
// ViewModel
export class LoginVM {
  form = createForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(loginSchema),
  });

  private state = createFormState(this, this.form.control);

  constructor(public context: GlobalsContextType) {
    makeViewModel(this);
  }

  get formState() {
    return this.state.formState;
  }

  login = createEffect(async () => {
    const fields = this.form.getValues();
    const result = await signIn("credentials", {
      email: fields.email,
      password: fields.password,
      redirect: false,
    });

    if (!result?.error) {
      this.context.appRouter.replace("/");
    }
  });
}

// View
export const Login = observer(() => {
  const { vm } = useGlobalsContext(LoginVM);

  return (
    <form onSubmit={vm.form.handleSubmit(vm.login)}>
      <input {...vm.form.register("email")} />
      {vm.formState.errors.email && <p>{vm.formState.errors.email.message}</p>}

      <button disabled={vm.login.state.loading}>Login</button>
    </form>
  );
});
```

## 🚦 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next-mobx-boilerplate
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   # Create .env.local
   NEXTAUTH_SECRET=your-secret-key
   ```

4. **Run development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

### Testing

- `pnpm test` - Run all tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm test:clear` - Clear Jest cache

## 🎯 Key Features

- ✅ **MVVM Architecture** - Complete separation of UI and business logic
- ✅ **Type Safety** - Full TypeScript support with Zod validation
- ✅ **Reactive State** - MobX makes state management simple and efficient
- ✅ **Form Management** - React Hook Form with Zod validation
- ✅ **Authentication** - NextAuth.js integration with credentials provider
- ✅ **Request Cancellation** - Automatic cleanup of pending requests
- ✅ **Query Params** - Type-safe URL parameter management
- ✅ **Code Quality** - ESLint, Prettier, Husky, and lint-staged
- ✅ **Modern Stack** - Next.js 16 App Router, React 19

## 🧪 Testing

This project includes a comprehensive test suite with **146 tests** across **18 test suites** covering all layers of the application.

### Quick Start

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage report
pnpm test:coverage

# Clear Jest cache
pnpm test:clear
```

### Test Structure

All tests are organized in `src/__tests__/` directory, mirroring the source code structure:

```
src/__tests__/
├── todos/                      # Todos module tests
│   ├── api/                   # API layer tests
│   ├── model/                 # TodosModel tests
│   ├── view-model/            # TodoListVM, TodoListFilterVM tests
│   └── provider/              # TodosPageModule tests
├── users/                      # Users module tests
│   ├── api/                   # API layer tests
│   ├── model/                 # UsersModel tests
│   └── provider/              # UsersPageModule tests
├── pickers/                    # Pickers tests
│   └── user-select/           # UsersSelectVM tests
├── shared/                     # Shared utilities tests
│   ├── lib/                   # Core utilities tests
│   │   ├── create-effect.test.ts
│   │   ├── make-view-model.test.ts
│   │   └── query-params.test.ts
│   ├── constants/             # Constants tests
│   └── http/                  # HTTP client tests
├── providers/                  # Global providers tests
│   ├── global/                # Globals tests
│   └── auth/                  # Session tests
├── integration/                # Integration tests
│   └── todos-flow.test.ts     # Complete todos flow
├── __mocks__/                  # Mock data and ES module mocks
│   ├── data.ts                # Mock data factories
│   ├── lodash-es.ts           # lodash-es mock for Jest
│   └── query-string.ts        # query-string mock for Jest
├── __helpers__/                # Test utilities
│   └── test-utils.ts          # Helper functions
└── examples/                   # Usage examples
    └── using-helpers.test.ts  # How to use test helpers
```

### Why MVVM Makes Testing Easy

Since business logic is completely separated from UI, ViewModels can be tested independently without rendering components:

```typescript
import { TodoListVM } from "@/todos/view-model/TodoListVM";
import { createMockContext } from "@/__tests__/__helpers__/test-utils";
import { getTodos } from "@/todos/api";

jest.mock("@/todos/api");

describe("TodoListVM", () => {
  it("should load todos successfully", async () => {
    const mockContext = createMockContext();
    const vm = new TodoListVM(mockContext);

    await vm.loadTodos();

    expect(vm.loadTodos.state.fulfilled).toBe(true);
    expect(vm.context.todosModel.todoList).toHaveLength(10);
  });

  it("should handle loading state", () => {
    const vm = new TodoListVM(mockContext);

    vm.loadTodos();

    expect(vm.loadTodos.state.loading).toBe(true);
  });
});
```

### Test Coverage

The test suite covers all architectural layers:

#### **Models** (Data Layer)

- `TodosModel` - Todo list state management
- `UsersModel` - Users state management

#### **ViewModels** (Business Logic Layer)

- `TodoListVM` - Todo list operations and lifecycle
- `TodoListFilterVM` - Query params and filtering
- `UsersSelectVM` - User selection with async loading

#### **API Layer**

- Todos API with Zod schema validation
- Users API with Zod schema validation
- HTTP client error handling

#### **Shared Utilities**

- `createEffect` - Async operations with abort controller
- `makeViewModel` - MobX ViewModel creation
- `query-params` - URL query parameter utilities
- `default-params` - Default pagination parameters

#### **Providers**

- `TodosPageModule` - Todos page context
- `UsersPageModule` - Users page context
- `Globals` - Global application state
- `Session` - Authentication session

#### **Integration Tests**

- Complete todos flow (load → filter → cancel)
- Request cancellation scenarios

### Test Utilities

The project includes helpful test utilities in `src/__tests__/__helpers__/test-utils.ts`:

```typescript
// Create mock context for testing ViewModels
const mockContext = createMockContext();

// Create mock todos with custom data
const todos = createMockTodos(5);

// Expect effect to be in fulfilled state
expectFulfilledState(vm.loadTodos);

// Expect effect to be in loading state
expectLoadingState(vm.loadTodos);

// Expect effect to be in error state
expectErrorState(vm.loadTodos);
```

### ES Module Mocks

The project handles ES modules (`lodash-es`, `query-string`) that Jest can't parse by default. Custom mocks are provided in `src/__tests__/__mocks__/`:

- **`lodash-es.ts`** - Mock for `lodash-es` with `isEqual` implementation
- **`query-string.ts`** - Mock for `query-string` using native `URLSearchParams`

These mocks are automatically used via `moduleNameMapper` in `jest.config.js`.

### Coverage Goals

```javascript
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

### Running Specific Tests

```bash
# Run tests for a specific file
pnpm test TodoListVM

# Run tests in a specific directory
pnpm test src/__tests__/todos

# Run tests matching a pattern
pnpm test --testNamePattern="should load"

# Run tests with verbose output
pnpm test --verbose
```

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MobX Documentation](https://mobx.js.org/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [NextAuth.js](https://next-auth.js.org/)

## 📄 License

This project is open source and available under the MIT License.

---

**Happy coding! 🚀**
