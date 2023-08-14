import { groupBy, type Dictionary } from "lodash";

export type SessionId = number;
export type TitleId = number;
export type ProcessId = number;
export type StringTime = string;

export interface SessionsDumpDatabaseRepresentation {
    columns: ["Id", "Name", "PID", "Start", "End"],
    values: [SessionId, string, ProcessId, StringTime, StringTime][]
}

export interface SessionTitlesDumpDatabaseRepresentation {
    columns: ["Id", "Title", "SessionId", "Start", "End"],
    values: [TitleId, string, SessionId, StringTime, StringTime]
}

export interface Session {
    id: SessionId
    timeRange: [Date, Date]
    processName: string
}

export interface SessionTitle {
    id: TitleId,
    sessionId: SessionId
    timeRange: [Date, Date],
    title: string
}

export interface SessionProcessGroup {
    label: string,
    data: Session[]
}

export interface TimelineGroup {
    group: "",
    data: SessionProcessGroup[]
}


export interface SessionTitles {
    sessionId: SessionId,
    titles: SessionTitle[]
}

export type TimelineRepresentation = TimelineGroup[];

export type SessionTitlesRepresentation = SessionTitles[];


export function sessionsToTimeline(dbRepresentation: SessionsDumpDatabaseRepresentation[]): TimelineRepresentation {
    const timelineSessions: Session[] = dbRepresentation[0].values.map(dbSession => ({
        id: dbSession[0],
        timeRange: [new Date(dbSession[3]), new Date(dbSession[4])],
        processName: dbSession[1]
    }))

    const timelineDict = groupBy(timelineSessions, (s) => s.processName);
    const processGroups: SessionProcessGroup[] = Object.entries(timelineDict).map(v => ({ label: v[0], data: v[1] }));
    return [{ group: "", data: processGroups }];
}

export function sessionTitlesToTimeline(dbRepresentation: SessionTitlesDumpDatabaseRepresentation[]): Dictionary<SessionTitle[]> {
    console.log(dbRepresentation[0])

    const timelineTitles: SessionTitle[] = dbRepresentation[0].values.map(dbTitle => ({
        id: dbTitle[0],
        title: dbTitle[1],
        timeRange: [new Date(dbTitle[3]), new Date(dbTitle[4])],
        sessionId: dbTitle[2]
    }))


    const titleDict = groupBy(timelineTitles, (t) => t.sessionId);
    return titleDict;
}