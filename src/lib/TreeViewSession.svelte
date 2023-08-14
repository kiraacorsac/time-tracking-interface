<script lang="ts">
  export let timeRange: [Date, Date];
  const [start, end] = timeRange;
</script>

<div>
    🟢 {start.toLocaleString("cs-CZ", { timeStyle: "short", dateStyle: "short" })}
    <br />
    🔴 {end.toLocaleString("cs-CZ", { timeStyle: "short", dateStyle: "short" })}
</div>
