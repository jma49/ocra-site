window.TRANSCRIPT = {
 "command": "ocra review --from main",
 "exit": 1,
 "lines": [
  {
   "t": 373,
   "stream": "err",
   "text": "[ocra] Reviewing: Changes from main to HEAD"
  },
  {
   "t": 386,
   "stream": "err",
   "text": "[ocra] 4 file(s) selected, 1 excluded · risk tier: full"
  },
  {
   "t": 2802,
   "stream": "err",
   "text": "[ocra] 2 bundle(s) (grouped)"
  },
  {
   "t": 2807,
   "stream": "err",
   "text": "[ocra] 4 review task(s), 2 reviewer/bundle pair(s) skipped"
  },
  {
   "t": 2808,
   "stream": "err",
   "text": "[ocra] correctness-1 started: auth code (3 file(s))"
  },
  {
   "t": 2810,
   "stream": "err",
   "text": "[ocra] security-1 started: auth code (3 file(s))"
  },
  {
   "t": 2810,
   "stream": "err",
   "text": "[ocra] performance-1 started: auth code (3 file(s))"
  },
  {
   "t": 2810,
   "stream": "err",
   "text": "[ocra] correctness-2 started: docs (1 file(s))"
  },
  {
   "t": 2811,
   "stream": "err",
   "text": "[ocra] correctness-1 reviewing with google/gemini-3.5-flash"
  },
  {
   "t": 2812,
   "stream": "err",
   "text": "[ocra] security-1 reviewing with google/gemini-3.5-flash"
  },
  {
   "t": 2812,
   "stream": "err",
   "text": "[ocra] performance-1 reviewing with google/gemini-3.5-flash"
  },
  {
   "t": 2812,
   "stream": "err",
   "text": "[ocra] correctness-2 reviewing with google/gemini-3.5-flash"
  },
  {
   "t": 24229,
   "stream": "err",
   "text": "[ocra] correctness-2 google/gemini-3.5-flash: 5 step(s), 4 tool call(s) (read_file 2, read_diff 1, task_done 1), 18342 in / 611 out / 402 reasoning tokens, $0.0214"
  },
  {
   "t": 24230,
   "stream": "err",
   "text": "[ocra] correctness-2 completed in 21.4s · 0 finding(s)"
  },
  {
   "t": 51534,
   "stream": "err",
   "text": "[ocra] performance-1 google/gemini-3.5-flash: 10 step(s), 9 tool call(s) (read_file 4, code_search 3, read_diff 1, task_done 1), 61208 in / 1540 out / 1170 reasoning tokens, $0.0981"
  },
  {
   "t": 51534,
   "stream": "err",
   "text": "[ocra] performance-1 completed in 48.7s · 0 finding(s)"
  },
  {
   "t": 66019,
   "stream": "err",
   "text": "[ocra] security-1 google/gemini-3.5-flash: 13 step(s), 12 tool call(s) (read_file 5, code_search 3, report_finding 2, read_diff 1, task_done 1), 98410 in / 2804 out / 2210 reasoning tokens, $0.1627"
  },
  {
   "t": 66034,
   "stream": "err",
   "text": "[ocra] security-1 completed in 63.2s · 2 finding(s)"
  },
  {
   "t": 74720,
   "stream": "err",
   "text": "[ocra] correctness-1 google/gemini-3.5-flash: 16 step(s), 14 tool call(s) (read_file 7, code_search 3, report_finding 2, read_diff 1, task_done 1), 121766 in / 3312 out / 2958 reasoning tokens, $0.2045"
  },
  {
   "t": 74728,
   "stream": "err",
   "text": "[ocra] correctness-1 completed in 71.9s · 2 finding(s)"
  },
  {
   "t": 80836,
   "stream": "err",
   "text": "[ocra] Verified 3 finding(s), dropped 1 that the code disproves"
  },
  {
   "t": 88146,
   "stream": "err",
   "text": "[ocra] Verdict: significant concerns (merged 1, dropped 0, recalibrated 0)"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Review: Changes from main to HEAD"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Risk tier: full · 4 reviewed · 0 failed · 1 excluded"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Verdict: significant concerns"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "  The change adds session expiry and logout, but isExpired() mixes seconds and milliseconds, so every session is treated as expired and users are logged out right after signing in. Fix the unit mismatch before merging."
  },
  {
   "t": 88147,
   "stream": "out",
   "text": ""
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "src/auth/session.ts"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "  critical   L42       Every session is treated as expired [verified] #b7d6c863"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "    isExpired() compares expiresAt, stored in seconds, with Date.now() in milliseconds, so it is always true: loadSession() deletes every session and users are logged out right after signing in."
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "    Suggestion: return session.expiresAt * 1000 < Date.now();"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": ""
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "1 finding(s) (1 critical, 0 warning, 0 suggestion) · tokens: 315936 in (209152 cached), 9021 out, 8489 reasoning · $0.5134"
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Verification dropped 1 finding(s) the code disproves (see the JSON report)."
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "1 finding(s) matched the repository's memory and were not reported."
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Judge merged 1 duplicate group(s) and dropped 0 finding(s) (see the JSON report)."
  },
  {
   "t": 88147,
   "stream": "out",
   "text": "Session: .ocra/sessions/20260928T231859Z-67d225"
  }
 ]
};
