<script lang="ts">
  import initSqlJs, { type Database } from "sql.js";

  import sqliteUrl from "./assets/sql-wasm.wasm?url";
  import Timeline from "./lib/Timeline.svelte";
  import Browser from "./lib/Browser.svelte";

  import {
    sessionsToTimeline,
    type SessionsDumpDatabaseRepresentation,
    type TimelineRepresentation,
    type SessionTitlesDumpDatabaseRepresentation,
    sessionTitlesToTimeline,
    type SessionTitle,
  } from "./data/data";
  import { SQLStrings } from "./lib/SQLStrings";
  import type { Dictionary } from "lodash";
  let db: Database;
  let dbSessions: SessionsDumpDatabaseRepresentation[];
  let dbSessionTitles: SessionTitlesDumpDatabaseRepresentation[];
  let timelineDbRepresentation: TimelineRepresentation = null;
  let sessionTitlesRepresentation: Dictionary<SessionTitle[]>;
  let last24hours = true;
  async function initializeTimetrackingDb(dbBuffer: ArrayBuffer) {
    const sql = await initSqlJs({
      locateFile: () => sqliteUrl,
    });

    db = new sql.Database(new Uint8Array(dbBuffer));

    dbSessions = db.exec(
      last24hours
        ? SQLStrings.last24hoursSessionsSQLString
        : SQLStrings.allSessionsSQLString
    );
    dbSessionTitles = db.exec(
      last24hours
        ? SQLStrings.last24hoursTitlesBySessionIdSQLString
        : SQLStrings.allTitlesBySessionIdSQLString
    );
    timelineDbRepresentation = sessionsToTimeline(dbSessions);
    sessionTitlesRepresentation = sessionTitlesToTimeline(dbSessionTitles);
    console.log(sessionTitlesRepresentation);
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
  {#await dbSessions}
    ...loading
  {:then results}
    <!-- {JSON.stringify(results)} -->
  {:catch e}
    {JSON.stringify(e)}
  {/await}

  {#if timelineDbRepresentation != null}
    <Timeline data={timelineDbRepresentation} />
    <Browser
      timelineRep={timelineDbRepresentation}
      sessionTitles={sessionTitlesRepresentation}
    />
  {/if}
</main>

<style>
</style>
