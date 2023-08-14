<script lang="ts">
  import type { SessionTitle } from "../data/data";

  export let title: SessionTitle;
</script>

<div>
  {new Intl.DateTimeFormat("cs-CZ", { timeStyle: "short" }).format(
    title.timeRange[0]
  )}-{new Intl.DateTimeFormat("cs-CZ", { timeStyle: "short" }).format(
    title.timeRange[1]
  )}
</div>
<div>{title.val}</div>
--
