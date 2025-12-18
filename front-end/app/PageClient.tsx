"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { FlowShell } from "../components/layout/FlowShell";
import { Step1Courses, Course } from "../components/steps/Step1Courses";
import { Step2Topics } from "../components/steps/Step2Topics";
import { Step3Microcaps } from "../components/steps/Step3Microcaps";
import {
  generateTopics,
  generateMicrocapsules,
  fetchSubscriptions,
  updateSubscription,
} from "@/lib/api";

type UserData = {
  uid: string;
  name: string;
  courses: Course[];
};

// Removes (1234) from fullname
function getCourseNameWithoutCode(fullname: string): string {
  const match = fullname.match(/\((\d+)\)\s*$/);
  return match ? fullname.replace(/\s*\(\d+\)\s*$/, "").trim() : fullname;
}

export default function PageClient() {
  const searchParams = useSearchParams();

  if (!searchParams) return <div>Missing parameters</div>;

  const uid = searchParams.get("uid");
  const name = searchParams.get("name");
  const rawCourses = searchParams.get("courses");
  const sig = searchParams.get("sig");

  if (!uid || !name || !rawCourses || !sig) {
    return <div>Missing parameters</div>;
  }

  // From here on, we know uid is not null, so we create a safe string
  const uidStr = uid as string;

  // Raw JSON as sent by Moodle
  const decodedCoursesStr = decodeURIComponent(rawCourses);

  let courses: any[] = [];
  try {
    courses = JSON.parse(decodedCoursesStr);
  } catch {
    return <div>Invalid courses data</div>;
  }

  // Signature validation
  useEffect(() => {
  async function validate() {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        name,
        courses: decodedCoursesStr,
        sig,
      }),
    });

    if (!res.ok) {
      throw new Error("Invalid access");
    }
  }

  validate().catch(() => {
    window.location.href = "/unauthorized";
  });
}, [uid, name, decodedCoursesStr, sig]);



  const initialUserData: UserData = { uid: uidStr, name, courses };

  // Flow state
  const [userData] = useState(initialUserData);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [microcapsules, setMicrocapsules] = useState<string[]>([]);
  const [isContinuing, setIsContinuing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  // Save session
  useEffect(() => {
    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, [userData]);

  // Load explicit subscriptions for this user (backend).
  // IMPORTANT: if no record exists for a course, UI will treat it as "subscribed".
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const subs = await fetchSubscriptions(uidStr);
        if (cancelled) return;

        const map: Record<string, boolean> = {};
        for (const s of subs) {
          map[String(s.courseId)] = s.subscribed;
        }
        setSubscriptions(map);
      } catch {
        // If it fails, we just keep an empty map.
        // The UI will assume "subscribed" by default (no DB record).
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [uidStr]);

  // --------------------------- STEP LOGIC -----------------------------

  const handleContinueFromStep1 = async () => {
    if (!selectedCourseId) return;
    // Extra safety: don’t allow continuing if the course is not subscribed
    const isSubscribedForSelected =
      subscriptions[selectedCourseId] ?? true;
    if (!isSubscribedForSelected) {
      setErrorMessage("Debes estar suscrito al curso para continuar.");
      return;
    }
    setIsContinuing(true);
    try {
      const course = userData.courses.find((c) => c.id === selectedCourseId);

      if (!course) return;

      const cleanName = getCourseNameWithoutCode(course.fullname);

      const topicsResponse = await generateTopics(cleanName, 5);

      setSelectedCourse(course);
      setTopics(topicsResponse.temas);
      setSelectedTopic(null);
      setMicrocapsules([]);

      setStep(2);
    } catch {
      setErrorMessage("Error generando temas. Inténtalo de nuevo.");
    } finally {
      setIsContinuing(false);
    }
  };

  const handleContinueFromStep2 = async () => {
    if (!selectedTopic) return;

    setIsContinuing(true);

    try {
      const data = await generateMicrocapsules(
        selectedTopic.trim(),
        900,
        1000,
        7
      );

      setMicrocapsules(data.microcapsulas || []);
      setStep(3);
    } catch {
      setErrorMessage("Error generando microcápsulas. Inténtalo de nuevo.");
    } finally {
      setIsContinuing(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const handleToggleSubscription = async (courseId: string) => {
    const current = subscriptions[courseId];
    // If no record exists, default is "subscribed"
    const effectiveSubscribed = current ?? true;
    const next = !effectiveSubscribed;

    // Optimistic update in UI
    setSubscriptions((prev) => ({
      ...prev,
      [courseId]: next,
    }));

    try {
      await updateSubscription(uidStr, courseId, next);
    } catch {
      // Rollback on error
      setSubscriptions((prev) => ({
        ...prev,
        [courseId]: effectiveSubscribed,
      }));
      setErrorMessage("No se pudo actualizar la suscripción. Inténtalo de nuevo.");
    }
  };

  const finishProcess = () => {
    window.close();
  };

  // ------------------ NEW: CAN CONTINUE LOGIC ----------------------

  // Is the selected course subscribed? (default true if not in the map)
  const selectedCourseIsSubscribed =
    selectedCourseId == null
      ? false
      : (subscriptions[selectedCourseId] ?? true);

  const canContinue =
    step === 1
      ? selectedCourseId !== null && selectedCourseIsSubscribed
      : step === 2
      ? selectedTopic !== null
      : true;


  // --------------------------- RENDER -----------------------------

  return (
    <FlowShell
      currentStep={step}
      userName={userData.name}
      showBack={step > 1}
      onBack={handleBack}
      onContinue={
        step === 1
          ? handleContinueFromStep1
          : step === 2
          ? handleContinueFromStep2
          : undefined
      }
      onFinish={step === 3 ? finishProcess : undefined}
      canContinue={canContinue}
    >
      {/* MODALS FOR ERRORS */}
      {errorMessage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              maxWidth: "400px",
              width: "100%",
              color: "#111827",
            }}
          >
            <h2 style={{ marginBottom: "0.5rem", fontWeight: 600 }}>
              Servicio no disponible
            </h2>
            <p style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage(null)}
              style={{
                marginLeft: "auto",
                display: "block",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* STEP CONTENT */}
      {step === 1 && (
        <Step1Courses
          courses={userData.courses}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onContinue={handleContinueFromStep1}
          isContinuing={isContinuing}
          subscriptions={subscriptions}
          onToggleSubscription={handleToggleSubscription}
        />
      )}

      {step === 2 && (
        <Step2Topics
          selectedCourse={selectedCourse}
          topics={topics}
          selectedTopic={selectedTopic}
          onSelectTopic={setSelectedTopic}
          onContinue={handleContinueFromStep2}
          isContinuing={isContinuing}
        />
      )}

      {step === 3 && (
        <Step3Microcaps
          selectedCourse={selectedCourse}
          selectedTopic={selectedTopic}
          microcapsules={microcapsules}
        />
      )}
    </FlowShell>
  );
}
