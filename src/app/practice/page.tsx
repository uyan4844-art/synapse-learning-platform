"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Youtube, FileText, Type, BookOpen, Sparkles, Loader2, Check,
  ArrowRight, HelpCircle, RefreshCw, Trophy, AlertCircle, PlayCircle,
  Upload, Code2, Globe2, Layers, Cpu, Compass, Plus, Trash2, Edit3,
  Bookmark, FolderHeart, Calendar, CheckCircle2, Clock, School, Award
} from "lucide-react";
import { useTranslation } from "@/i18n/context";
import {
  GRANULAR_CURRICULUM_DATA,
  LANGUAGE_TARGETS,
  CODING_LANGUAGES,
  LEARNING_TRACKS,
  GranularCountryCurriculum
} from "@/config/learning-goals";
import { generateNovaQuizAction, analyzeQuizPerformanceAction, type IngestionSourceType } from "@/lib/nova/actions";
import type { GeneratedQuestion, NovaDiagnosticResult } from "@/lib/nova/gemini-client";
import { CustomStudySet, DEFAULT_CUSTOM_SETS, StudyMaterialType } from "@/types/study-sets";

export default function PracticePage() {
  const { t, locale } = useTranslation();

  // 4 Core Categorical Domains: academic, language, coding_tech, custom_hub
  const [activeCategory, setActiveCategory] = React.useState<"academic" | "language" | "coding_tech" | "custom_hub">("academic");

  // -------------------------------------------------------------
  // CLEAN & GRANULAR ACADEMIC STATE
  // -------------------------------------------------------------
  const [selectedCountryCode, setSelectedCountryCode] = React.useState<"TR" | "US" | "UK" | "DE" | "GLOBAL_IB">("TR");
  const currentCurriculum = GRANULAR_CURRICULUM_DATA[selectedCountryCode] || GRANULAR_CURRICULUM_DATA.TR;

  // Single Granular Grade (Örn: "11. Sınıf", "12. Sınıf", "9th Grade")
  const [selectedGrade, setSelectedGrade] = React.useState<string>(currentCurriculum.grades[10] || currentCurriculum.grades[0]);
  
  // 3 Clear Subject Categories: "Genel Dersler" | "Seçmeli Dersler" | "Bölüm / Meslek / Uzmanlık"
  const [selectedCategoryKey, setSelectedCategoryKey] = React.useState<keyof typeof currentCurriculum.categories>("Genel Dersler");
  
  // Specific Subject
  const [selectedSubject, setSelectedSubject] = React.useState<string>(
    currentCurriculum.categories["Genel Dersler"]?.[0] || "Matematik"
  );
  
  // Optional Unit / Subtopic
  const [specificUnitTopic, setSpecificUnitTopic] = React.useState<string>("");

  // Sync state when country changes
  React.useEffect(() => {
    const cur = GRANULAR_CURRICULUM_DATA[selectedCountryCode];
    if (cur) {
      const defGrade = cur.grades.find(g => g.includes("11") || g.includes("Junior") || g.includes("Year 12")) || cur.grades[0];
      setSelectedGrade(defGrade);
      setSelectedCategoryKey("Genel Dersler");
      setSelectedSubject(cur.categories["Genel Dersler"]?.[0] || "");
    }
  }, [selectedCountryCode]);

  // Sync subject when subject category changes
  React.useEffect(() => {
    const subjects = currentCurriculum.categories[selectedCategoryKey];
    if (subjects && subjects.length > 0) {
      setSelectedSubject(subjects[0]);
    }
  }, [selectedCategoryKey, currentCurriculum]);

  // -------------------------------------------------------------
  // CUSTOM STUDY HUB: SAVED STUDY SETS STATE & PERSISTENCE
  // -------------------------------------------------------------
  const [studySets, setStudySets] = React.useState<CustomStudySet[]>([]);
  const [selectedSetId, setSelectedSetId] = React.useState<string | null>(null);
  const [isCreatingNewSet, setIsCreatingNewSet] = React.useState<boolean>(false);

  // New Study Set Form State
  const [newSetTitle, setNewSetTitle] = React.useState("");
  const [newSetType, setNewSetType] = React.useState<StudyMaterialType>("youtube");
  const [newSetContent, setNewSetContent] = React.useState("");
  const [newSetFileName, setNewSetFileName] = React.useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = React.useState<string | null>(null);

  // Load Saved Study Sets from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_study_sets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudySets(parsed);
          setSelectedSetId(parsed[0].id);
          return;
        }
      }
      setStudySets(DEFAULT_CUSTOM_SETS);
      setSelectedSetId(DEFAULT_CUSTOM_SETS[0].id);
      localStorage.setItem("custom_study_sets", JSON.stringify(DEFAULT_CUSTOM_SETS));
    } catch {
      setStudySets(DEFAULT_CUSTOM_SETS);
      setSelectedSetId(DEFAULT_CUSTOM_SETS[0].id);
    }
  }, []);

  // Save new Study Set handler
  const handleSaveNewStudySet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetTitle.trim() || !newSetContent.trim()) return;

    const newSet: CustomStudySet = {
      id: `set_${Date.now()}`,
      title: newSetTitle.trim(),
      type: newSetType,
      content: newSetContent.trim(),
      fileName: newSetFileName || undefined,
      createdAt: new Date().toISOString(),
    };

    const updated = [newSet, ...studySets];
    setStudySets(updated);
    setSelectedSetId(newSet.id);
    localStorage.setItem("custom_study_sets", JSON.stringify(updated));

    setNewSetTitle("");
    setNewSetContent("");
    setNewSetFileName(null);
    setIsCreatingNewSet(false);
    setSaveSuccessMsg(locale === "en" ? "Study set saved to your library!" : "Çalışma seti kütüphanenize başarıyla kaydedildi!");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Delete Study Set handler
  const handleDeleteStudySet = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = studySets.filter(s => s.id !== id);
    setStudySets(updated);
    localStorage.setItem("custom_study_sets", JSON.stringify(updated));
    if (selectedSetId === id) {
      setSelectedSetId(updated[0]?.id || null);
    }
  };

  // Handle PDF upload in new set form
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewSetFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setNewSetContent(text || "Ders notu metin içeriği");
        if (!newSetTitle) {
          setNewSetTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.readAsText(file);
    }
  };

  // Language Target & CEFR (Independent of country)
  const [selectedLanguageTarget, setSelectedLanguageTarget] = React.useState("english");
  const [selectedCefrLevel, setSelectedCefrLevel] = React.useState("en_b2");
  const currentLangObj = LANGUAGE_TARGETS.find(l => l.id === selectedLanguageTarget) || LANGUAGE_TARGETS[0];

  // Coding Language & Level (Independent of country)
  const [selectedCodingLang, setSelectedCodingLang] = React.useState("python");
  const [selectedCodingLevel, setSelectedCodingLevel] = React.useState("py_mid");
  const currentCodingObj = CODING_LANGUAGES.find(c => c.id === selectedCodingLang) || CODING_LANGUAGES[0];

  // General settings
  const [difficulty, setDifficulty] = React.useState("Orta");
  const [questionCount, setQuestionCount] = React.useState("5");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processStep, setProcessStep] = React.useState(0);
  const [generationError, setGenerationError] = React.useState<string | null>(null);

  // Active Interactive Quiz Session State
  const [quizQuestions, setQuizQuestions] = React.useState<GeneratedQuestion[]>([]);
  const [quizActive, setQuizActive] = React.useState(false);
  const [currentQIndex, setCurrentQIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [showHint, setShowHint] = React.useState(false);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [diagnostic, setDiagnostic] = React.useState<NovaDiagnosticResult | null>(null);

  const processingSteps = locale === "en" ? [
    "Validating grade and curriculum parameters...",
    "Scanning official curriculum objectives...",
    "NOVA Intelligence: Synthesizing questions aligned with national standards...",
    "Generating multiple-choice questions and pedagogical hints...",
    "Validating question quality and format standards...",
    "Your quiz is ready to solve!",
  ] : [
    "Ders ve sınıf parametreleri doğrulanıyor...",
    "Resmi müfredat kazanımları taranıyor...",
    "NOVA Zekası: Ülke eğitim standartlarına göre soru sentezi yürütülüyor...",
    "Seçtiğiniz adette çoktan seçmeli soru ve pedagojik ipucu üretiliyor...",
    "Soru kalitesi ve format standartları doğrulanıyor...",
    "Testiniz çözülmeye hazır!",
  ];

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProcessStep(0);
    setGenerationError(null);

    const countNum = parseInt(questionCount) || 5;

    let gradeLabel = selectedGrade;
    let titleToPass = "";
    let inputContent = "";
    let sourceType: IngestionSourceType = "topic";

    if (activeCategory === "academic") {
      titleToPass = specificUnitTopic ? `${selectedSubject}: ${specificUnitTopic}` : selectedSubject;
      inputContent = specificUnitTopic 
        ? `${selectedSubject} - ${specificUnitTopic}`
        : `${selectedSubject} Dersi Kapsamlı Seansı`;
      sourceType = "topic";
    } else if (activeCategory === "language") {
      const lvl = currentLangObj.levels.find(l => l.id === selectedCefrLevel);
      gradeLabel = `${currentLangObj.name} (${lvl?.code || "B2"} - ${lvl?.label || ""})`;
      titleToPass = `${currentLangObj.name} ${lvl?.code} Pratik Seansı`;
      inputContent = titleToPass;
      sourceType = "topic";
    } else if (activeCategory === "coding_tech") {
      const cLvl = currentCodingObj.levels.find(l => l.id === selectedCodingLevel);
      gradeLabel = `${currentCodingObj.name} (${cLvl?.label || "Orta Seviye"})`;
      titleToPass = `${currentCodingObj.name} Kodlama & Algoritma Testi`;
      inputContent = titleToPass;
      sourceType = "topic";
    } else if (activeCategory === "custom_hub") {
      const activeSet = studySets.find(s => s.id === selectedSetId);
      if (!activeSet) {
        setIsProcessing(false);
        setGenerationError(locale === "en" ? "Please select a study set or create a new one." : "Lütfen bir çalışma seti seçin veya '+ Yeni Set Ekle' ile yeni bir materyal kaydedin.");
        return;
      }
      gradeLabel = `Kişisel Çalışma Seti: ${activeSet.title}`;
      titleToPass = activeSet.title;
      inputContent = activeSet.content;
      sourceType = activeSet.type === "youtube" ? "youtube" : (activeSet.type === "pdf" ? "pdf" : "text");
    }

    const interval = setInterval(() => {
      setProcessStep((prev) => {
        if (prev >= processingSteps.length - 2) {
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    try {
      const res = await generateNovaQuizAction({
        sourceType,
        urlOrTopic: inputContent,
        topicTitle: titleToPass,
        pdfRawText: sourceType === "pdf" ? inputContent : undefined,
        countryName: activeCategory === "academic" ? currentCurriculum.countryName : undefined,
        gradeLevel: gradeLabel,
        trackName: undefined,
        subjectCategory: activeCategory === "academic" ? selectedCategoryKey : undefined,
        subjectName: activeCategory === "academic" ? selectedSubject : undefined,
        specificUnitOrTopic: activeCategory === "academic" ? specificUnitTopic : undefined,
        difficulty,
        languageLevel: activeCategory === "language" ? selectedCefrLevel : undefined,
        codingLanguage: activeCategory === "coding_tech" ? selectedCodingLang : undefined,
        questionCount: countNum,
        contentLanguage: locale === "en" ? "English" : "Türkçe",
      });

      clearInterval(interval);

      if (res.success && res.data?.questions && res.data.questions.length > 0) {
        setProcessStep(processingSteps.length - 1);
        setQuizQuestions(res.data.questions);
        setTimeout(() => {
          setIsProcessing(false);
          setQuizActive(true);
          setCurrentQIndex(0);
          setSelectedAnswers({});
          setQuizFinished(false);
          setDiagnostic(null);
        }, 500);
      } else {
        setIsProcessing(false);
        setGenerationError(res.error || (locale === "en" ? "Failed to generate questions. Please check your topic and try again." : "NOVA soruları oluşturamadı. Lütfen girdi materyalini kontrol edip tekrar deneyin."));
      }
    } catch (err: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setGenerationError(err.message || (locale === "en" ? "Unexpected error while generating quiz." : "Test üretilirken beklenmeyen bir hata oluştu."));
    }
  };

  const handleSelectOption = (optionId: string) => {
    if (selectedAnswers[currentQIndex] !== undefined) return;
    setSelectedAnswers(prev => ({ ...prev, [currentQIndex]: optionId }));
  };

  const handleFinishQuiz = async () => {
    setQuizFinished(true);

    const wrongTopics: string[] = [];
    quizQuestions.forEach((q, idx) => {
      const selected = selectedAnswers[idx];
      const opt = q.options.find(o => o.id === selected);
      if (!opt?.isCorrect && q.topic) {
        wrongTopics.push(q.topic);
      }
    });

    const res = await analyzeQuizPerformanceAction({
      quizTitle: selectedSubject || "NOVA Pratik Seansı",
      totalQuestions: quizQuestions.length,
      correctCount,
      timeSpentSeconds: 45,
      wrongTopics,
    });

    if (res.success && res.data) {
      setDiagnostic(res.data);
    }
  };

  const currentQuestion = quizQuestions[currentQIndex];
  const totalQuestions = quizQuestions.length;
  const isAnswered = selectedAnswers[currentQIndex] !== undefined;
  const selectedOption = selectedAnswers[currentQIndex];

  const correctCount = Object.entries(selectedAnswers).filter(([idx, ans]) => {
    const q = quizQuestions[Number(idx)];
    const opt = q?.options.find(o => o.id === ans);
    return opt?.isCorrect;
  }).length;

  const selectedStudySet = studySets.find(s => s.id === selectedSetId);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-7 px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs px-2.5 py-0.5">
                <Sparkles className="h-3.5 w-3.5 text-primary mr-1" />
                {t("practice.badge")}
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {quizActive ? t("practice.active_session_title") : t("practice.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {quizActive
                ? t("practice.active_session_desc")
                : t("practice.subtitle")}
            </p>
          </div>
        </div>

        {/* Generation Error Alert */}
        {generationError && (
          <div className="p-4 rounded-lg bg-destructive/15 border border-destructive/30 text-sm text-foreground flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
              <span>{generationError}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setGenerationError(null)} className="h-8 text-xs">
              {locale === "en" ? "Close" : "Kapat"}
            </Button>
          </div>
        )}

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="p-4 rounded-lg bg-success/15 border border-success/30 text-sm text-foreground flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              <span>{saveSuccessMsg}</span>
            </div>
            <Button size="sm" variant="outline" onClick={() => setSaveSuccessMsg(null)} className="h-8 text-xs">
              {locale === "en" ? "Close" : "Kapat"}
            </Button>
          </div>
        )}

        {/* ── INTERACTIVE QUIZ SESSION VIEW ────────────────── */}
        {quizActive && currentQuestion && (
          <div className="space-y-6 animate-fade-in">
            {!quizFinished ? (
              <Card className="p-6 sm:p-8 space-y-6 shadow-elevated">
                {/* Session Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-muted-foreground">
                      {locale === "en" ? `Question ${currentQIndex + 1} / ${totalQuestions}` : `Soru ${currentQIndex + 1} / ${totalQuestions}`}
                    </span>
                    {currentQuestion.topic && (
                      <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                        {currentQuestion.topic}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center gap-2 text-sm font-medium text-warning hover:text-foreground transition-colors"
                    >
                      <HelpCircle className="h-4 w-4 text-warning" />
                      <span>{showHint ? t("practice.hint_hide") : t("practice.hint_btn")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setQuizActive(false); setSelectedAnswers({}); }}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {locale === "en" ? "End Quiz" : "Testi Bitir"}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <Progress value={((currentQIndex + 1) / totalQuestions) * 100} className="h-2" />

                {/* Question Statement */}
                <div className="space-y-6">
                  <div className="text-lg sm:text-xl font-medium text-foreground leading-relaxed">
                    {currentQuestion.question}
                  </div>

                  {/* Hint Card */}
                  {showHint && (
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm text-foreground space-y-1.5 animate-fade-in">
                      <div className="font-semibold text-warning flex items-center gap-2">
                        <HelpCircle className="h-4 w-4" />
                        {t("practice.hint_title")}
                      </div>
                      <p className="text-muted-foreground">{currentQuestion.hint}</p>
                    </div>
                  )}

                  {/* Options List */}
                  <div className="space-y-3 pt-2">
                    {currentQuestion.options.map((opt) => {
                      const isSelected = selectedOption === opt.id;
                      let optionStyle = "border-border bg-card hover:bg-secondary text-foreground";

                      if (isAnswered) {
                        if (opt.isCorrect) {
                          optionStyle = "border-success bg-success/15 text-foreground font-semibold";
                        } else if (isSelected && !opt.isCorrect) {
                          optionStyle = "border-destructive bg-destructive/15 text-foreground";
                        } else {
                          optionStyle = "border-border bg-card/40 opacity-50 text-muted-foreground";
                        }
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          disabled={isAnswered}
                          onClick={() => handleSelectOption(opt.id)}
                          className={`w-full p-4 sm:p-5 rounded-lg border text-left text-base transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span className="h-8 w-8 rounded-md flex items-center justify-center font-mono font-bold text-sm bg-secondary border border-border shrink-0">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {isAnswered && opt.isCorrect && (
                            <span className="flex items-center gap-1.5 text-sm text-success font-semibold shrink-0 ml-2">
                              <Check className="h-5 w-5" /> {locale === "en" ? "Correct" : "Doğru"}
                            </span>
                          )}
                          {isAnswered && isSelected && !opt.isCorrect && (
                            <span className="text-sm text-destructive font-semibold shrink-0 ml-2">
                              {locale === "en" ? "Incorrect" : "Yanlış"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after Answer */}
                  {isAnswered && (
                    <div className="p-5 rounded-lg bg-secondary border border-border space-y-2 text-sm animate-fade-in">
                      <span className="font-semibold text-primary flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {t("practice.solution_analysis")}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <span className="text-sm text-muted-foreground">
                    {t("practice.correct_label")}: <span className="font-semibold text-success">{correctCount}</span> / {totalQuestions}
                  </span>

                  {isAnswered && (
                    currentQIndex < totalQuestions - 1 ? (
                      <Button
                        variant="brand"
                        size="lg"
                        onClick={() => { setCurrentQIndex(i => i + 1); setShowHint(false); }}
                        className="gap-2 font-semibold px-6"
                      >
                        {t("practice.btn_next_question")}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="brand"
                        size="lg"
                        onClick={handleFinishQuiz}
                        className="gap-2 font-semibold px-8"
                      >
                        {t("practice.btn_see_results")}
                        <Trophy className="h-5 w-5 text-warning" />
                      </Button>
                    )
                  )}
                </div>
              </Card>
            ) : (
              /* Quiz Finished Summary View */
              <Card className="p-8 sm:p-12 text-center space-y-8 animate-fade-in shadow-elevated">
                <div className="h-20 w-20 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto">
                  <Trophy className="h-10 w-10" />
                </div>

                <div>
                  <Badge variant="success" className="mb-3 px-3 py-1">
                    {locale === "en" ? "Practice Session Completed" : "Pratik Seansı Tamamlandı"}
                  </Badge>
                  <h2 className="text-3xl font-semibold text-foreground">
                    {t("practice.scorecard_title")}
                  </h2>
                  <p className="text-base text-muted-foreground mt-2">
                    {t("practice.scorecard_desc", {
                      correct: correctCount,
                      total: totalQuestions,
                      accuracy: Math.round((correctCount / totalQuestions) * 100),
                    })}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                  <div className="p-4 rounded-lg bg-secondary border border-border">
                    <div className="text-xs text-muted-foreground">{t("practice.correct_label")}</div>
                    <div className="text-2xl font-mono font-bold text-success mt-1">{correctCount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary border border-border">
                    <div className="text-xs text-muted-foreground">{t("practice.wrong_label")}</div>
                    <div className="text-2xl font-mono font-bold text-destructive mt-1">{totalQuestions - correctCount}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary border border-border">
                    <div className="text-xs text-muted-foreground">{t("practice.earned_xp")}</div>
                    <div className="text-2xl font-mono font-bold text-warning mt-1">+{correctCount * 15} XP</div>
                  </div>
                </div>

                {/* NOVA AI Diagnostic Card */}
                {diagnostic && (
                  <div className="max-w-xl mx-auto text-left p-5 rounded-lg bg-secondary border border-primary/20 space-y-2.5 animate-fade-in">
                    <div className="text-sm font-semibold text-primary flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      {t("practice.diagnostic_title")}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{diagnostic.recommendedAction}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-border">
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={() => {
                      setQuizActive(true);
                      setCurrentQIndex(0);
                      setSelectedAnswers({});
                      setQuizFinished(false);
                    }}
                    className="w-full sm:w-auto gap-2 font-semibold px-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("practice.btn_retry")}
                  </Button>

                  <Button
                    variant="chessDark"
                    size="lg"
                    onClick={() => { setQuizActive(false); setQuizFinished(false); }}
                    className="w-full sm:w-auto px-6"
                  >
                    {t("practice.btn_new_test")}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ── TEST GENERATION / STUDY HUB CONFIGURATION VIEW ── */}
        {!quizActive && (
          <div className="space-y-6">
            {/* 1. MAIN CATEGORY SELECTOR */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("practice.select_category")}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveCategory("academic")}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    activeCategory === "academic"
                      ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{t("practice.cat_academic")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("practice.cat_academic_sub")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("language")}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    activeCategory === "language"
                      ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Globe2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{t("practice.cat_language")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("practice.cat_language_sub")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("coding_tech")}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    activeCategory === "coding_tech"
                      ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Code2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{t("practice.cat_coding")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("practice.cat_coding_sub")}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveCategory("custom_hub")}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    activeCategory === "custom_hub"
                      ? "border-primary bg-primary/10 text-foreground font-semibold shadow-sm"
                      : "border-border hover:bg-secondary text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">{t("practice.cat_custom")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t("practice.cat_custom_sub")}</p>
                </button>
              </div>
            </div>

            {/* 2. SADE VE NET AKADEMİK MÜFREDAT AKIŞI [Ülke] -> [Spesifik Sınıf] -> [Ders Türü & Ders] -> [Konu] */}
            {activeCategory === "academic" && (
              <div className="space-y-4 p-5 rounded-xl bg-card border border-border shadow-sm animate-fade-in">
                {/* A. ÜLKE SEÇİMİ */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("practice.select_country")}
                    </label>
                    <span className="text-xs text-primary font-medium">{currentCurriculum.systemTitle}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(Object.keys(GRANULAR_CURRICULUM_DATA) as Array<"TR" | "US" | "UK" | "DE" | "GLOBAL_IB">).map((code) => {
                      const c = GRANULAR_CURRICULUM_DATA[code];
                      const isSelected = selectedCountryCode === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setSelectedCountryCode(code)}
                          className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                            isSelected
                              ? "bg-primary text-primary-foreground shadow-sm border-primary"
                              : "bg-secondary/40 border-border hover:bg-secondary text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span className="text-base">{c.flag}</span>
                          <span className="truncate">{c.countryName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* B. SPESİFİK SINIF, DERS TÜRÜ VE DERS SEÇİMİ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-border">
                  {/* 1. Tek Tek Sınıf Seçimi */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{t("practice.grade_level")}</label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      {currentCurriculum.grades.map((grd) => (
                        <option key={grd} value={grd}>{grd}</option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Ders Türü (3 Ana Grup) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{t("practice.subject_type")}</label>
                    <select
                      value={selectedCategoryKey}
                      onChange={(e) => setSelectedCategoryKey(e.target.value as any)}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      <option value="Genel Dersler">{t("practice.type_core")}</option>
                      <option value="Seçmeli Dersler">{t("practice.type_elective")}</option>
                      <option value="Bölüm / Meslek / Uzmanlık">{t("practice.type_specialized")}</option>
                    </select>
                  </div>

                  {/* 3. Ders Seçimi */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{t("practice.subject_name")}</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm font-semibold text-primary focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      {(currentCurriculum.categories[selectedCategoryKey] || []).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* C. OPSİYONEL KONU / ÜNİTE BAŞLIĞI */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-medium text-foreground">
                    {t("practice.specific_topic")}
                  </label>
                  <Input
                    type="text"
                    placeholder={t("practice.topic_placeholder")}
                    value={specificUnitTopic}
                    onChange={(e) => setSpecificUnitTopic(e.target.value)}
                    className="h-11 text-sm font-medium"
                  />
                </div>
              </div>
            )}

            {/* 3. CUSTOM STUDY HUB: SAVED STUDY SETS LIBRARY VIEW */}
            {activeCategory === "custom_hub" && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderHeart className="h-5 w-5 text-primary" />
                    <h2 className="text-base sm:text-lg font-semibold text-foreground">
                      {t("practice.saved_sets_title")} ({studySets.length})
                    </h2>
                  </div>

                  <Button
                    variant={isCreatingNewSet ? "secondary" : "brand"}
                    size="sm"
                    onClick={() => setIsCreatingNewSet(!isCreatingNewSet)}
                    className="gap-2 font-semibold h-9"
                  >
                    <Plus className="h-4 w-4" />
                    {isCreatingNewSet ? t("practice.btn_back_library") : t("practice.btn_add_set")}
                  </Button>
                </div>

                {/* NEW SET CREATION FORM MODAL / PANEL */}
                {isCreatingNewSet ? (
                  <Card className="p-6 sm:p-8 border-primary/40 bg-card shadow-elevated space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-border">
                      <div className="flex items-center gap-2 text-primary font-semibold text-base">
                        <Plus className="h-5 w-5" />
                        {t("practice.save_set_modal_title")}
                      </div>
                      <span className="text-xs text-muted-foreground">{t("practice.save_set_modal_desc")}</span>
                    </div>

                    <form onSubmit={handleSaveNewStudySet} className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                          {t("practice.set_title_label")}
                        </label>
                        <Input
                          type="text"
                          placeholder={t("practice.set_title_placeholder")}
                          value={newSetTitle}
                          onChange={(e) => setNewSetTitle(e.target.value)}
                          className="h-11 text-sm font-medium"
                          required
                        />
                      </div>

                      {/* Material Type Tabs */}
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-foreground">
                          {t("practice.material_type_label")}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setNewSetType("youtube")}
                            className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                              newSetType === "youtube"
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border hover:bg-secondary text-muted-foreground"
                            }`}
                          >
                            <Youtube className="h-4 w-4 text-red-500" />
                            {t("practice.mat_youtube")}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewSetType("pdf")}
                            className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                              newSetType === "pdf"
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border hover:bg-secondary text-muted-foreground"
                            }`}
                          >
                            <FileText className="h-4 w-4 text-primary" />
                            {t("practice.mat_pdf")}
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewSetType("text")}
                            className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                              newSetType === "text"
                                ? "border-primary bg-primary/10 text-foreground"
                                : "border-border hover:bg-secondary text-muted-foreground"
                            }`}
                          >
                            <Type className="h-4 w-4 text-warning" />
                            {t("practice.mat_text")}
                          </button>
                        </div>
                      </div>

                      {/* Material Content Inputs */}
                      {newSetType === "youtube" && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground">YouTube Video URL</label>
                          <Input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={newSetContent}
                            onChange={(e) => setNewSetContent(e.target.value)}
                            className="h-11 text-sm font-mono"
                            required
                          />
                        </div>
                      )}

                      {newSetType === "pdf" && (
                        <div className="space-y-3">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors bg-secondary/20">
                            <Upload className="h-8 w-8 text-primary mx-auto mb-2" />
                            <label className="cursor-pointer">
                              <span className="text-sm font-semibold text-primary hover:underline">
                                {locale === "en" ? "Select a PDF" : "Bir PDF seçin"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {locale === "en" ? " or drag and drop" : " veya buraya sürükleyin"}
                              </span>
                              <input type="file" accept=".pdf,.txt" onChange={handlePdfUpload} className="hidden" />
                            </label>
                            {newSetFileName && (
                              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-card border border-border text-xs font-mono text-foreground">
                                <FileText className="h-4 w-4 text-primary" />
                                <span>{newSetFileName}</span>
                              </div>
                            )}
                          </div>
                          <textarea
                            rows={4}
                            value={newSetContent}
                            onChange={(e) => setNewSetContent(e.target.value)}
                            placeholder={locale === "en" ? "PDF extracted text or lecture notes..." : "PDF içeriği veya ekstra ders notları..."}
                            className="w-full p-3 rounded-lg border border-input bg-background text-xs font-mono focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                          />
                        </div>
                      )}

                      {newSetType === "text" && (
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-foreground">{t("practice.mat_text")}</label>
                          <textarea
                            rows={6}
                            value={newSetContent}
                            onChange={(e) => setNewSetContent(e.target.value)}
                            placeholder={locale === "en" ? "Paste lecture notes, transcript or summary here..." : "Ders notlarınızı, transkripti veya kitap özetini buraya yapıştırın..."}
                            className="w-full p-3.5 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                            required
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                        <Button type="button" variant="ghost" onClick={() => setIsCreatingNewSet(false)} className="h-10 text-xs">
                          {locale === "en" ? "Cancel" : "İptal"}
                        </Button>
                        <Button type="submit" variant="brand" className="h-10 text-xs px-6 font-semibold gap-2">
                          <Bookmark className="h-4 w-4" />
                          {t("practice.btn_save_set")}
                        </Button>
                      </div>
                    </form>
                  </Card>
                ) : (
                  /* SAVED SETS GRID */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {studySets.map((set) => {
                      const isSelected = selectedSetId === set.id;
                      return (
                        <div
                          key={set.id}
                          onClick={() => setSelectedSetId(set.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all relative group flex flex-col justify-between ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary"
                              : "border-border bg-card hover:bg-secondary/60 hover:border-foreground/30"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                                {set.type === "youtube" && <Youtube className="h-4 w-4 text-red-500" />}
                                {set.type === "pdf" && <FileText className="h-4 w-4 text-primary" />}
                                {set.type === "text" && <Type className="h-4 w-4 text-warning" />}
                                <span className="uppercase text-[10px] tracking-wider">{set.type}</span>
                              </span>

                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteStudySet(set.id, e)}
                                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                  title={locale === "en" ? "Delete Set" : "Seti Sil"}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
                              {set.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                              {set.content}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(set.createdAt).toLocaleDateString(locale === "en" ? "en-US" : "tr-TR")}
                            </span>
                            {isSelected && (
                              <span className="text-primary font-semibold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="h-3.5 w-3.5" /> {t("practice.selected_set_badge")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 4. SEÇİM ÖZETİ VE TESTİ BAŞLAT KARTI */}
            <Card className="p-6 sm:p-7 shadow-elevated">
              <form onSubmit={handleStartGeneration} className="space-y-6">
                {/* ACTIVE SELECTION SUMMARY BANNER */}
                <div className="p-4 rounded-lg bg-secondary border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground uppercase font-semibold">{t("practice.test_focus")}</div>
                    <div className="text-sm sm:text-base font-semibold text-foreground mt-0.5">
                      {activeCategory === "academic" && (
                        <span>
                          {currentCurriculum.countryName} • <span className="text-primary font-bold">{selectedGrade}</span> • {selectedCategoryKey === "Genel Dersler" ? t("practice.type_core") : (selectedCategoryKey === "Seçmeli Dersler" ? t("practice.type_elective") : t("practice.type_specialized"))} ➔ <span className="text-primary font-bold">{selectedSubject}</span>
                          {specificUnitTopic ? ` ("${specificUnitTopic}")` : ""}
                        </span>
                      )}
                      {activeCategory === "language" && `${currentLangObj.name} (${t("practice.cefr_level_label")}: ${currentLangObj.levels.find(l => l.id === selectedCefrLevel)?.code} - ${currentLangObj.levels.find(l => l.id === selectedCefrLevel)?.label})`}
                      {activeCategory === "coding_tech" && `${currentCodingObj.name} (${currentCodingObj.levels.find(l => l.id === selectedCodingLevel)?.label})`}
                      {activeCategory === "custom_hub" && (selectedStudySet ? `${t("practice.selected_set_badge")}: "${selectedStudySet.title}"` : (locale === "en" ? "No study set selected" : "Kayıtlı bir set seçilmedi"))}
                    </div>
                  </div>

                  <Badge variant="brand" className="self-start sm:self-auto text-xs">
                    {activeCategory === "academic" ? (locale === "en" ? "Curriculum Aligned" : "MEB / Resmi Standart") : (activeCategory === "custom_hub" ? (locale === "en" ? "Custom Library" : "Özel Kütüphane") : (locale === "en" ? "Standard" : "Standart"))}
                  </Badge>
                </div>

                {/* DYNAMIC PARAMETER GRID ACCORDING TO CATEGORY */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
                  {/* 1. LANGUAGE INDEPENDENT CEFR PARAMETERS */}
                  {activeCategory === "language" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{t("practice.lang_target_label")}</label>
                        <select
                          value={selectedLanguageTarget}
                          onChange={(e) => setSelectedLanguageTarget(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          {LANGUAGE_TARGETS.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{t("practice.cefr_level_label")}</label>
                        <select
                          value={selectedCefrLevel}
                          onChange={(e) => setSelectedCefrLevel(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          {currentLangObj.levels.map(lvl => (
                            <option key={lvl.id} value={lvl.id}>{lvl.code} - {lvl.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* 2. CODING INDEPENDENT LANGUAGE & LEVEL */}
                  {activeCategory === "coding_tech" && (
                    <>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{t("practice.coding_lang_label")}</label>
                        <select
                          value={selectedCodingLang}
                          onChange={(e) => setSelectedCodingLang(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          {CODING_LANGUAGES.map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-foreground">{t("practice.coding_level_label")}</label>
                        <select
                          value={selectedCodingLevel}
                          onChange={(e) => setSelectedCodingLevel(e.target.value)}
                          className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                        >
                          {currentCodingObj.levels.map(lvl => (
                            <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                  {/* DIFFICULTY */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{t("practice.diff_level")}</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      <option value="Kolay">{t("practice.diff_easy")}</option>
                      <option value="Orta">{t("practice.diff_medium")}</option>
                      <option value="Zor">{t("practice.diff_hard")}</option>
                    </select>
                  </div>

                  {/* QUESTION COUNT */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">{t("practice.question_count")}</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:outline-none"
                    >
                      <option value="5">{t("practice.count_5")}</option>
                      <option value="10">{t("practice.count_10")}</option>
                      <option value="15">{t("practice.count_15")}</option>
                    </select>
                  </div>
                </div>

                {isProcessing && (
                  <div className="p-5 rounded-lg bg-secondary border border-border space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-foreground">
                      <span className="flex items-center gap-2">
                        {processStep < processingSteps.length - 1 ? (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 text-success" />
                        )}
                        {processingSteps[processStep]}
                      </span>
                      <span className="text-muted-foreground font-mono">{processStep + 1} / {processingSteps.length}</span>
                    </div>
                    <div className="w-full bg-background rounded-sm h-2 overflow-hidden border border-border">
                      <div className="bg-primary h-2 rounded-sm transition-all duration-500" style={{ width: `${((processStep + 1) / processingSteps.length) * 100}%` }} />
                    </div>
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">
                    {t("practice.free_quota", { left: 3, total: 5 })}
                  </div>
                  <Button
                    type="submit"
                    variant="brand"
                    size="lg"
                    disabled={isProcessing || (activeCategory === "custom_hub" && !selectedSetId)}
                    className="gap-2 font-semibold px-8 h-12 text-sm"
                  >
                    <Sparkles className="h-4 w-4" />
                    {isProcessing ? t("practice.btn_generating") : t("practice.btn_generate")}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
