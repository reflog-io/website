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

  const getPointerPosition = (e) => {
    if ("touches" in e && e.touches.length > 0) {
      return {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      };
    }

    if ("changedTouches" in e && e.changedTouches.length > 0) {
      return {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY,
      };
    }

    return {
      x: e.pageX,
      y: e.pageY,
    };
  };

  const handlePointerMove = useCallback((e) => {
    if (bashWindowRef.current && dragStartRef.current.mouseX !== undefined) {
      if ("touches" in e) {
        e.preventDefault();
      }

      const { x, y } = getPointerPosition(e);
      e.preventDefault();

      const deltaX = x - dragStartRef.current.mouseX;
      const deltaY = y - dragStartRef.current.mouseY;

      setPosition({
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY,
      });
    }
  }, []);

  const handlePointerEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handlePointerStart = (e) => {
    const { x, y } = getPointerPosition(e);
    e.preventDefault();
    e.stopPropagation();

    if (bashWindowRef.current) {
      dragStartRef.current = {
        initialX: position.x,
        initialY: position.y,
        mouseX: x,
        mouseY: y,
      };
      setIsDragging(true);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const touchMoveOptions = { passive: false };
      document.addEventListener("mousemove", handlePointerMove);
      document.addEventListener("mouseup", handlePointerEnd);
      document.addEventListener(
        "touchmove",
        handlePointerMove,
        touchMoveOptions,
      );
      document.addEventListener("touchend", handlePointerEnd);

      return () => {
        document.body.style.overflow = previousOverflow;
        document.removeEventListener("mousemove", handlePointerMove);
        document.removeEventListener("mouseup", handlePointerEnd);
        document.removeEventListener(
          "touchmove",
          handlePointerMove,
          touchMoveOptions,
        );
        document.removeEventListener("touchend", handlePointerEnd);
      };
    }
  }, [isDragging, handlePointerMove, handlePointerEnd]);

  const handleStarActivate = (e) => {
    // Don't trigger if we're dragging
    if (isDragging) {
      return;
    }

    e.preventDefault();
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
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white tracking-tight">
              Reflog<span className="text-reflog-400">.</span>
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a
              href="https://github.com/reflog-io"
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
                  href="/docs"
                  className="block py-2 px-3 text-gray-400 hover:text-white md:p-0 transition-colors"
                >
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <section className="grid-bg relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-x-clip overflow-y-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-x-2 rounded-full border border-gray-700 bg-gray-800/50 px-3 py-1 text-sm font-medium text-gray-300 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-reflog-400 animate-pulse"></span>
            v1.0 Now Available
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white sm:text-7xl">
            Capture Events Once. <br />
            <span className="gradient-text">Query Anywhere.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-400">
            gRPC ingest, append-only durability, and automatic Parquet
            projections for full history (_events) and latest state (_current).
          </p>

          <div className="mt-10 flex justify-center gap-x-6">
            <a
              href="/docs/getting-started"
              className="rounded-md bg-reflog-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-reflog-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-reflog-400 transition-all"
            >
              Get Started
            </a>
            <a
              href="/docs/architecture"
              className="group text-sm font-semibold leading-6 text-white flex items-center gap-2"
            >
              Read Architecture{" "}
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
                onClick={handleStarActivate}
                onTouchStart={handleStarActivate}
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
                onMouseDown={handlePointerStart}
                onTouchStart={handlePointerStart}
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
          className="fixed bg-yellow-400/50 z-9999 expand-yellow-scale"
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
                Dual Projections
              </h3>
              <p className="text-gray-400">
                Get two query shapes from one ingest path: <code>_events</code>{" "}
                for immutable history and <code>_current</code> for latest
                entity state.
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
                Reflog writes standard Parquet outputs so your data stays
                portable across DuckDB, Spark, Polars, DataFusion, and
                warehouse/lakehouse tooling.
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
                Operational Safety
              </h3>
              <p className="text-gray-400">
                Segmented processing, checkpoints, and crash-recovery patterns
                keep ingestion simple while projections remain reliable and
                deterministic.
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
                Architecture At A Glance
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Reflog keeps the write path lightweight while producing
                analytics-ready outputs. Events flow through append-only
                segments and are projected in the background to query-friendly
                Parquet tables.
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
                  gRPC ingest accepts create/update/delete entity events
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
                  Events are durably written to append-only segments
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
                  Background projection builds <code>_events</code> and{" "}
                  <code>_current</code>
                </li>
              </ul>
            </div>

            <div className="mt-12 lg:mt-0 bg-gray-800 rounded-xl border border-gray-700 p-6 font-mono text-sm">
              <div className="text-gray-500 mb-2">// query examples</div>
              <div>
                <span className="text-blue-400">SELECT</span>{" "}
                <span className="text-white">*</span>{" "}
                <span className="text-blue-400">FROM</span>{" "}
                <span className="text-yellow-400">reflog._events</span>
                <br />
                <span className="text-blue-400">WHERE</span>{" "}
                <span className="text-green-400">entity_id</span> ={" "}
                <span className="text-green-400">&apos;user_123&apos;</span>
                <br />
                <span className="text-blue-400">ORDER BY</span>{" "}
                <span className="text-green-400">event_time</span>{" "}
                <span className="text-blue-400">DESC</span>;
                <br />
                <br />
                <span className="text-blue-400">SELECT</span>{" "}
                <span className="text-white">*</span>{" "}
                <span className="text-blue-400">FROM</span>{" "}
                <span className="text-yellow-400">reflog._current</span>
                <br />
                <span className="text-blue-400">WHERE</span>{" "}
                <span className="text-green-400">entity_id</span> ={" "}
                <span className="text-green-400">&apos;user_123&apos;</span>;
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
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
            <div className="min-w-0 p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
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
                Browser-Based Entity Explorer
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Use the Web UI to browse entity types, inspect records, and see
                full change history without building custom dashboards first.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-gray-500"># Web UI workflow</span>
                <br />
                Entities → users → user_123
                <br />
                History → ordered event timeline
              </div>
            </div>

            <div className="min-w-0 p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
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
              <h3 className="text-xl font-bold mb-3 wrap-break-word">
                ML Training/Serving Parity
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed wrap-break-word">
                Build feature pipelines from the same Parquet projections used
                in production analytics. Combine event history and latest state
                for reproducible training sets.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5 overflow-x-auto min-w-0">
                <span className="text-blue-400">import</span> polars{" "}
                <span className="text-blue-400">as</span> pl
                <br />
                events = <br />
                pl.read_parquet(
                <span className="text-yellow-400">
                  &quot;/rl/_events/*.parquet&quot;
                </span>
                )
                <br />
                current = pl.read_parquet(
                <span className="text-yellow-400">
                  &quot;/rl/_current/*.parquet&quot;
                </span>
                )
              </div>
            </div>

            <div className="min-w-0 p-8 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors">
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
                Deterministic Replay &amp; Backfill
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Rebuild projections from append-only history when logic evolves.
                Deterministic processing makes validation and backfills safer as
                schemas or downstream models change.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                <span className="text-gray-500">
                  // Reprocess closed segments
                </span>
                <br />
                ✓ checkpoint restored
                <br />✓ projections rebuilt
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
                Investigate incidents with both views: trace exact event history
                from <code>_events</code> and confirm current truth in{" "}
                <code>_current</code>. Query with your existing SQL tools.
              </p>
              <div className="bg-black/40 p-4 rounded-lg font-mono text-sm border border-white/5">
                duckdb -c{" "}
                <span className="text-yellow-400">
                  &quot;SELECT * FROM reflog._events WHERE
                  entity_id=&apos;user_123&apos;&quot;
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
            <a
              href="https://github.com/reflog-io"
              className="text-gray-400 hover:text-gray-300"
            >
              GitHub
            </a>
            <a href="/docs" className="text-gray-400 hover:text-gray-300">
              Docs
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
