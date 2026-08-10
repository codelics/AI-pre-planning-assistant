"use client";

import { useEffect, useState } from "react";

import AnalysisProgress from "../components/AnalysisProgress";

interface LoadingStateProps {
  isComplete: boolean;
}

export default function LoadingState({
  isComplete,
}: LoadingStateProps) {
  const [progress, setProgress] = useState(0);

  //-----------------------------------
  // Climb toward (but never reach) 90%
  // while the real request is in flight.
  // Slows down as it approaches the cap
  // so it doesn't visibly stall.
  //-----------------------------------

  useEffect(() => {

    if (isComplete) {
      return;
    }

    const timer = setInterval(() => {
      setProgress((current) => {

        if (current >= 90) {
          return current;
        }

        const remaining = 90 - current;
        const step = Math.max(0.5, remaining * 0.05);

        return Math.min(90, current + step);

      });
    }, 200);

    return () => clearInterval(timer);

  }, [isComplete]);

  //-----------------------------------
  // Snap to 100% only once the real
  // result has actually arrived.
  //-----------------------------------

  useEffect(() => {

    if (isComplete) {
      setProgress(100);
    }

  }, [isComplete]);

  return (
    <div className="py-10">
      <AnalysisProgress progress={Math.round(progress)} />
    </div>
  );
}