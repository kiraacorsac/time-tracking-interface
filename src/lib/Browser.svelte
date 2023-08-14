<script lang="ts">
  import type {
    Session,
    SessionTitle,
    TimelineRepresentation,
  } from "../data/data";
  import TreeView from "./TreeView.svelte";
  import { type TreeViewData } from "./TreeViewTypes";
  import TreeViewSession from "./TreeViewSession.svelte";
  import { groupBy, type Dictionary } from "lodash";
  import { children } from "svelte/internal";
  import TreeViewSessionTitle from "./TreeViewSessionTitle.svelte";

  const _MS_PER_MINUTE = 1000 * 60;

  function dateDiffInMinutes(date1: Date, date2: Date) {
    return (date1.valueOf() - date2.valueOf()) / _MS_PER_MINUTE;
  }

  function sumTitleLengthsMinutes(titles: SessionTitle[]) {
    let sumMiliseconds = 0;
    for (const title of titles) {
      const titleLength =
        title.timeRange[1].valueOf() - title.timeRange[0].valueOf();
      sumMiliseconds += titleLength;
    }
    return sumMiliseconds / _MS_PER_MINUTE;
  }

  function makeTreeView(
    timelineRep: TimelineRepresentation,
    sessionTitles: Dictionary<SessionTitle[]>
  ): TreeViewData {
    return {
      content: "filename",
      initiallyExpanded: true,
      children: timelineRep[0].data.map((programGroup) => ({
        content: programGroup.label,
        children: programGroup.data
          .map((session) => ({
            content: {
              timeRange: session.timeRange,
            },
            hr: true,

            children: [
              {
                content: "Stats",
                initiallyExpanded: true,

                children: [
                  {
                    content: `${dateDiffInMinutes(
                      session.timeRange[1],
                      session.timeRange[0]
                    ).toFixed(2)} minutes`,
                  },
                  { content: `${sessionTitles[session.id].length} titles` },
                  {
                    content: "Detail Stats",
                    children: Object.entries(
                      groupBy(sessionTitles[session.id], (t) => t.title)
                    )
                      .sort((gt1, gt2) => gt1[0].localeCompare(gt2[0]))
                      .map((gt) => ({
                        content: `${gt[0]}: ${sumTitleLengthsMinutes(
                          gt[1]
                        ).toFixed(2)} minutes`,
                      })),
                  },
                ],
              },
              {
                content: "Detail",
                children: sessionTitles[session.id].map((title) => ({
                  content: { title },
                  component: TreeViewSessionTitle,
                })),
              },
            ],
            component: TreeViewSession,
          }))
          .sort(
            (s1, s2) =>
              s2.content.timeRange[0].valueOf() -
              s1.content.timeRange[0].valueOf()
          ),
      })),
    };
  }

  export let timelineRep: TimelineRepresentation;
  export let sessionTitles: Dictionary<SessionTitle[]>;
  let timelineTreeView = makeTreeView(timelineRep, sessionTitles);
</script>

<ul>
  <TreeView tree={timelineTreeView} />
</ul>
