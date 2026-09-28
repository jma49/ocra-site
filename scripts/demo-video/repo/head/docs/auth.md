# Authentication

`POST /login` returns a session id, a refresh token and `expiresAt`, the
session's expiry as Unix time in seconds. Sessions last 30 minutes.

`POST /logout` ends the session and revokes its refresh token.
