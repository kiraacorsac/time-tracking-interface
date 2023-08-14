<script lang="ts">
  import initSqlJs, { type Database } from "sql.js";

  import sqliteUrl from "./assets/sql-wasm.wasm?url";
  import Timeline from "./lib/Timeline.svelte";
  import Browser from "./lib/Browser.svelte";

  import {
    databaseToTimeline,
    type DatabaseRepresentation,
    type TimelineRepresentation,
  } from "./data/data";
  let dbContents: DatabaseRepresentation[];
  let timelineDbRepresentation: TimelineRepresentation = null;
  let last24hours = true;
  async function initializeTimetrackingDb(dbBuffer: ArrayBuffer) {
    const sql = await initSqlJs({
      locateFile: () => sqliteUrl,
    });

    const db = new sql.Database(new Uint8Array(dbBuffer));
    let allSQLString = "SELECT * FROM 'Sessions'";
    let last24hoursSQLString = "SELECT * FROM 'Sessions' WHERE Start >= datetime('now','-1 day')"

    dbContents = db.exec(last24hours ? last24hoursSQLString: allSQLString);
    timelineDbRepresentation = databaseToTimeline(dbContents);
  }

  function readDbAsByteArray(e: Event & { currentTarget: HTMLInputElement }) {
    if (e.currentTarget.files == null) {
      return;
    }

    const db = e.currentTarget.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(db);
    reader.onload = (event) => {
      initializeTimetrackingDb(reader.result as ArrayBuffer);
    };
  }
</script>

<main>
  <input type="file" on:change={readDbAsByteArray} />
  <input type="checkbox" bind:checked={last24hours} /> Only last 24 hours
  {#await dbContents}
    ...loading
  {:then results}
    <!-- {JSON.stringify(results)} -->
  {:catch e}
    {JSON.stringify(e)}
  {/await}

  {#if timelineDbRepresentation != null}
    <Timeline data={timelineDbRepresentation} />
    <Browser timelineRep={timelineDbRepresentation} />
  {/if}
</main>

<style>
</style>
