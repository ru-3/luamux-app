import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { CodeBlock } from "@/components/dashboard/code-block";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "API Docs — Luamux" },
      { name: "description", content: "REST API reference for the Luamux obfuscation and licensing platform." },
      { property: "og:title", content: "Luamux API Docs" },
      { property: "og:description", content: "Integrate Luamux with your CLI, bot or CI pipeline." },
    ],
  }),
  component: DocsPage,
});

const curl = `curl -X POST https://api.luamux.app/v1/obfuscate \\
  -H "Authorization: Bearer lmx_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "script": "print(\\"hello\\")",
    "options": {
      "string_encryption": true,
      "control_flow": true,
      "variable_mangling": true,
      "anti_tamper": true,
      "watermark_id": "buyer-license-123"
    },
    "publish": false
  }'`;

const node = `import { readFileSync } from "node:fs";

const res = await fetch("https://api.luamux.app/v1/obfuscate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + process.env.LUAMUX_API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    script: readFileSync("main.lua", "utf8"),
    options: { string_encryption: true, control_flow: true, variable_mangling: true, anti_tamper: true },
    publish: true,
  }),
});

const data = await res.json();
console.log(data.published_url);`;

const response = `{
  "success": true,
  "job_id": "job_9F2A81",
  "obfuscated_script": "-- Protected by Luamux ...",
  "published_url": "https://luamux.app/s/A9F2K3P7",
  "raw_endpoint": "https://luamux.app/api/public/raw/A9F2K3P7",
  "original_size_bytes": 4210,
  "output_size_bytes": 15870,
  "processing_time_ms": 340
}`;

function DocsPage() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-4xl px-4 pb-24">
        <h1 className="font-display text-4xl font-semibold md:text-5xl">API Docs</h1>
        <p className="mt-3 text-muted-foreground">
          The Luamux REST API lets you obfuscate and publish scripts from your own tooling — a
          Discord bot, a CLI, or your CI pipeline.
        </p>

        <div className="mt-10 space-y-8">
          <section>
            <h2 className="font-display text-xl font-semibold">Authentication</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Every request must include a Bearer token from the <b>API Keys</b> tab in your
              dashboard.
            </p>
            <CodeBlock code={`Authorization: Bearer lmx_live_...`} language="http" />
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">POST /v1/obfuscate</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Submit raw Lua/Luau source and receive a protected build.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">curl</div>
                <CodeBlock code={curl} language="bash" />
              </div>
              <div>
                <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Node.js</div>
                <CodeBlock code={node} language="ts" />
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Response</div>
              <CodeBlock code={response} language="json" />
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold">Rate limits</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rate limits vary by plan. When you exceed a quota, the API returns HTTP 429 with a
              standard JSON error body.
            </p>
            <CodeBlock code={`{ "success": false, "error": "rate_limit_exceeded" }`} language="json" />
          </section>
        </div>
      </section>
    </SiteShell>
  );
}
