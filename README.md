# Client style cache ID reproduction

This repository reproduces the Next.js `blocking-prerender-random-client` error when a root-layout Client Component creates a per-render style cache ID. The pattern represents CSS-in-JS providers that need a stable cache object during the initial server render.

## Environment

- Next.js `16.5.0-canary.3`
- React `19.3.0`
- App Router with Cache Components and Partial Prefetching
- Turbopack development server

## Reproduce the error

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The route returns HTTP 200 and the response includes a `<meta name="x-style-cache">` element, but Next.js reports:

```text
Next.js encountered the unstable value Math.random() in a Client Component.
```

The error points to `createStyleCache()` in [`components/style-provider.tsx`](./components/style-provider.tsx). The provider uses a lazy state initializer so every mount gets one cache object:

```tsx
const [cache] = useState(() => createStyleCache())
```

The `use client` directive does not prevent the error because Next.js also prerenders Client Components on the server.

Running a production build reproduces the same validation failure during static generation:

```bash
pnpm build
```

```text
Error: Route "/": Next.js encountered the unstable value `Math.random()` in a Client Component.
Export encountered an error on /page: /, exiting the build.
```

## Expected diagnostic

The validation itself is expected. Uncached randomness cannot run during prerendering.

The diagnostic should recognize that the code already runs in a Client Component and explain the options for a value that must exist during the initial render. Moving this cache initialization into `useEffect` or an event handler does not preserve the provider's behavior.

## Why the suggested fixes are difficult here

Moving cache creation into `useEffect` changes the provider's semantics because descendants need the cache during the initial render. Lazy initialization with `useRef` also runs on the render path when the ref is empty, so it does not defer `Math.random()` beyond the server prerender.

The current workaround is to defer the provider behind a request-time boundary, using either `use(io())` in the Client Component or a Server Component that awaits `connection()`, with a parent `<Suspense>` boundary. Because this provider wraps the entire application, that boundary also excludes the whole application subtree from the prerendered shell.

This reproduction intentionally keeps the failing implementation so the diagnostic can be inspected.
