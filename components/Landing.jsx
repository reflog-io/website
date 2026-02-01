"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";

export default function Landing() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const [isExpanding, setIsExpanding] = useState(false);
  const [starPosition, setStarPosition] = useState({ x: 0, y: 0 });
  const bashWindowRef = useRef(null);
  const containerRef = useRef(null);
  const starRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isExpanding) {
      const timer = setTimeout(() => {
        router.push("/demo");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isExpanding]);

  const handleMouseMove = useCallback((e) => {
    if (bashWindowRef.current && dragStartRef.current.mouseX !== undefined) {
      e.preventDefault();

      const deltaX = e.pageX - dragStartRef.current.mouseX;
      const deltaY = e.pageY - dragStartRef.current.mouseY;

      setPosition({
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY,
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (bashWindowRef.current) {
      dragStartRef.current = {
        initialX: position.x,
        initialY: position.y,
        mouseX: e.pageX,
        mouseY: e.pageY,
      };
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleStarClick = (e) => {
    // Don't trigger if we're dragging
    if (isDragging) {
      return;
    }

    e.stopPropagation();

    // Get the star's position relative to viewport
    if (starRef.current && containerRef.current) {
      const starRect = starRef.current.getBoundingClientRect();

      // Calculate star center position relative to viewport
      const starCenterX = starRect.left + starRect.width / 2;
      const starCenterY = starRect.top + starRect.height / 2;

      setStarPosition({
        x: starCenterX,
        y: starCenterY,
      });
      setIsExpanding(true);
    }
  };

  return (
    <>
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between p-4">
          <a
            href="#"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white tracking-tight">
              Reflog<span className="text-reflog-400">.</span>
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a
              href="https://github.com/your-username/reflog"
              className="text-white bg-reflog-600 hover:bg-reflog-700 focus:ring-4 focus:outline-none focus:ring-reflog-900 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all"
            >
              Get Started
            </a>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-800 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <a
                  href="#features"
                  className="block py-2 px-3 text-gray-400 hover:text-white md:p-0 transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="block py-2 px-3 text-gray-400 hover:text-white md:p-0 transition-colors"
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="#docs"
                  className="block py-2 px-3 text-gray-400 hover:text-white md:p-0 transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="grid-bg relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-x-2 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-sm font-medium text-gray-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-reflog-400 animate-pulse"></span>
            v1.0 Now Available
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
            The &quot;SQLite&quot; of <br />
            <span className="gradient-text">Event Sourcing</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-400">
            Single binary. High-performance gRPC ingest. Zero-config &quot;Time
            Travel&quot; queries. Reflog brings the power of the Data Lakehouse
            to your application backend without the complexity.
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-reflog-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-reflog-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reflog-400 transition-all"
            >
              Download Binary
            </a>
            <a
              href="#"
              className="group text-sm font-semibold leading-6 text-white flex items-center gap-2"
            >
              View on GitHub{" "}
              <span
                aria-hidden="true"
                className="group-hover:translate-x-1 transition-transform"
              >
                →
              </span>
            </a>
          </div>

          <div
            ref={containerRef}
            className="mt-16 relative mx-auto max-w-4xl sm:mt-24 min-h-[400px]"
          >
            {/* Mario-style star behind the bash window - stays in original center position */}
            <div
              ref={starRef}
              className="absolute z-0 w-20 h-20 star-pulse"
              style={{
                left: "calc(50% - 40px)",
                top: "calc(50% - 40px)",
                pointerEvents: "none",
              }}
              aria-label="Easter egg star"
            >
              <svg
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full cursor-pointer transition-transform hover:scale-110 active:scale-95"
                onClick={handleStarClick}
                style={{ pointerEvents: "auto" }}
              >
                {/* Black outline */}
                <polygon
                  points="50,5 63,35 97,35 70,55 80,88 50,68 20,88 30,55 3,35 37,35"
                  fill="#000000"
                  stroke="#000000"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
                {/* Gold fill */}
                <polygon
                  points="50,5 63,35 97,35 70,55 80,88 50,68 20,88 30,55 3,35 37,35"
                  fill="#FFD700"
                />
                {/* Eyes */}
                <ellipse cx="42" cy="52" rx="3.5" ry="10" fill="#000000" />
                <ellipse cx="58" cy="52" rx="3.5" ry="10" fill="#000000" />
              </svg>
            </div>

            <div
              ref={bashWindowRef}
              className="relative mx-auto max-w-4xl rounded-xl bg-gray-900 shadow-2xl ring-1 ring-white/10 overflow-hidden text-left z-10 pointer-events-auto"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: isDragging ? "grabbing" : "grab",
                transition: isDragging ? "none" : "transform 0.1s ease-out",
              }}
            >
              <div
                className="bash-window-drag-handle flex items-center gap-2 border-b border-gray-800 bg-gray-800/50 px-4 py-2 cursor-grab active:cursor-grabbing select-none relative z-20"
                onMouseDown={handleMouseDown}
              >
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  bash — reflog-cli
                </span>
              </div>
              <div className="p-6 cursor-text font-mono text-sm leading-relaxed overflow-x-auto">
                <div className="flex">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-gray-300">
                    {`reflog ingest --entity user_123 --op UPDATE --payload '{"status": "active"}'`}
                  </span>
                </div>
                <div className="text-gray-500 mb-4">
                  ✓ Event committed to segment 4 (0.4ms)
                </div>

                <div className="flex">
                  <span className="text-green-400 mr-2">➜</span>
                  <span className="text-gray-300">
                    duckdb -c &quot;SELECT * FROM reflog.users{" "}
                    <span className="text-reflog-400">
                      AS OF TIMESTAMP &apos;2024-01-01&apos;
                    </span>
                    &quot;
                  </span>
                </div>
                <pre className="text-blue-300 mt-2">
                  {`┌──────────┬──────────┬───────────┐
│ id       │ status   │ plan      │
├──────────┼──────────┼───────────┤
│ user_123 │ pending  │ free_tier │
└──────────┴──────────┴───────────┘`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[800px] h-[800px] bg-reflog-500/20 rounded-full blur-[120px] opacity-30"></div>
      </section>

      {/* Yellow expansion overlay - scales from star position */}
      {isExpanding && (
        <div
          className="fixed bg-yellow-400 z-[9999] expand-yellow-scale"
          style={{
            left: `${starPosition.x}px`,
            top: `${starPosition.y}px`,
            transformOrigin: "center center",
          }}
        />
      )}

      <section id="features" className="py-24 bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-reflog-400">
              Why Reflog?
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Architecture for Ops. Analytics for Free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-reflog-500/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-reflog-500/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-reflog-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Single Binary Deployment
              </h3>
              <p className="text-gray-400">
                Forget generic &quot;Big Data&quot; clusters. Reflog is a single
                Rust binary. No JVM, no ZooKeeper, no headaches. Just run{" "}
                <code>./reflog-server</code> and start ingesting.
              </p>
            </div>

            <div className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-reflog-500/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-rust-500/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-rust-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Native Time Travel
              </h3>
              <p className="text-gray-400">
                Reflog keeps a perfect audit trail. Query your entity state as
                it existed 5 minutes ago, or 5 years ago.
              </p>
            </div>

            <div className="col-span-1 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-reflog-500/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Open Storage Standards
              </h3>
              <p className="text-gray-400">
                Data is materialized into standard Parquet files. Query it
                instantly with DuckDB, Polars, or Amazon Athena.
              </p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-8 hover:border-reflog-500/50 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Cloud-Native Resilience
              </h3>
              <p className="text-gray-400">
                Designed for Active/Passive failover using shared block storage
                (EBS/Azure Disk). Includes strict file locking and automatic
                crash recovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Drop-in Integration
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Reflog speaks gRPC. Define your entity schema in Protobuf, point
                your application at the Reflog node, and stop worrying about
                state consistency.
              </p>

              <ul className="space-y-4 text-gray-300">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-reflog-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Rust-based for stable, low-latency writes
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-reflog-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Optional Redis Stream integration for buffering
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 text-reflog-400 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Automatic &quot;Delta + Base&quot; compaction
                </li>
              </ul>
            </div>

            <div className="mt-12 lg:mt-0 bg-gray-800 rounded-xl border border-gray-700 p-6 font-mono text-sm">
              <div className="text-gray-500 mb-2">// reflog-config.toml</div>
              <div>
                <span className="text-purple-400">server</span>{" "}
                <span className="text-white">{"{"}</span>
                <div className="pl-4">
                  <span className="text-blue-400">listen_addr</span> ={" "}
                  <span className="text-green-400">
                    &quot;0.0.0.0:50051&quot;
                  </span>
                  <br />
                  <span className="text-blue-400">storage_path</span> ={" "}
                  <span className="text-green-400">&quot;/data&quot;</span>
                </div>
                <span className="text-white">{"}"}</span>
                <br />
                <span className="text-purple-400">compaction</span>{" "}
                <span className="text-white">{"{"}</span>
                <div className="pl-4">
                  <span className="text-blue-400">strategy</span> ={" "}
                  <span className="text-green-400">
                    &quot;delta_plus_base&quot;
                  </span>
                  <br />
                  <span className="text-blue-400">interval_seconds</span> ={" "}
                  <span className="text-yellow-400">300</span>
                </div>
                <span className="text-white">{"}"}</span>
                <br />
                <span className="text-purple-400">failover</span>{" "}
                <span className="text-white">{"{"}</span>
                <div className="pl-4">
                  <span className="text-blue-400">mode</span> ={" "}
                  <span className="text-green-400">
                    &quot;active_passive&quot;
                  </span>
                  <br />
                  <span className="text-blue-400">lock_file</span> ={" "}
                  <span className="text-green-400">
                    &quot;_meta/instance.lock&quot;
                  </span>
                </div>
                <span className="text-white">{"}"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Beyond the Event Store.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Reflog isn&apos;t just about moving bytes. It&apos;s about
              unlocking the value trapped in your application&apos;s history.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                One-Click Customer Audits
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Stop digging through logs to answer &quot;why did this
                user&apos;s balance change?&quot;. Generate human-readable
                timelines of every state change for any entity directly from
                your Parquet projections.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-gray-500">
                  # Query state for support ticket #882
                </span>
                <br />
                <span className="text-green-400">reflog</span> audit --entity
                user_123 --format pdf
              </div>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                ML Training/Serving Parity
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Train models on the exact same data structures they will see in
                production. Use the Python client to stream historical Parquet
                segments directly into Polars or DataFrames for training.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-blue-400">import</span> polars{" "}
                <span className="text-blue-400">as</span> pl
                <br />
                df = pl.read_parquet(
                <span className="text-yellow-400">
                  &quot;data/segments/*.parquet&quot;
                </span>
                )
              </div>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">
                High-Fidelity Shadow Deploys
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Test major architectural changes by replaying millions of
                records against a &quot;shadow&quot; service. Compare the
                resulting Parquet projections with your production baseline to
                catch regressions before they ship.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-gray-500">
                  // Validate new projection logic
                </span>
                <br />
                ✓ 125,000,000 events replayed
                <br />✓ 0.00% diff vs production
              </div>
            </div>

            <div className="p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Time-Travel Debugging</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                When a bug is reported, don&apos;t just look at the current
                state. Use the Reflog UI to see the exact state of the world
                when the error occurred. Replay the specific event sequence to
                reproduce the bug locally.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-green-400">reflog</span> fork --timestamp{" "}
                <span className="text-yellow-400">
                  &quot;2024-05-12T14:30Z&quot;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2026 Reflog. Open Source Software.
            </p>
          </div>
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-gray-400 hover:text-gray-300">
              GitHub
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Docs
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-300">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
