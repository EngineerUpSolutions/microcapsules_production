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
  //proceeding with step 2
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [microcapsules, setMicrocapsules] = useState<string[]>([]);

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

      // 3) Call backend through frontend API route and log the topics
      const topicsResponse = await generateTopics(cleanName, 5);
      console.log("Topics from API:", topicsResponse);





      // 4) Save the selected course and topics for Step 2
      setSelectedCourse(course);
      setTopics(topicsResponse.temas);
      setSelectedTopic(null);        // reset previous topic selection
      setMicrocapsules([]);          // clear microcapsules from previous runs

      // 5) Move to step 2
      setStep(2);





    } catch (err) {
      console.error("Error continuing from step 1", err);
    } finally {
      setIsContinuing(false);
    }
  };

  const handleContinueFromStep2 = async () => {
    if (!selectedTopic) return; // if no topic is selected, do nothing

    setIsContinuing(true);
    try {
      // For now, fixed values similar to your curl test
      const data = await generateMicrocapsules(
        selectedTopic.trim(),
        500, // min_caracteres
        600, // max_caracteres
        5    // cantidad_microcapsulas
      );

      console.log("Microcapsules from API:", data);

      // data = { tema, microcapsulas: string[] }
      setMicrocapsules(data.microcapsulas || []);
      setStep(3); // go to step 3
    } catch (err) {
      console.error("Error continuing from step 2", err);
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
