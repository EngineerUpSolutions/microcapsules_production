"use client";

import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";

import { FlowShell } from "../components/layout/FlowShell";
import { Step1Courses, Course } from "../components/steps/Step1Courses";
import { Step2Topics } from "../components/steps/Step2Topics";
import { Step3Microcaps } from "../components/steps/Step3Microcaps";

import { generateTopics, generateMicrocapsules } from "@/lib/api";

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

  if (!uid || !name || !rawCourses || !sig)
    return <div>Missing parameters</div>;

  // Raw JSON as sent by Moodle
  const decodedCoursesStr = decodeURIComponent(rawCourses);

  let courses: any[] = [];
  try {
    courses = JSON.parse(decodedCoursesStr);
  } catch {
    return <div>Invalid courses data</div>;
  }

  // Signature validation
  const SECRET =
    process.env.MICROCAPS_SECRET ||
    "k8Z3pL9qT2vX6sR1yB4nW7cH5mD0fG8Q";

  const raw = `${uid}|${name}|${decodedCoursesStr}`;
  const expectedSig = CryptoJS.HmacSHA256(raw, SECRET).toString();

  if (expectedSig !== sig) return <div>INVALID ACCESS</div>;

  const initialUserData: UserData = { uid, name, courses };

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

  // Save session
  useEffect(() => {
    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, [userData]);

  // --------------------------- STEP LOGIC -----------------------------

  const handleContinueFromStep1 = async () => {
    if (!selectedCourseId) return;

    setIsContinuing(true);
    try {
      const course = userData.courses.find(c => c.id === selectedCourseId);

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
        500,
        600,
        5
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
    setStep(prev => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  const finishProcess = () => {
    window.close();
  };

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
