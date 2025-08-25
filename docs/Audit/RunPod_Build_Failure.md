2025-08-25T10:47:45.727Z [INFO] #20 1.967 https://nextjs.org/telemetry
2025-08-25T10:47:45.729Z [INFO] #20 1.967
2025-08-25T10:47:45.731Z [INFO] #20 2.010    ▲ Next.js 15.4.7
2025-08-25T10:47:45.733Z [INFO] #20 2.010
2025-08-25T10:47:45.735Z [INFO] #20 2.057    Creating an optimized production build ...
2025-08-25T10:48:01.310Z [INFO] #20 17.79  ✓ Compiled successfully in 12.0s
2025-08-25T10:48:01.467Z [INFO] #20 17.80    Linting and checking validity of types ...
2025-08-25T10:48:07.011Z [INFO] #20 23.49 Failed to compile.
2025-08-25T10:48:07.013Z [INFO] #20 23.49
2025-08-25T10:48:07.222Z [INFO] #20 23.50 ./lib/runpod-v7-service.ts:167:29
2025-08-25T10:48:07.224Z [INFO] #20 23.50 Type error: Property 'getOptimalTemperature' does not exist on type 'RunPodV7Service'.
2025-08-25T10:48:07.227Z [INFO] #20 23.50
2025-08-25T10:48:07.229Z [INFO] #20 23.50 [0m [90m 165 |[39m           prompt[33m:[39m enhancedPrompt[33m,[39m
2025-08-25T10:48:07.231Z [INFO] #20 23.50  [90m 166 |[39m           max_tokens[33m:[39m [36mthis[39m[33m.[39mconfig[33m.[39mmaxTokens [33m||[39m [35m1000[39m[33m,[39m
2025-08-25T10:48:07.232Z [INFO] #20 23.50 [31m[1m>[22m[39m[90m 167 |[39m           temperature[33m:[39m [36mthis[39m[33m.[39mgetOptimalTemperature(ordinal[33m,[39m {})[33m,[39m
2025-08-25T10:48:07.234Z [INFO] #20 23.50  [90m     |[39m                             [31m[1m^[22m[39m
2025-08-25T10:48:07.236Z [INFO] #20 23.50  [90m 168 |[39m           top_p[33m:[39m [36mthis[39m[33m.[39mgetOptimalTopP(ordinal[33m,[39m {})[33m,[39m
2025-08-25T10:48:07.237Z [INFO] #20 23.50  [90m 169 |[39m           [90m// V7.0 consciousness parameters[39m
2025-08-25T10:48:07.239Z [INFO] #20 23.50  [90m 170 |[39m           presence_penalty[33m:[39m [33mMath[39m[33m.[39mmin([35m2.0[39m[33m,[39m amplification [33m*[39m [35m0.15[39m)[33m,[39m[0m
2025-08-25T10:48:07.241Z [INFO] #20 23.56 Next.js build worker exited with code: 1 and signal: null
2025-08-25T10:48:07.325Z [INFO] #20 ERROR: process "/bin/sh -c npm run build" did not complete successfully: exit code: 1
2025-08-25T10:48:07.337Z [INFO] ------
2025-08-25T10:48:07.340Z [INFO] > [builder 5/5] RUN npm run build:
2025-08-25T10:48:07.342Z [INFO] 23.50 Type error: Property 'getOptimalTemperature' does not exist on type 'RunPodV7Service'.
2025-08-25T10:48:07.343Z [INFO] 23.50
2025-08-25T10:48:07.345Z [INFO] 23.50 [0m [90m 165 |[39m           prompt[33m:[39m enhancedPrompt[33m,[39m
2025-08-25T10:48:07.346Z [INFO] 23.50  [90m 166 |[39m           max_tokens[33m:[39m [36mthis[39m[33m.[39mconfig[33m.[39mmaxTokens [33m||[39m [35m1000[39m[33m,[39m
2025-08-25T10:48:07.348Z [INFO] 23.50 [31m[1m>[22m[39m[90m 167 |[39m           temperature[33m:[39m [36mthis[39m[33m.[39mgetOptimalTemperature(ordinal[33m,[39m {})[33m,[39m
2025-08-25T10:48:07.350Z [INFO] 23.50  [90m     |[39m                             [31m[1m^[22m[39m
2025-08-25T10:48:07.351Z [INFO] 23.50  [90m 168 |[39m           top_p[33m:[39m [36mthis[39m[33m.[39mgetOptimalTopP(ordinal[33m,[39m {})[33m,[39m
2025-08-25T10:48:07.353Z [INFO] 23.50  [90m 169 |[39m           [90m// V7.0 consciousness parameters[39m
2025-08-25T10:48:07.354Z [INFO] 23.50  [90m 170 |[39m           presence_penalty[33m:[39m [33mMath[39m[33m.[39mmin([35m2.0[39m[33m,[39m amplification [33m*[39m [35m0.15[39m)[33m,[39m[0m
2025-08-25T10:48:07.356Z [INFO] 23.56 Next.js build worker exited with code: 1 and signal: null
2025-08-25T10:48:07.358Z [INFO] ------
2025-08-25T10:48:07.360Z [INFO] WARNING: current commit information was not captured by the build: git was not found in the system: exec: "git": executable file not found in $PATH
2025-08-25T10:48:07.362Z [INFO] Dockerfile:40
2025-08-25T10:48:07.364Z [INFO] --------------------
2025-08-25T10:48:07.365Z [INFO] 38 |
2025-08-25T10:48:07.367Z [INFO] 39 |     # Build application
2025-08-25T10:48:07.368Z [INFO] 40 | >>> RUN npm run build
2025-08-25T10:48:07.369Z [INFO] 41 |
