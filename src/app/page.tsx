"use client";

import { useState } from "react";
import { ClaimAnalysisType } from "@/types/analysis-types";
import { AnalysisResult } from "@/lib/components/AnalysisResult";


export default function Page() {
  const [claim, setClaim] = useState("");
  const [questions, setQuestions] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClaimAnalysisType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!claim.trim()) {
      setError("Please enter a claim");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          claim: claim.trim(),
          questions: questions
            .map((q) => q.trim())
            .filter((q) => q.length > 0),
        }),
      });

      if (!response.ok) {
        throw new Error("Something unexpected happened. Please try again later.");
      }

      const { data } = await response.json() as { success: boolean; data: ClaimAnalysisType };

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (questions.length < 3) {
      setQuestions([...questions, ""]);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Claim Analyzer
          </h1>
          <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
            Analyze a claim and see if news sources back it <br/> <br/>
            <span className="text-sm font-light"><span className="font-extrabold">Note:</span> This is a tool intended to make researching a claim or topic simpler. <br/> However, AI inferences should not be taken at face value, therefore, ensure you are doing your own research before coming up with a conclusion on a topic.</span>
          </p>
        </div>

        {/* Form Section */}
        <div className="mb-8 rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Claim Input */}
            <div>
              <label
                htmlFor="claim"
                className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Claim <span className="text-red-500">*</span>
              </label>
              <textarea
                id="claim"
                value={claim}
                onChange={(e) => setClaim(e.target.value)}
                placeholder="Enter the claim you want to analyze..."
                className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-500 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                rows={4}
              />
            </div>

            {/* Questions Input */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                Questions <span className="text-zinc-400">(Optional)</span>
              </label>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                Add up to 3 questions alongside your claim
              </p>
              <div className="mt-3 space-y-3">
                {questions.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => handleQuestionChange(index, e.target.value)}
                      placeholder={`Question ${index + 1}`}
                      className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-0 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
                    />
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {questions.length < 3 && (
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="mt-3 rounded-md border border-zinc-300 bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  + Add Question
                </button>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-zinc-900 px-4 py-3 font-semibold text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:disabled:bg-zinc-700"
            >
              {loading ? "Analyzing..." : "Analyze Claim"}
            </button>
          </form>
        </div>

        
        {/* Results Section */}
        {result && <AnalysisResult result={result} /> /*(
          <div className="rounded-lg border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Analysis Results
            </h2>
            <div className="space-y-4">
              {Object.entries(result).map(([key, value]) => (
                <div key={key} className="border-l-4 border-zinc-900 pl-4 dark:border-zinc-50">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                  <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )*/}
      </main>
    </div>
  );
}
