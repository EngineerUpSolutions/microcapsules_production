"use client";

import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { FlowShell } from "../components/layout/FlowShell";
import { Step1Courses, Course } from "../components/steps/Step1Courses";

type UserData = {
  uid: string;
  name: string;
  courses: Course[];
};

export default function PageClient() {
  const searchParams = useSearchParams();

  const uid = searchParams.get("uid");
  const name = searchParams.get("name");
  const rawCourses = searchParams.get("courses");
  const sig = searchParams.get("sig");

  if (!uid || !name || !rawCourses || !sig) {
    return <div>Missing parameters</div>;
  }

  // 👉 1) Use the EXACT JSON string from Moodle
  const decodedCoursesStr = decodeURIComponent(rawCourses);

  let courses: any[] = [];
  try {
    // Only to work with it as array; the signature uses decodedCoursesStr
    courses = JSON.parse(decodedCoursesStr);
  } catch (err) {
    console.error("Error parsing courses", err);
    return <div>Invalid courses</div>;
  }

  // SECRET MUST MATCH MOODLE (restored EXACTLY as your working version)
  const SECRET =
    process.env.MICROCAPS_SECRET || "k8Z3pL9qT2vX6sR1yB4nW7cH5mD0fG8Q";

  // 👉 2) Build raw EXACTLY like PHP:
  // $raw = $userid . '|' . $fullname . '|' . json_encode($filteredcourses);
  const raw = `${uid}|${name}|${decodedCoursesStr}`;

  // crypto-js HMAC SHA256
  const expectedSig = CryptoJS.HmacSHA256(raw, SECRET).toString();
  const isValid = expectedSig === sig;

  if (!isValid) {
    console.error("Invalid signature", { raw, expectedSig, sig });
    return <div>INVALID ACCESS</div>;
  }

  // If valid → authentication success
  const initialUserData: UserData = { uid, name, courses };

  // -------------------- flow state (new) --------------------
  const [userData] = useState<UserData>(initialUserData);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isContinuing, setIsContinuing] = useState(false);

  // Store session (same as before)
  useEffect(() => {
    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, [userData]);

  const handleContinueFromStep1 = async () => {
    if (!selectedCourseId) return;
    setIsContinuing(true);

    try {
      // Later we'll call generateTopics() here.
      setStep(2);
    } catch (err) {
      console.error("Error continuing from step 1", err);
    } finally {
      setIsContinuing(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev));
  };

  // -------------------- render --------------------
  return (
    <FlowShell
      currentStep={step}
      userName={userData.name}
      showBack={step > 1}
      onBack={handleBack}
    >
      {step === 1 && (
        <Step1Courses
          courses={userData.courses as Course[]}
          selectedCourseId={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
          onContinue={handleContinueFromStep1}
          isContinuing={isContinuing}
        />
      )}

      {step === 2 && (
        <div className="text-slate-800">
          Step 2 (Temas) – placeholder for now.
        </div>
      )}

      {step === 3 && (
        <div className="text-slate-800">
          Step 3 (Microcápsulas) – placeholder for now.
        </div>
      )}
    </FlowShell>
  );
}
