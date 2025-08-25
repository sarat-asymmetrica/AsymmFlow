[13:25:50.024] Running build in Washington, D.C., USA (East) – iad1
[13:25:50.024] Build machine configuration: 4 cores, 8 GB
[13:25:50.036] Cloning github.com/sarat-asymmetrica/AsymmFlow (Branch: main, Commit: 6f84dcb)
[13:25:50.142] Previous build caches not available
[13:25:51.251] Cloning completed: 1.215s
[13:25:51.544] Running "vercel build"
[13:25:51.942] Vercel CLI 46.0.2
[13:25:52.256] Installing dependencies...
[13:25:57.223] npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
[13:25:57.435] npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
[13:25:57.861] npm warn deprecated domexception@4.0.0: Use your platform's native DOMException instead
[13:25:58.424] npm warn deprecated abab@2.0.6: Use your platform's native atob() and btoa() methods instead
[13:26:23.497] 
[13:26:23.497] added 1140 packages in 31s
[13:26:23.497] 
[13:26:23.497] 217 packages are looking for funding
[13:26:23.498]   run `npm fund` for details
[13:26:23.719] Detected Next.js version: 15.4.7
[13:26:23.728] Running "npm run build"
[13:26:23.946] 
[13:26:23.947] > ph-trading-erp-crm@0.1.0 build
[13:26:23.947] > next build
[13:26:23.947] 
[13:26:24.570] Attention: Next.js now collects completely anonymous telemetry regarding usage.
[13:26:24.571] This information is used to shape Next.js' roadmap and prioritize features.
[13:26:24.571] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
[13:26:24.571] https://nextjs.org/telemetry
[13:26:24.571] 
[13:26:24.634]    ▲ Next.js 15.4.7
[13:26:24.634] 
[13:26:24.708]    Creating an optimized production build ...
[13:26:49.142]  ✓ Compiled successfully in 21.0s
[13:26:49.146]    Linting and checking validity of types ...
[13:26:58.734]    Collecting page data ...
[13:26:59.222] Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the `prisma generate` command during the build process.
[13:26:59.222] 
[13:26:59.222] Learn how: https://pris.ly/d/vercel-build
[13:26:59.223] Error [PrismaClientInitializationError]: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the `prisma generate` command during the build process.
[13:26:59.224] 
[13:26:59.224] Learn how: https://pris.ly/d/vercel-build
[13:26:59.224]     at <unknown> (.next/server/app/api/auth/[...nextauth]/route.js:137:69)
[13:26:59.224]     at new b (.next/server/app/api/auth/[...nextauth]/route.js:137:82)
[13:26:59.224]     at 11688 (.next/server/app/api/auth/[...nextauth]/route.js:9:7405)
[13:26:59.224]     at c (.next/server/webpack-runtime.js:1:128)
[13:26:59.224]     at <unknown> (.next/server/app/api/auth/[...nextauth]/route.js:160:65257)
[13:26:59.224]     at c.X (.next/server/webpack-runtime.js:1:1206)
[13:26:59.224]     at <unknown> (.next/server/app/api/auth/[...nextauth]/route.js:160:65244)
[13:26:59.224]     at Object.<anonymous> (.next/server/app/api/auth/[...nextauth]/route.js:160:65289) {
[13:26:59.224]   clientVersion: '6.14.0',
[13:26:59.224]   errorCode: undefined
[13:26:59.224] }
[13:26:59.231] 
[13:26:59.232] > Build error occurred
[13:26:59.232] [Error: Failed to collect page data for /api/auth/[...nextauth]] {
[13:26:59.232]   type: 'Error'
[13:26:59.232] }
[13:26:59.258] Error: Command "npm run build" exited with 1