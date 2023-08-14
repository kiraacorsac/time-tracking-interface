<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import type { TimelineRepresentation } from "../data/data";
  import TreeView from "./TreeView.svelte";
  import { children } from "svelte/internal";
  import { type TreeViewData } from "./TreeViewTypes";
  import TreeViewSession from "./TreeViewSession.svelte";

  function makeTreeView(timelineRep: TimelineRepresentation): TreeViewData {
    return {
      content: "filename",
      children: timelineRep[0].data.map((programGroup) => ({
        content: programGroup.label,
        children: programGroup.data.map((session) => ({
          content: {timeRange: session.timeRange},
          component: TreeViewSession
        })).sort((s1, s2) => s2.content.timeRange[0].valueOf() - s1.content.timeRange[0].valueOf()),
      })),
    };
  }

  export let timelineRep: TimelineRepresentation;
  let timelineTreeView = makeTreeView(timelineRep);
</script>

<ul>
  <TreeView tree={timelineTreeView} />
</ul>
