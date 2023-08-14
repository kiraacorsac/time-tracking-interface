export const SQLStrings = {
    allSessionsSQLString: "SELECT * FROM 'Sessions'",
    last24hoursSessionsSQLString: "SELECT * FROM 'Sessions' WHERE Start >= datetime('now','-1 day')",
    getTitlesBySessionIdSQLString: sessionId => `SELECT Titles.Id, Titles.Title, Sessions.Id as SessionId, Titles.start, Titles.end FROM 'Sessions' JOIN 'Titles' ON Sessions.Id = Titles.SessionId Where Sessions.Id =  ${sessionId}`,
    allTitlesBySessionIdSQLString: `SELECT Titles.Id, Titles.Title, Sessions.Id as SessionId, Titles.start, Titles.end FROM 'Sessions' JOIN 'Titles' ON Sessions.Id = Titles.SessionId`,
    last24hoursTitlesBySessionIdSQLString: `SELECT Titles.Id, Titles.Title, Sessions.Id as SessionId, Titles.start, Titles.end FROM 'Sessions' JOIN 'Titles' ON Sessions.Id = Titles.SessionId WHERE Titles.Start >= datetime('now','-1 day')`,
}