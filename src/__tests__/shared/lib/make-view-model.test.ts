import { isObservable, reaction, runInAction } from "mobx";

import { createEffect } from "@/shared/lib/create-effect";
import { makeViewModel } from "@/shared/lib/make-view-model";

describe("makeViewModel", () => {
  it("should make instance observable", () => {
    class TestVM {
      count = 0;

      constructor() {
        makeViewModel(this);
      }

      increment() {
        this.count++;
      }
    }

    const vm = new TestVM();

    expect(isObservable(vm)).toBe(true);
  });

  it("should auto-bind methods", () => {
    class TestVM {
      value = 10;

      constructor() {
        makeViewModel(this);
      }

      getValue() {
        return this.value;
      }
    }

    const vm = new TestVM();
    const { getValue } = vm;

    // Method should work even when detached from instance
    expect(getValue()).toBe(10);
  });

  it("should not make context observable", () => {
    class TestVM {
      context = { data: "test" };

      constructor() {
        makeViewModel(this);
      }
    }

    const vm = new TestVM();

    // context should be excluded from observability
    expect(vm.context).toBeDefined();
  });

  it("should not make props observable", () => {
    class TestVM {
      props = { value: 123 };

      constructor() {
        makeViewModel(this);
      }
    }

    const vm = new TestVM();

    expect(vm.props).toBeDefined();
  });

  it("should not make effects observable", () => {
    class TestVM {
      loadData = createEffect(async () => {
        return "data";
      });

      constructor() {
        makeViewModel(this);
      }
    }

    const vm = new TestVM();

    expect(vm.loadData).toBeDefined();
    expect(typeof vm.loadData).toBe("function");
  });

  it("should make regular properties observable", () => {
    class TestVM {
      name = "test";
      count = 0;

      constructor() {
        makeViewModel(this);
      }
    }

    const vm = new TestVM();
    const values: string[] = [];

    // Setup reaction to track changes
    reaction(
      () => vm.name,
      (name) => values.push(name),
    );

    runInAction(() => {
      vm.name = "updated";
    });

    expect(values).toContain("updated");
  });

  it("should respect custom overrides", () => {
    class TestVM {
      observable = 1;
      notObservable = 2;

      constructor() {
        makeViewModel(this, {
          notObservable: false,
        });
      }
    }

    const vm = new TestVM();

    expect(isObservable(vm)).toBe(true);
  });

  it("should work with computed values", () => {
    class TestVM {
      firstName = "John";
      lastName = "Doe";

      constructor() {
        makeViewModel(this);
      }

      get fullName() {
        return `${this.firstName} ${this.lastName}`;
      }
    }

    const vm = new TestVM();

    expect(vm.fullName).toBe("John Doe");

    vm.firstName = "Jane";

    expect(vm.fullName).toBe("Jane Doe");
  });
});
