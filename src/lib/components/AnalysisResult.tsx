"use client";

import { ClaimAnalysisType, SourceType } from "@/types/analysis-types";

function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case "likely_true":
      return "text-green-600 dark:text-green-400";
    case "likely_untrue":
      return "text-red-600 dark:text-red-400";
    case "uncertain":
      return "text-yellow-600 dark:text-yellow-400";
    default:
      return "text-zinc-600 dark:text-zinc-400";
  }
}

function SourceCard({ source }: { source: SourceType }) {
  return (
    <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">{source.title}</h4>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{source.snippet}</p>
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        View Source →
      </a>
      {source.credibilityScore !== undefined && (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Credibility Score: {(source.credibilityScore * 100).toFixed(0)}%
        </p>
      )}
    </div>
  );
}

export function AnalysisResult({ result }: { result: ClaimAnalysisType }) {
  return (
    <div className="space-y-6">
      {/* Header Card - Claim & Verdict */}
      <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Analysis Results
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Claim
            </h3>
            <p className="mt-2 text-lg text-zinc-900 dark:text-zinc-50">
              {result.claim}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
              Verdict
            </h3>
            <p className={`mt-2 text-lg font-semibold ${getVerdictColor(result.verdict)}`}>
              {result.verdict === "likely_true"
                ? "Likely True"
                : result.verdict === "likely_untrue"
                  ? "Likely Untrue"
                  : "Uncertain"}
              {" "}
              <span className="text-sm">
                ({(result.confidenceScore * 100).toFixed(0)}% confident)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary & Reasoning */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Summary
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">{result.summary}</p>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Reasoning
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">{result.reasoning}</p>
        </div>
      </div>

      {/* Questions and Answers */}
      {result.questions && result.questions.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Questions & Answers
          </h3>
          <div className="space-y-4">
            {result.questions.map((question, index) => (
              <div
                key={index}
                className="border-l-4 border-zinc-300 pl-4 dark:border-zinc-700"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  Q: {question}
                </p>
                {result.answersToQuestions && result.answersToQuestions[index] && (
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    A: {result.answersToQuestions[index]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supporting Sources */}
      {result.supportingSources && result.supportingSources.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-green-700 dark:text-green-400">
            Supporting Sources ({result.supportingSources.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {result.supportingSources.map((source, index) => (
              <SourceCard key={`supporting-${index}`} source={source} />
            ))}
          </div>
        </div>
      )}

      {/* Contradicting Sources */}
      {result.contradictingSources && result.contradictingSources.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-red-700 dark:text-red-400">
            Contradicting Sources ({result.contradictingSources.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {result.contradictingSources.map((source, index) => (
              <SourceCard key={`contradicting-${index}`} source={source} />
            ))}
          </div>
        </div>
      )}

      {/* All Sources */}
      {result.allSources && result.allSources.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            All Sources ({result.allSources.length})
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {result.allSources.map((source, index) => (
              <SourceCard key={`all-${index}`} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}