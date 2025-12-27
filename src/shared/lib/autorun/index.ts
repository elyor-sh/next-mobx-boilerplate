/* eslint-disable @typescript-eslint/no-explicit-any */

import {autorun} from "mobx";
import {ViewModelConstructor} from "@/shared/lib/create-use-store";

export function appendAutoRun<C extends ViewModelConstructor<any>>(
    ctx: C,
    ...fns: Array<() => void>
) {
    if (!ctx.disposers) {
        ctx.disposers = [];
    }
    fns.forEach((fn) => {
        const disposer = autorun(fn);
        ctx.disposers?.push(disposer);
    });
}