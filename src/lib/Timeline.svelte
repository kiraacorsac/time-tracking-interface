<script lang="ts">
  import TimelinesChart, { type TimelinesChartInstance } from "timelines-chart";
  import { scaleOrdinal } from "d3";
  export let data;
  let timelinesElement;

  let timelines = TimelinesChart();
  $: {
    if (data != null) {
      timelines.data(data);
      timelines.zColorScale(scaleOrdinal(["red", "green", "blue", "yellow", "purple"]));
      timelines.maxLineHeight(50)
      timelines(timelinesElement);
    }
  }
</script>

<div bind:this={timelinesElement} />
