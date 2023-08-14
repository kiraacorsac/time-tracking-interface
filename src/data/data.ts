import { groupBy } from "lodash";

export type SessionId = number;
export type TitleId = number;
export type ProcessId = number;
export type StringTime = string;

export interface DatabaseRepresentation {
        columns: ["Id", "Name", "PID", "Start", "End"],
        values: [SessionId, string, ProcessId, StringTime, StringTime][]
}

export interface Session {
    timeRange: [Date, Date]
    val: string
}

export interface SessionProcessGroup {
    label: string,
    data: Session[]
}

export interface TimelineGroup {
    group: "",
    data: SessionProcessGroup[]
}

export type TimelineRepresentation = TimelineGroup[];


export function databaseToTimeline(dbRepresentation: DatabaseRepresentation[]): TimelineRepresentation {
    const timelineSessions: Session[] = dbRepresentation[0].values.map(dbSession => ({
        timeRange: [new Date(dbSession[3]), new Date(dbSession[4])],
        val: dbSession[1]
    }))

    const timelineDict = groupBy(timelineSessions, (s) => s.val);
    const processGroups: SessionProcessGroup[] = Object.entries(timelineDict).map(v => ({ label: v[0], data: v[1] }));
    return [{ group: "", data: processGroups }];
}