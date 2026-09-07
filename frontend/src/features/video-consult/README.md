# feature: video-consult

Video / voice consultation screen + chat widget.

**Owns:** `CallScreen`, `CallControls`, `ParticipantTile`, `ChatPanel`,
`DeviceSettings`.
**Uses:** `@/api/videoConsult.api`.
**Backend:** none yet — served by MSW. Will wrap a WebRTC provider (Twilio /
Daily / LiveKit); `GET /consult/sessions/:id/token` returns the join token.
Signaling/socket base URL comes from `VITE_SOCKET_URL`.
