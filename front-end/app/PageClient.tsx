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

type AuthParams = {
  uid: string;
  name: string;
  courses: string; // viene URL-encoded
  sig: string;
};

// Removes (1234) from fullname
function getCourseNameWithoutCode(fullname: string): string {
  const match = fullname.match(/\((\d+)\)\s*$/);
  return match ? fullname.replace(/\s*\(\d+\)\s*$/, "").trim() : fullname;
}

export default function PageClient() {
  const searchParams = useSearchParams();
  const hasQueryAuth =
    !!searchParams?.get("uid") &&
    !!searchParams?.get("name") &&
    !!searchParams?.get("courses") &&
    !!searchParams?.get("sig");


  // Auth cache por pestaña (para poder limpiar la URL sin perder auth)
  const [auth, setAuth] = useState<AuthParams | null>(null);
  const [validated, setValidated] = useState(false);

  // --------------------------- FLOW STATE (hooks siempre en el mismo orden) -----------------------------
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [topics, setTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const [microcapsules, setMicrocapsules] = useState<string[]>([]);
  const [isContinuing, setIsContinuing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [subscriptions, setSubscriptions] = useState<Record<string, boolean>>({});

  // 1) Bootstrap auth: sessionStorage -> si no hay, leer query -> guardar -> limpiar URL
  useEffect(() => {
    if (auth) return;
    if (typeof window === "undefined") return;

    // a) restaurar de sessionStorage (si el usuario refresca /microcapsulas)
    const stored = sessionStorage.getItem("micro_auth");
    if (stored) {
      try {
        setAuth(JSON.parse(stored) as AuthParams);
        setValidated(false);
        return;
      } catch {
        sessionStorage.removeItem("micro_auth");
      }
    }

    // b) capturar de query la primera vez que viene desde Moodle
    const uid = searchParams?.get("uid");
    const name = searchParams?.get("name");
    const courses = searchParams?.get("courses");
    const sig = searchParams?.get("sig");

    if (uid && name && courses && sig) {
      const a: AuthParams = { uid, name, courses, sig };
      sessionStorage.setItem("micro_auth", JSON.stringify(a));
      setAuth(a);
      setValidated(false);

      // Limpia la URL visible: queda /microcapsulas sin query
      if (window.location.search) {
        // Más seguro que hardcodear "/microcapsulas" si algún día cambia basePath/ruta
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, [auth, searchParams]);

  // Derivados seguros
  const uidStr = auth?.uid ?? "";
  const userName = auth?.name ?? "";
  const sig = auth?.sig ?? "";

  const decodedCoursesStr = auth ? decodeURIComponent(auth.courses) : "";
  let courses: Course[] = [];
  let coursesOk = false;

  if (auth) {
    try {
      courses = JSON.parse(decodedCoursesStr);
      coursesOk = Array.isArray(courses);
    } catch {
      coursesOk = false;
    }
  }

  const userData: UserData = { uid: uidStr, name: userName, courses };

  // 2) Validar firma SOLO cuando ya tengo auth completo
  useEffect(() => {
    if (!auth) return;
    if (!coursesOk) return;
    if (validated) return;

    async function validate() {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: uidStr,
          name: userName,
          courses: decodedCoursesStr, // string raw JSON
          sig,
        }),
      });

      if (!res.ok) throw new Error("Invalid access");
      setValidated(true);
    }

    validate().catch(() => {
      // limpieza opcional por seguridad si la firma falla
      try {
        sessionStorage.removeItem("micro_auth");
      } catch {}
      window.location.href = "/unauthorized";
    });
  }, [auth, coursesOk, uidStr, userName, decodedCoursesStr, sig, validated]);

  // 3) Guardar sesión SOLO cuando ya está validado
  useEffect(() => {
    if (!auth) return;
    if (!coursesOk) return;
    if (!validated) return;

    localStorage.setItem("micro_user", JSON.stringify(userData));
  }, [auth, coursesOk, validated, uidStr, userName, decodedCoursesStr]);

  // 4) Subscriptions: SOLO cuando ya está validado
  useEffect(() => {
    if (!uidStr) return;
    if (!validated) return;

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
        // ignore; default subscribed
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uidStr, validated]);

  // --------------------------- STEP LOGIC -----------------------------

  const handleContinueFromStep1 = async () => {
    if (!selectedCourseId) return;

    const isSubscribedForSelected = subscriptions[selectedCourseId] ?? true;
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
      const data = await generateMicrocapsules(selectedTopic.trim(), 900, 1000, 7);
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
    const effectiveSubscribed = current ?? true;
    const next = !effectiveSubscribed;

    setSubscriptions((prev) => ({ ...prev, [courseId]: next }));

    try {
      await updateSubscription(uidStr, courseId, next);
    } catch {
      setSubscriptions((prev) => ({ ...prev, [courseId]: effectiveSubscribed }));
      setErrorMessage("No se pudo actualizar la suscripción. Inténtalo de nuevo.");
    }
  };

  const finishProcess = () => {
    window.close();
  };

  const selectedCourseIsSubscribed =
    selectedCourseId == null ? false : (subscriptions[selectedCourseId] ?? true);

  const canContinue =
    step === 1
      ? selectedCourseId !== null && selectedCourseIsSubscribed
      : step === 2
      ? selectedTopic !== null
      : true;

  // --------------------------- RENDER -----------------------------
  // Render seguro (sin romper hooks) y BLOQUEADO hasta validar
  if (!auth) {
  // Si viene con parámetros desde Moodle, puede estar en el primer render antes de que el useEffect guarde en sessionStorage
  if (hasQueryAuth) return <div>Cargando...</div>;

  // Si no hay parámetros y no hay sessionStorage => URL copiada / acceso directo
  return <div>Acceso inválido. Ingrese desde Zajuna.</div>;
}

  if (!coursesOk) return <div>Invalid courses data</div>;
  if (!validated) return <div>Cargando...</div>;

  return (
    <FlowShell
      currentStep={step}
      userName={userData.name}
      showBack={step > 1}
      onBack={handleBack}
      onContinue={
        step === 1 ? handleContinueFromStep1 : step === 2 ? handleContinueFromStep2 : undefined
      }
      onFinish={step === 3 ? finishProcess : undefined}
      canContinue={canContinue}
    >
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
