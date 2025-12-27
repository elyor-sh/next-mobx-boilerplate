import {ViewModelConstructor} from "@/shared/lib/create-use-store";
import {TodoListQueryParams} from "@/todos/api";
import {makeViewModel} from "@/shared/lib/make-view-model";
import {TodosPageModuleContextType} from "@/todos/provider/config";

type ViewModel = ViewModelConstructor<TodosPageModuleContextType>

export class TodoListFilterVM implements ViewModel {
    constructor(public context: TodosPageModuleContextType) {
        makeViewModel(this)
    }

    get values () {
        return this.context.queryParams.params
    }

    setValue (params: Partial<TodoListQueryParams>) {
        this.context.queryParams.set(params)
    }

    // optional search with debounce if it is needed
}