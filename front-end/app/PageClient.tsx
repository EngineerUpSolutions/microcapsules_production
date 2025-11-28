"use client";

import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { useEffect, useState } from "react";
import { FlowShell } from "../components/layout/FlowShell";
import { Step1Courses, Course } from "../components/steps/Step1Courses";
import { Step2Topics } from "../components/steps/Step2Topics";
import { generateTopics } from "../lib/api";



type UserData = {
  uid: string;
  name: string;
  courses: Course[];
};
//get the name course cleaned
function getCourseNameWithoutCode(fullname: string): string {
  const match = fullname.match(/\((\d+)\)\s*$/);
  if (match) {
    return fullname.replace(/\s*\(\d+\)\s*$/, "").trim();
  }
  // fallback: if there is no "(number)" at the end, return the original name
  return fullname;
}
export default function PageClient() {
  // const searchParams = useSearchParams();

  // const uid = searchParams.get("uid");
  // const name = searchParams.get("name");
  // const rawCourses = searchParams.get("courses");
  // const sig = searchParams.get("sig");
  const searchParams = useSearchParams();

  // Guard in case searchParams is null (TypeScript strict mode)
  if (!searchParams) {
    return <div>Missing parameters</div>;
  }

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

  //proceeding with step 2
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Store session (same as before)
  useEffect(() => {
    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, [userData]);

  //handling handleContinueFromStep1
  const handleContinueFromStep1 = async () => {
    if (!selectedCourseId) return;
    setIsContinuing(true);

    try {
      // 1) Find full course object
      const course = userData.courses.find(
        (c) => c.id === selectedCourseId
      ) as Course | undefined;

      if (!course) {
        console.error("Course not found for id:", selectedCourseId);
        return;
      }

      // 2) Get the clean name (without the numeric code at the end)
      const cleanName = getCourseNameWithoutCode(course.fullname);

      // 3) Call backend to generate 5 topics
      const topics = await generateTopics(cleanName, 5);

      // 4) Log what we got from the API (for now)
      console.log("Topics from API:", topics);

      // 5) Save selected course for Step 2
      setSelectedCourse(course);

      // 6) Go to Step 2
      setStep(2);
    } catch (err) {
      console.error("Error continuing from step 1", err);
    } finally {
      setIsContinuing(false);
    }
  };
  //handling handleContinueFromStep1


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
         <Step2Topics selectedCourse={selectedCourse} />
      )}

      {step === 3 && (
        <div className="text-slate-800">
          Step 3 (Microcápsulas) – placeholder for now.
        </div>
      )}
    </FlowShell>
  );
}
