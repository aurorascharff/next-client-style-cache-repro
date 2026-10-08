export default function Page() {
  return (
    <main>
      <h1>Client style cache reproduction</h1>
      <p>
        The root-layout Client Component creates a cache ID during its server
        prerender. The route still responds, but Next.js reports{' '}
        <code>blocking-prerender-random-client</code>.
      </p>
      <p>
        Inspect the terminal or development overlay for the diagnostic. The
        generated cache ID is available in the{' '}
        <code>meta[name=&quot;x-style-cache&quot;]</code> element.
      </p>
    </main>
  )
}
