import type { SvelteComponentTyped } from "svelte";

export type TreeViewData = {
    content: any
    component?: SvelteComponentTyped<{}, {}, {}> 
    children?: TreeViewData[]
}