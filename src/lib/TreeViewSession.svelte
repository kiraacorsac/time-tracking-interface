<script lang="ts">
    export let timeRange : [Date, Date];
    const [start, end] = timeRange
</script>

<div>
    <hr/>
    🟢 {start.toLocaleString("cs-CZ")}
    <br/>
    🔴 {end.toLocaleString("cs-CZ")}
    <hr/>
</div>