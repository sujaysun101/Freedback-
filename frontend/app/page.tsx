'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [exampleFeedback, setExampleFeedback] = useState("make it pop");
  const [exampleTasks, setExampleTasks] = useState([
    "Increase contrast ratio between background and foreground elements by at least 40%.",
    "Apply a vibrant color accent to primary call-to-action buttons.",
    "Add subtle shadow or depth effects to key visual elements.",
    "Review and enhance typographic hierarchy with bolder weights or larger sizes for headlines."
  ]);

  const examples = [
    {
      input: "make it pop",
      tasks: [
        "Increase contrast ratio between background and foreground elements by at least 40%.",
        "Apply a vibrant color accent to primary call-to-action buttons.",
        "Add subtle shadow or depth effects to key visual elements.",
        "Review and enhance typographic hierarchy with bolder weights or larger sizes for headlines."
      ]
    },
    {
      input: "needs more pizzazz",
      tasks: [
        "Introduce animated micro-interactions for hover states on interactive elements.",
        "Evaluate and apply a more energetic color palette with complementary accent colors.",
        "Increase visual rhythm through varied spacing and sizing of design elements.",
        "Consider adding decorative elements or patterns that align with the brand personality."
      ]
    },
    {
      input: "make the logo bigger and add pizzazz",
      tasks: [
        "Increase logo size by 15% on the hero section.",
        "Evaluate 3 new high-contrast color palettes for the CTA buttons.",
        "Replace the default sans-serif headline font with a more dynamic display font."
      ]
    }
  ];

  const selectExample = (example: typeof examples[0]) => {
    setExampleFeedback(example.input);
    setExampleTasks(example.tasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">FeedbackFix</div>
        <div className="space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Log In
          </Link>
          <Link
            href="/register"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Transform Vague Feedback into
          <br />
          <span className="text-primary-600">Actionable Design Tasks</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Clients say "make it pop" and "needs more pizzazz" while you're left guessing. 
          FeedbackFix translates messy client feedback into specific, actionable design tasks.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition shadow-lg"
          >
            Start Free Trial
          </Link>
          <Link
            href="#demo"
            className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 transition"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          See It In Action
        </h2>
        
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Before */}
            <div className="bg-red-50 p-8 border-r border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Vague Client Feedback</h3>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-red-200 min-h-[200px]">
                <p className="text-lg text-gray-700 font-medium">{exampleFeedback}</p>
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h3 className="font-semibold text-gray-900">Actionable Design Tasks</h3>
              </div>
              <div className="bg-white p-6 rounded-lg border-2 border-green-200 min-h-[200px]">
                <ul className="space-y-3">
                  {exampleTasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">?</span>
                      <span className="text-sm text-gray-700">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Selector */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => selectExample(example)}
              className={`px-4 py-2 rounded-lg border transition ${
                exampleFeedback === example.input
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              "{example.input}"
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered Translation</h3>
            <p className="text-gray-600">
              Our advanced AI understands design context and breaks down vague feedback into specific, measurable tasks.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">?</div>
            <h3 className="text-xl font-semibold mb-2">Save Time & Money</h3>
            <p className="text-gray-600">
              Reduce revision cycles and scope creep by getting clear direction from the start.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-semibold mb-2">Track Everything</h3>
            <p className="text-gray-600">
              Organize feedback by project and track tasks with completion status.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20 bg-gray-50 rounded-3xl my-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 mb-8">One plan. Unlimited projects.</p>
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="text-5xl font-bold text-gray-900 mb-2">$79<span className="text-xl text-gray-600">/month</span></div>
            <p className="text-gray-600 mb-6">For solo designers</p>
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-500">?</span>
                <span>Unlimited projects</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">?</span>
                <span>Unlimited translations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">?</span>
                <span>Task tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">?</span>
                <span>Project organization</span>
              </li>
            </ul>
            <Link
              href="/register"
              className="block w-full bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>? 2024 FeedbackFix. Transforming client feedback, one task at a time.</p>
        </div>
      </footer>
    </div>
  );
}
