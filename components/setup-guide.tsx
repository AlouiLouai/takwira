type SetupGuideProps = {
  error?: string
  message?: string
}

export function SetupGuide({ error, message }: SetupGuideProps) {
  return (
    <main className="flex min-h-screen min-h-svh flex-col items-center justify-center bg-pitch-green text-white p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-3xl font-bold mb-2">Database Setup Required</h1>
          <p className="text-white/70">{message}</p>
        </div>

        <div className="bg-[#02120c]/95 rounded-3xl border border-white/10 p-8 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span>🔧</span>
            Quick Setup Steps
          </h2>

          <ol className="space-y-4 text-white/90">
            <li className="flex gap-3">
              <span className="font-bold text-amber-400 min-w-[24px]">1.</span>
              <div>
                <strong>Open Supabase Dashboard</strong>
                <p className="text-sm text-white/70 mt-1">
                  Go to{' '}
                  <a
                    href="https://app.supabase.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    app.supabase.com
                  </a>{' '}
                  and select your project
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-amber-400 min-w-[24px]">2.</span>
              <div>
                <strong>Open SQL Editor</strong>
                <p className="text-sm text-white/70 mt-1">
                  Click <code className="bg-white/10 px-2 py-0.5 rounded">SQL Editor</code> in the left sidebar
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-amber-400 min-w-[24px]">3.</span>
              <div>
                <strong>Run the Schema</strong>
                <p className="text-sm text-white/70 mt-1">
                  Copy the SQL from{' '}
                  <code className="bg-white/10 px-2 py-0.5 rounded">supabase/schema.sql</code>{' '}
                  and run it
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="font-bold text-amber-400 min-w-[24px]">4.</span>
              <div>
                <strong>Refresh This Page</strong>
                <p className="text-sm text-white/70 mt-1">
                  Once the SQL runs successfully, refresh this page
                </p>
              </div>
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-2xl px-4 py-3 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-stone-900 transition"
            >
              ↻ Refresh Page
            </button>
          </div>

          <div className="mt-4">
            <details className="text-sm text-white/70">
              <summary className="cursor-pointer hover:text-white">
                Need help? Click here for the full guide
              </summary>
              <div className="mt-3 space-y-2 pl-4 border-l-2 border-amber-500/30">
                <p>📖 Read: <code>SUPABASE_SETUP.md</code></p>
                <p>⚡ Quick start: <code>QUICK_START.md</code></p>
                <p>
                  🔗 Visit:{' '}
                  <a
                    href="https://supabase.com/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    Supabase Docs
                  </a>
                </p>
              </div>
            </details>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-300">
                <strong>Error Code:</strong> {error}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-white/50">
          <p>
            Having issues? Check the{' '}
            <a
              href="https://github.com/supabase/supabase/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Supabase Community
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
