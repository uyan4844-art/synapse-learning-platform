"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Swords, Users, Sparkles, ArrowRight, Copy, Check, Zap,
  Timer, Trophy, CheckCircle2, RotateCcw, Loader2, Plus,
  Shield, UserX, Play, Lock, Globe, BookOpen, Layers,
  Code2, Clock, AlertCircle, Sparkle, Share2, LogOut,
  Youtube, FileText, Type, Upload
} from "lucide-react";
import { useTranslation } from "@/i18n/context";
import {
  GRANULAR_CURRICULUM_DATA,
  LANGUAGE_TARGETS,
  CODING_LANGUAGES,
} from "@/config/learning-goals";
import { CustomStudySet, DEFAULT_CUSTOM_SETS } from "@/types/study-sets";
import { BattleLobbyState, BattlePlayer, BattleRoomSettings, INITIAL_PUBLIC_LOBBIES, BattleMaterialType } from "@/types/battle";
import { generateNovaQuizAction, type IngestionSourceType } from "@/lib/nova/actions";
import type { GeneratedQuestion } from "@/lib/nova/gemini-client";

export default function BattlePage() {
  const { t, locale } = useTranslation();

  // Navigation View Modes: "list" (Main browser/lobbies) | "lobby" (Inside room waiting room) | "match" (Active quiz battle)
  const [viewMode, setViewMode] = React.useState<"list" | "lobby" | "match">("list");

  // Public & Active Lobbies state
  const [lobbies, setLobbies] = React.useState<BattleLobbyState[]>(INITIAL_PUBLIC_LOBBIES);
  const [activeLobby, setActiveLobby] = React.useState<BattleLobbyState | null>(null);

  // Join Room by Code input
  const [inputCode, setInputCode] = React.useState("");
  const [joinError, setJoinError] = React.useState<string | null>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);

  // -------------------------------------------------------------
  // ADVANCED ROOM CREATION MODAL STATE
  // -------------------------------------------------------------
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // 4 Primary Categories: academic, language, coding_tech, custom_hub
  const [category, setCategory] = React.useState<"academic" | "language" | "coding_tech" | "custom_hub">("academic");

  // Universal Material Ingestion Mode for ALL categories: "standard" | "youtube" | "pdf" | "text"
  const [materialSourceMode, setMaterialSourceMode] = React.useState<"standard" | "youtube" | "pdf" | "text">("standard");

  // Academic Controls
  const [countryCode, setCountryCode] = React.useState<"TR" | "US" | "UK" | "DE" | "GLOBAL_IB">("TR");
  const currentCurriculum = GRANULAR_CURRICULUM_DATA[countryCode] || GRANULAR_CURRICULUM_DATA.TR;
  const [grade, setGrade] = React.useState(currentCurriculum.grades[10] || currentCurriculum.grades[0]);
  const [subjectType, setSubjectType] = React.useState<"Genel Dersler" | "Seçmeli Dersler" | "Bölüm / Meslek / Uzmanlık">("Genel Dersler");
  const [subjectName, setSubjectName] = React.useState(currentCurriculum.categories["Genel Dersler"]?.[0] || "Matematik");
  const [specificTopic, setSpecificTopic] = React.useState("");

  // Language & Coding
  const [selectedLanguageTarget, setSelectedLanguageTarget] = React.useState("english");
  const [selectedCefrLevel, setSelectedCefrLevel] = React.useState("en_b2");
  const [selectedCodingLang, setSelectedCodingLang] = React.useState("python");
  const [selectedCodingLevel, setSelectedCodingLevel] = React.useState("py_mid");

  // Custom Study Hub Sets
  const [savedSets, setSavedSets] = React.useState<CustomStudySet[]>([]);
  const [selectedSetId, setSelectedSetId] = React.useState<string | null>(null);

  // Universal Multimodal Direct Inputs (Available for all categories!)
  const [directYoutubeUrl, setDirectYoutubeUrl] = React.useState("");
  const [directTextContent, setDirectTextContent] = React.useState("");
  const [directCustomTitle, setDirectCustomTitle] = React.useState("");
  const [directPdfFileName, setDirectPdfFileName] = React.useState<string | null>(null);
  const [directPdfContent, setDirectPdfContent] = React.useState("");

  // Room Privacy & Rules
  const [privacy, setPrivacy] = React.useState<"public" | "private">("public");
  const [maxPlayers, setMaxPlayers] = React.useState<2 | 3 | 4 | 8>(4);
  const [questionCount, setQuestionCount] = React.useState<5 | 10 | 15>(5);
  const [timePerQuestion, setTimePerQuestion] = React.useState<15 | 30 | 45>(30);

  // Sync grades & subjects when country changes
  React.useEffect(() => {
    const cur = GRANULAR_CURRICULUM_DATA[countryCode];
    if (cur) {
      setGrade(cur.grades[10] || cur.grades[0]);
      setSubjectName(cur.categories[subjectType]?.[0] || "");
    }
  }, [countryCode, subjectType]);

  // Load Custom Sets for Battle
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("custom_study_sets");
      if (stored) {
        const parsed = JSON.parse(stored);
        setSavedSets(parsed);
        if (parsed.length > 0) setSelectedSetId(parsed[0].id);
      } else {
        setSavedSets(DEFAULT_CUSTOM_SETS);
        setSelectedSetId(DEFAULT_CUSTOM_SETS[0].id);
      }
    } catch {
      setSavedSets(DEFAULT_CUSTOM_SETS);
      setSelectedSetId(DEFAULT_CUSTOM_SETS[0].id);
    }
  }, []);

  // PDF Upload in room creator
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDirectPdfFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDirectPdfContent(text || "Ders notu metin içeriği");
        if (!directCustomTitle) {
          setDirectCustomTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
      };
      reader.readAsText(file);
    }
  };

  // -------------------------------------------------------------
  // LOBBY & MULTIPLAYER MATCH STATE
  // -------------------------------------------------------------
  const [currentUser, setCurrentUser] = React.useState<BattlePlayer>({
    id: "me",
    name: "Ben (Öğrenci)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=UserMe",
    elo: 1450,
    isHost: false,
    isReady: false,
    score: 0,
  });

  // Active Quiz Match Session
  const [battleQuestions, setBattleQuestions] = React.useState<GeneratedQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [matchTimer, setMatchTimer] = React.useState(30);
  const [isGeneratingMatch, setIsGeneratingMatch] = React.useState(false);
  const [matchFinished, setMatchFinished] = React.useState(false);

  // 1. Create Room Handler
  const handleCreateRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = "SYN-" + Math.floor(1000 + Math.random() * 9000);

    let displaySubject = subjectName;
    let materialType: BattleMaterialType = "curriculum";
    let materialContent = "";
    let fileName = undefined;

    // Base Subject Title Resolution
    if (category === "academic") {
      displaySubject = specificTopic ? `${subjectName}: ${specificTopic}` : subjectName;
    } else if (category === "language") {
      const lObj = LANGUAGE_TARGETS.find(l => l.id === selectedLanguageTarget);
      displaySubject = `${lObj?.name || "İngilizce"} (${selectedCefrLevel.toUpperCase()})`;
    } else if (category === "coding_tech") {
      const cObj = CODING_LANGUAGES.find(c => c.id === selectedCodingLang);
      displaySubject = `${cObj?.name || "Python"} Kodlama`;
    } else if (category === "custom_hub") {
      const cSet = savedSets.find(s => s.id === selectedSetId);
      displaySubject = cSet ? `Özel Set: ${cSet.title}` : "Özel Çalışma Seti";
    }

    // Material Resolution (YouTube / PDF / Text / Standard)
    if (materialSourceMode === "youtube" && directYoutubeUrl.trim()) {
      materialType = "youtube";
      materialContent = directYoutubeUrl.trim();
      displaySubject = directCustomTitle || `${displaySubject} (YouTube Dersi)`;
    } else if (materialSourceMode === "pdf" && directPdfContent.trim()) {
      materialType = "pdf";
      materialContent = directPdfContent.trim();
      fileName = directPdfFileName || undefined;
      displaySubject = directCustomTitle || directPdfFileName || `${displaySubject} (PDF Notu)`;
    } else if (materialSourceMode === "text" && directTextContent.trim()) {
      materialType = "text";
      materialContent = directTextContent.trim();
      displaySubject = directCustomTitle || `${displaySubject} (Özel Notlar)`;
    } else {
      materialType = "curriculum";
      materialContent = displaySubject;
    }

    const newSettings: BattleRoomSettings = {
      category,
      countryCode: category === "academic" ? countryCode : undefined,
      countryName: category === "academic" ? currentCurriculum.countryName : undefined,
      grade: category === "academic" ? grade : undefined,
      subjectType: category === "academic" ? subjectType : undefined,
      subjectName: displaySubject,
      specificTopic: specificTopic || undefined,
      materialType,
      materialContent,
      fileName,
      privacy,
      maxPlayers,
      questionCount,
      timePerQuestion,
    };

    const hostPlayer: BattlePlayer = {
      id: "me",
      name: "Ben (Kurucu)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=HostUser",
      elo: 1450,
      isHost: true,
      isReady: true,
      score: 0,
    };

    const newLobby: BattleLobbyState = {
      roomId: `room_${Date.now()}`,
      roomCode: code,
      hostId: "me",
      hostName: hostPlayer.name,
      settings: newSettings,
      players: [hostPlayer],
      isStarted: false,
      createdAt: new Date().toISOString(),
    };

    setCurrentUser(hostPlayer);
    setActiveLobby(newLobby);
    setLobbies(prev => [newLobby, ...prev]);
    setIsCreateModalOpen(false);
    setViewMode("lobby");
  };

  // 2. Join Room by Code
  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const target = lobbies.find(l => l.roomCode.toLowerCase() === inputCode.trim().toLowerCase());
    if (!target) {
      setJoinError(locale === "en" ? "Room not found. Please check code." : "Oda bulunamadı. Lütfen kodu kontrol edin.");
      return;
    }

    if (target.players.length >= target.settings.maxPlayers) {
      setJoinError(locale === "en" ? "Room is full." : "Bu oda dolu.");
      return;
    }

    const joiningPlayer: BattlePlayer = {
      id: "me",
      name: "Ben (Katılımcı)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JoinMe",
      elo: 1420,
      isHost: false,
      isReady: false,
      score: 0,
    };

    const updatedLobby: BattleLobbyState = {
      ...target,
      players: [...target.players, joiningPlayer],
    };

    setCurrentUser(joiningPlayer);
    setActiveLobby(updatedLobby);
    setLobbies(prev => prev.map(l => l.roomId === target.roomId ? updatedLobby : l));
    setJoinError(null);
    setInputCode("");
    setViewMode("lobby");
  };

  // 3. Join Public Lobby from List
  const handleJoinPublicLobby = (lobby: BattleLobbyState) => {
    if (lobby.players.length >= lobby.settings.maxPlayers) return;

    const joiningPlayer: BattlePlayer = {
      id: "me",
      name: "Ben (Katılımcı)",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JoinMe",
      elo: 1420,
      isHost: false,
      isReady: false,
      score: 0,
    };

    const updatedLobby: BattleLobbyState = {
      ...lobby,
      players: [...lobby.players.filter(p => p.id !== "me"), joiningPlayer],
    };

    setCurrentUser(joiningPlayer);
    setActiveLobby(updatedLobby);
    setLobbies(prev => prev.map(l => l.roomId === lobby.roomId ? updatedLobby : l));
    setViewMode("lobby");
  };

  // 4. Kick Player (Host Only)
  const handleKickPlayer = (playerId: string) => {
    if (!activeLobby || !currentUser.isHost) return;
    const updatedPlayers = activeLobby.players.filter(p => p.id !== playerId);
    const updatedLobby: BattleLobbyState = {
      ...activeLobby,
      players: updatedPlayers,
    };
    setActiveLobby(updatedLobby);
    setLobbies(prev => prev.map(l => l.roomId === activeLobby.roomId ? updatedLobby : l));
  };

  // 5. Toggle Ready Status
  const handleToggleReady = () => {
    if (!activeLobby) return;
    const newReadyState = !currentUser.isReady;
    setCurrentUser(prev => ({ ...prev, isReady: newReadyState }));

    const updatedPlayers = activeLobby.players.map(p =>
      p.id === currentUser.id ? { ...p, isReady: newReadyState } : p
    );
    const updatedLobby: BattleLobbyState = {
      ...activeLobby,
      players: updatedPlayers,
    };
    setActiveLobby(updatedLobby);
    setLobbies(prev => prev.map(l => l.roomId === activeLobby.roomId ? updatedLobby : l));
  };

  // 6. Start Battle Match (Host Only)
  const handleStartBattle = async () => {
    if (!activeLobby) return;
    setIsGeneratingMatch(true);

    try {
      const st = activeLobby.settings;
      let sourceType: IngestionSourceType = "topic";
      let inputUrlOrTopic = st.subjectName;

      if (st.materialType === "youtube" && st.materialContent) {
        sourceType = "youtube";
        inputUrlOrTopic = st.materialContent;
      } else if (st.materialType === "pdf" && st.materialContent) {
        sourceType = "pdf";
        inputUrlOrTopic = st.materialContent;
      } else if (st.materialType === "text" && st.materialContent) {
        sourceType = "text";
        inputUrlOrTopic = st.materialContent;
      } else {
        sourceType = "topic";
        inputUrlOrTopic = st.specificTopic ? `${st.subjectName}: ${st.specificTopic}` : st.subjectName;
      }

      const res = await generateNovaQuizAction({
        sourceType,
        urlOrTopic: inputUrlOrTopic,
        topicTitle: `Düello: ${st.subjectName}`,
        pdfRawText: sourceType === "pdf" ? st.materialContent : undefined,
        countryName: st.countryName,
        gradeLevel: st.grade || "11. Sınıf",
        subjectName: st.subjectName,
        specificUnitOrTopic: st.specificTopic,
        difficulty: "Orta",
        questionCount: st.questionCount,
        contentLanguage: locale === "en" ? "English" : "Türkçe",
      });

      if (res.success && res.data?.questions && res.data.questions.length > 0) {
        setBattleQuestions(res.data.questions);
        setCurrentQIndex(0);
        setSelectedAnswer(null);
        setMatchTimer(st.timePerQuestion);
        setMatchFinished(false);
        setIsGeneratingMatch(false);
        setViewMode("match");
      } else {
        setIsGeneratingMatch(false);
        alert(res.error || "Düello soruları oluşturulamadı, lütfen tekrar deneyin.");
      }
    } catch {
      setIsGeneratingMatch(false);
      alert("Düello başlatılırken bir hata oluştu.");
    }
  };

  // 7. Timer countdown inside match
  React.useEffect(() => {
    if (viewMode !== "match" || matchFinished || selectedAnswer !== null) return;

    if (matchTimer <= 0) {
      handleAnswer("TIMEOUT");
      return;
    }

    const interval = setInterval(() => {
      setMatchTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [viewMode, matchFinished, selectedAnswer, matchTimer]);

  // Answer handler
  const handleAnswer = (optionId: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionId);

    const curQ = battleQuestions[currentQIndex];
    const isCorrect = curQ?.options.find(o => o.id === optionId)?.isCorrect || false;

    if (isCorrect) {
      const points = 100 + matchTimer * 5;
      setCurrentUser(prev => ({ ...prev, score: (prev.score || 0) + points }));
    }

    setTimeout(() => {
      if (currentQIndex < battleQuestions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setMatchTimer(activeLobby?.settings.timePerQuestion || 30);
      } else {
        setMatchFinished(true);
      }
    }, 1500);
  };

  const copyRoomCode = () => {
    if (!activeLobby) return;
    navigator.clipboard.writeText(activeLobby.roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const currentQ = battleQuestions[currentQIndex];

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-8 px-2 sm:px-4">

        {/* ── 1. MAIN LOBBIES BROWSER VIEW ────────────────────── */}
        {viewMode === "list" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="brand" className="text-xs px-2.5 py-0.5">
                    <Swords className="h-3.5 w-3.5 mr-1" />
                    Çok Oyunculu Canlı Lobi &amp; Düello
                  </Badge>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Canlı Düello &amp; Soru Arenası
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Müfredat, YouTube, PDF veya serbest metinlerden oda açın, arkadaşlarınızla canlı yarışın.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="brand"
                  size="lg"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2 font-semibold shadow-md h-11 px-5"
                >
                  <Plus className="h-4 w-4" />
                  Özel Oda Oluştur
                </Button>
              </div>
            </div>

            {/* Quick Join Card & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5 border-border bg-card col-span-1 md:col-span-2 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                    <Zap className="h-4 w-4 text-warning" />
                    Oda Kodu ile Anında Katıl
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Arkadaşınızın paylaştığı 6 haneli özel oda kodunu (SYN-XXXX) girerek doğrudan lobiye geçin.
                  </p>
                </div>

                <form onSubmit={handleJoinByCode} className="flex gap-2">
                  <Input
                    placeholder="Örn: SYN-8492"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="font-mono uppercase h-11"
                  />
                  <Button type="submit" variant="secondary" className="font-semibold h-11 px-6">
                    Katıl
                  </Button>
                </form>

                {joinError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {joinError}
                  </p>
                )}
              </Card>

              <Card className="p-5 border-border bg-card flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Düello Dereceniz</span>
                  <Badge variant="brand" className="text-xs font-mono">1450 ELO</Badge>
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground">Elmas Lig</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Top %8 sıralamasındasınız</p>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Kazanma: %68</span>
                  <span>Toplam Maç: 34</span>
                </div>
              </Card>
            </div>

            {/* Public Lobbies List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <h2 className="text-base sm:text-lg font-bold text-foreground">
                    Açık Odalar ({lobbies.filter(l => l.settings.privacy === "public").length})
                  </h2>
                </div>
                <span className="text-xs text-muted-foreground">Anlık olarak güncellenir</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lobbies.filter(l => l.settings.privacy === "public").map((lobby) => {
                  const isFull = lobby.players.length >= lobby.settings.maxPlayers;
                  return (
                    <Card
                      key={lobby.roomId}
                      className="p-5 border-border bg-card hover:bg-secondary/40 transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="font-mono text-[11px]">
                              {lobby.roomCode}
                            </Badge>
                            {lobby.settings.materialType === "youtube" && <Youtube className="h-3.5 w-3.5 text-red-500" />}
                            {lobby.settings.materialType === "pdf" && <FileText className="h-3.5 w-3.5 text-primary" />}
                            {lobby.settings.materialType === "text" && <Type className="h-3.5 w-3.5 text-warning" />}
                          </div>
                          <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            {lobby.players.length} / {lobby.settings.maxPlayers} Oyuncu
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-foreground line-clamp-1">
                            {lobby.settings.subjectName}
                          </h3>
                          {lobby.settings.specificTopic && (
                            <p className="text-xs text-primary font-medium line-clamp-1 mt-0.5">
                              {lobby.settings.specificTopic}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Kurucu: <span className="text-foreground font-medium">{lobby.hostName}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{lobby.settings.questionCount} Soru • {lobby.settings.timePerQuestion} sn</span>
                        </div>

                        <Button
                          size="sm"
                          variant={isFull ? "outline" : "brand"}
                          disabled={isFull}
                          onClick={() => handleJoinPublicLobby(lobby)}
                          className="h-9 px-4 font-semibold text-xs"
                        >
                          {isFull ? "Oda Dolu" : "Odaya Katıl"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── 2. LIVE LOBBY ROOM VIEW (WAITING ROOM) ───────────── */}
        {viewMode === "lobby" && activeLobby && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Navigation & Exit */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className="gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Lobiden Ayrıl
              </Button>

              <div className="flex items-center gap-2">
                {activeLobby.settings.materialType === "youtube" && (
                  <Badge variant="secondary" className="text-xs text-red-500 gap-1">
                    <Youtube className="h-3.5 w-3.5" /> YouTube Transkript
                  </Badge>
                )}
                {activeLobby.settings.materialType === "pdf" && (
                  <Badge variant="secondary" className="text-xs text-primary gap-1">
                    <FileText className="h-3.5 w-3.5" /> PDF Materyali
                  </Badge>
                )}
                {activeLobby.settings.materialType === "text" && (
                  <Badge variant="secondary" className="text-xs text-warning gap-1">
                    <Type className="h-3.5 w-3.5" /> Özel Metin
                  </Badge>
                )}
                <Badge variant="brand" className="text-xs px-3 py-1 font-mono">
                  {activeLobby.settings.privacy === "private" ? "GİZLİ ODA" : "GENEL ODA"}
                </Badge>
              </div>
            </div>

            {/* Room Info Banner Card */}
            <Card className="p-6 bg-card border-border shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                  Düello Odası &amp; Materyali
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {activeLobby.settings.subjectName}
                </h2>
                {activeLobby.settings.specificTopic && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Konu: {activeLobby.settings.specificTopic}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{activeLobby.settings.questionCount} Soru</span>
                  <span>•</span>
                  <span>Soru Başı {activeLobby.settings.timePerQuestion} Saniye</span>
                  <span>•</span>
                  <span>Kapasite: {activeLobby.players.length} / {activeLobby.settings.maxPlayers}</span>
                </div>
              </div>

              {/* Room Code Card with Copy */}
              <div className="flex items-center gap-3 bg-secondary/80 p-3 rounded-lg border border-border shrink-0">
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Oda Kodu</div>
                  <div className="text-lg font-mono font-bold text-foreground">{activeLobby.roomCode}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyRoomCode}
                  className="h-9 px-3 gap-1.5 text-xs font-semibold"
                >
                  {copiedCode ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedCode ? "Kopyalandı" : "Kodu Kopyala"}
                </Button>
              </div>
            </Card>

            {/* Players Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  Lobideki Oyuncular ({activeLobby.players.length} / {activeLobby.settings.maxPlayers})
                </h3>
                <span className="text-xs text-muted-foreground">
                  {activeLobby.players.filter(p => p.isReady).length} / {activeLobby.players.length} Oyuncu Hazır
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {activeLobby.players.map((player) => {
                  const isHost = player.isHost;
                  const isMe = player.id === currentUser.id;

                  return (
                    <Card
                      key={player.id}
                      className={`p-4 border relative flex flex-col justify-between space-y-4 transition-all ${
                        player.isReady
                          ? "border-success/50 bg-success/5"
                          : "border-border bg-card"
                      }`}
                    >
                      {/* Kick Button for Host Only */}
                      {currentUser.isHost && !isMe && (
                        <button
                          type="button"
                          onClick={() => handleKickPlayer(player.id)}
                          className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Oyuncuyu Odadan At"
                        >
                          <UserX className="h-4 w-4 text-destructive" />
                        </button>
                      )}

                      <div className="flex items-center gap-3">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="h-12 w-12 rounded-full border border-border bg-secondary"
                        />
                        <div>
                          <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            {player.name}
                            {isHost && (
                              <span title="Oda Kurucusu" className="inline-flex">
                                <Shield className="h-3.5 w-3.5 text-warning shrink-0" />
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            {player.elo} ELO
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Durum:</span>
                        {player.isReady ? (
                          <span className="text-success font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Hazır
                          </span>
                        ) : (
                          <span className="text-warning font-medium flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" /> Bekliyor
                          </span>
                        )}
                      </div>
                    </Card>
                  );
                })}

                {/* Empty Slots */}
                {Array.from({ length: activeLobby.settings.maxPlayers - activeLobby.players.length }).map((_, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center text-muted-foreground space-y-1 bg-secondary/20"
                  >
                    <Users className="h-6 w-6 opacity-40" />
                    <span className="text-xs font-medium">Oyuncu Bekleniyor...</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <Card className="p-4 bg-card border-border flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {currentUser.isHost
                  ? "Tüm oyuncular hazır olduğunda düelloyu başlatabilirsiniz."
                  : "Hazır olduğunuzda 'Hazır Ol' butonuna basarak kurucuyu bekleyin."}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant={currentUser.isReady ? "secondary" : "brand"}
                  onClick={handleToggleReady}
                  className="font-semibold h-11 px-6"
                >
                  {currentUser.isReady ? "Hazır Değilim" : "Hazır Ol"}
                </Button>

                {currentUser.isHost && (
                  <Button
                    variant="brand"
                    disabled={isGeneratingMatch || activeLobby.players.some(p => !p.isReady)}
                    onClick={handleStartBattle}
                    className="gap-2 font-bold h-11 px-8 shadow-md"
                  >
                    {isGeneratingMatch ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sorular Sentezleniyor...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Düelloyu Başlat
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* ── 3. LIVE QUIZ BATTLE MATCH VIEW ───────────────────── */}
        {viewMode === "match" && currentQ && (
          <div className="space-y-6 animate-fade-in">
            {!matchFinished ? (
              <Card className="p-6 sm:p-8 space-y-6 shadow-elevated">
                {/* Match Top Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Badge variant="brand" className="font-mono text-xs">
                      Soru {currentQIndex + 1} / {battleQuestions.length}
                    </Badge>
                    <span className="text-sm font-semibold text-foreground">{currentQ.topic}</span>
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-2 font-mono font-bold text-lg text-warning">
                    <Timer className="h-5 w-5" />
                    <span>{matchTimer}s</span>
                  </div>
                </div>

                <Progress value={((currentQIndex + 1) / battleQuestions.length) * 100} className="h-2" />

                {/* Question Statement */}
                <div className="space-y-6">
                  <div className="text-xl sm:text-2xl font-semibold text-foreground leading-relaxed">
                    {currentQ.question}
                  </div>

                  {/* Options */}
                  <div className="space-y-3 pt-2">
                    {currentQ.options.map((opt) => {
                      const isSelected = selectedAnswer === opt.id;
                      let optionStyle = "border-border bg-card hover:bg-secondary text-foreground";

                      if (selectedAnswer !== null) {
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
                          disabled={selectedAnswer !== null}
                          onClick={() => handleAnswer(opt.id)}
                          className={`w-full p-4 sm:p-5 rounded-xl border text-left text-base transition-all flex items-center justify-between ${optionStyle}`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="h-8 w-8 rounded-md flex items-center justify-center font-mono font-bold text-sm bg-secondary border border-border">
                              {opt.id}
                            </span>
                            <span>{opt.text}</span>
                          </div>

                          {selectedAnswer !== null && opt.isCorrect && (
                            <span className="text-sm text-success font-bold flex items-center gap-1">
                              <Check className="h-4 w-4" /> Doğru
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Score Bar */}
                <div className="pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Puanınız: <span className="text-primary font-bold">{currentUser.score || 0} XP</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Hızlı yanıtlar ekstra bonus kazandırır!
                  </span>
                </div>
              </Card>
            ) : (
              /* Match Finished Results */
              <Card className="p-8 sm:p-12 text-center space-y-8 animate-fade-in shadow-elevated">
                <div className="h-20 w-20 rounded-full bg-warning/15 text-warning flex items-center justify-center mx-auto">
                  <Trophy className="h-10 w-10" />
                </div>

                <div>
                  <Badge variant="success" className="mb-2 px-3 py-1">
                    Düello Tamamlandı
                  </Badge>
                  <h2 className="text-3xl font-bold text-foreground">
                    Tebrikler, Zafer Sizin!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Toplam Puanınız: <span className="font-bold text-primary">{currentUser.score} XP</span> (+35 ELO Kazanıldı)
                  </p>
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                  <Button
                    variant="brand"
                    size="lg"
                    onClick={() => setViewMode("lobby")}
                    className="font-semibold px-8"
                  >
                    Lobiye Dön
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setViewMode("list")}
                    className="font-semibold px-6"
                  >
                    Oda Listesi
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ── 4. ADVANCED ROOM CREATION MODAL ────────────────── */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-2xl bg-card border-border shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-primary font-bold text-lg">
                  <Swords className="h-5 w-5" />
                  Gelişmiş Özel Düello Odası Oluştur
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Kapat
                </button>
              </div>

              <form onSubmit={handleCreateRoomSubmit} className="space-y-5">
                {/* 1. Category Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    1. Müfredat / Alan Seçimi
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setCategory("academic")}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                        category === "academic"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Akademik Sınavlar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("language")}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                        category === "language"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Dil Öğrenimi (CEFR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("coding_tech")}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                        category === "coding_tech"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Yazılım &amp; Kodlama
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategory("custom_hub")}
                      className={`p-3 rounded-lg border text-xs font-semibold transition-all ${
                        category === "custom_hub"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-secondary"
                      }`}
                    >
                      Kayıtlı Kütüphanem
                    </button>
                  </div>
                </div>

                {/* 2. Category Fields */}
                {category === "academic" && (
                  <div className="space-y-3 p-4 rounded-xl bg-secondary/30 border border-border">
                    {/* Country Selector */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Ülke / Eğitim Sistemi</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {(Object.keys(GRANULAR_CURRICULUM_DATA) as Array<"TR" | "US" | "UK" | "DE" | "GLOBAL_IB">).map((code) => (
                          <button
                            key={code}
                            type="button"
                            onClick={() => setCountryCode(code)}
                            className={`p-2 rounded-md border text-xs font-semibold truncate ${
                              countryCode === code ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground"
                            }`}
                          >
                            {GRANULAR_CURRICULUM_DATA[code].countryName}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Sınıf</label>
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                        >
                          {currentCurriculum.grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Ders Türü</label>
                        <select
                          value={subjectType}
                          onChange={(e) => setSubjectType(e.target.value as any)}
                          className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                        >
                          <option value="Genel Dersler">Genel Dersler</option>
                          <option value="Seçmeli Dersler">Seçmeli Dersler</option>
                          <option value="Bölüm / Meslek / Uzmanlık">Bölüm / Meslek / Uzmanlık</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Ders Adı</label>
                        <select
                          value={subjectName}
                          onChange={(e) => setSubjectName(e.target.value)}
                          className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs font-semibold text-primary"
                        >
                          {(currentCurriculum.categories[subjectType] || []).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Spesifik Konu / Ünite (Opsiyonel)</label>
                      <Input
                        placeholder="Örn: Newton Yasaları, Limit ve Süreklilik..."
                        value={specificTopic}
                        onChange={(e) => setSpecificTopic(e.target.value)}
                        className="h-10 text-xs"
                      />
                    </div>
                  </div>
                )}

                {category === "language" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Öğrenilen Dil</label>
                      <select
                        value={selectedLanguageTarget}
                        onChange={(e) => setSelectedLanguageTarget(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                      >
                        {LANGUAGE_TARGETS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">CEFR Seviyesi</label>
                      <select
                        value={selectedCefrLevel}
                        onChange={(e) => setSelectedCefrLevel(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                      >
                        {(LANGUAGE_TARGETS.find(l => l.id === selectedLanguageTarget)?.levels || []).map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.code} - {lvl.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {category === "coding_tech" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-secondary/30 border border-border">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Programlama Dili</label>
                      <select
                        value={selectedCodingLang}
                        onChange={(e) => setSelectedCodingLang(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                      >
                        {CODING_LANGUAGES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Geliştirici Düzeyi</label>
                      <select
                        value={selectedCodingLevel}
                        onChange={(e) => setSelectedCodingLevel(e.target.value)}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs"
                      >
                        {(CODING_LANGUAGES.find(c => c.id === selectedCodingLang)?.levels || []).map(lvl => (
                          <option key={lvl.id} value={lvl.id}>{lvl.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {category === "custom_hub" && (
                  <div className="space-y-2 p-4 rounded-xl bg-secondary/30 border border-border">
                    <label className="text-xs font-medium text-foreground">Kayıtlı Çalışma Setiniz</label>
                    <select
                      value={selectedSetId || ""}
                      onChange={(e) => setSelectedSetId(e.target.value)}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-xs font-medium"
                    >
                      {savedSets.map(s => <option key={s.id} value={s.id}>{s.title} ({s.type.toUpperCase()})</option>)}
                    </select>
                  </div>
                )}

                {/* 3. UNIVERSAL DÜELLO MATERYAL KAYNAĞI SEÇİMİ (TÜM KATEGORİLER İÇİN YOUTUBE / PDF / METİN) */}
                <div className="space-y-3 p-4 rounded-xl bg-card border border-primary/30 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      Düello Soru Kaynağı Materyali (İsteğe Bağlı):
                    </label>
                    <span className="text-[11px] text-muted-foreground">İlgili materyali bağlayabilirsiniz</span>
                  </div>

                  {/* Material Source Mode Tabs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-secondary rounded-lg">
                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("standard")}
                      className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        materialSourceMode === "standard" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Müfredat / Konu
                    </button>

                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("youtube")}
                      className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        materialSourceMode === "youtube" ? "bg-card text-red-500 shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Youtube className="h-3.5 w-3.5 text-red-500" />
                      YouTube Linki
                    </button>

                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("pdf")}
                      className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        materialSourceMode === "pdf" ? "bg-card text-primary shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <FileText className="h-3.5 w-3.5 text-primary" />
                      PDF Yükle
                    </button>

                    <button
                      type="button"
                      onClick={() => setMaterialSourceMode("text")}
                      className={`py-1.5 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        materialSourceMode === "text" ? "bg-card text-warning shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Type className="h-3.5 w-3.5 text-warning" />
                      Serbest Metin
                    </button>
                  </div>

                  {/* Material Specific Inputs */}
                  {materialSourceMode === "youtube" && (
                    <div className="space-y-1.5 pt-1 animate-fade-in">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Youtube className="h-4 w-4 text-red-500" />
                        YouTube Video URL (Altyazı / Transkript Otomatik Alınır)
                      </label>
                      <Input
                        type="url"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={directYoutubeUrl}
                        onChange={(e) => setDirectYoutubeUrl(e.target.value)}
                        className="h-10 text-xs font-mono"
                        required
                      />
                    </div>
                  )}

                  {materialSourceMode === "pdf" && (
                    <div className="space-y-2 pt-1 animate-fade-in">
                      <div className="border border-dashed border-border rounded-lg p-3.5 text-center bg-secondary/30 hover:border-primary/50 transition-colors">
                        <Upload className="h-5 w-5 text-primary mx-auto mb-1" />
                        <label className="cursor-pointer">
                          <span className="text-xs font-semibold text-primary hover:underline">Bir PDF seçin</span>
                          <span className="text-xs text-muted-foreground"> veya buraya sürükleyin</span>
                          <input type="file" accept=".pdf,.txt" onChange={handlePdfUpload} className="hidden" />
                        </label>
                        {directPdfFileName && (
                          <div className="mt-1.5 text-xs font-mono text-foreground font-semibold flex items-center justify-center gap-1">
                            <FileText className="h-3.5 w-3.5 text-primary" /> {directPdfFileName}
                          </div>
                        )}
                      </div>
                      <textarea
                        rows={3}
                        value={directPdfContent}
                        onChange={(e) => setDirectPdfContent(e.target.value)}
                        placeholder="PDF'ten çıkarılan ders notları veya ek açıklamalar..."
                        className="w-full p-2.5 rounded-md border border-input bg-background text-xs font-mono focus:ring-1 focus:ring-ring focus:outline-none"
                      />
                    </div>
                  )}

                  {materialSourceMode === "text" && (
                    <div className="space-y-1.5 pt-1 animate-fade-in">
                      <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                        <Type className="h-4 w-4 text-warning" />
                        Ders Notu / Transkript Metni
                      </label>
                      <textarea
                        rows={4}
                        value={directTextContent}
                        onChange={(e) => setDirectTextContent(e.target.value)}
                        placeholder="Ders notlarınızı, transkripti veya kitap özetinizi buraya yapıştırın..."
                        className="w-full p-2.5 rounded-md border border-input bg-background text-xs focus:ring-1 focus:ring-ring focus:outline-none"
                        required
                      />
                    </div>
                  )}
                </div>

                {/* 4. Room Privacy & Rules */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-border">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Oda Gizliliği</label>
                    <select
                      value={privacy}
                      onChange={(e) => setPrivacy(e.target.value as any)}
                      className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                    >
                      <option value="public">Açık (Herkese Görünür)</option>
                      <option value="private">Gizli (Sadece Kod İle)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Kapasite</label>
                    <select
                      value={maxPlayers}
                      onChange={(e) => setMaxPlayers(Number(e.target.value) as any)}
                      className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                    >
                      <option value={2}>2 Kişi (1v1)</option>
                      <option value={3}>3 Kişi</option>
                      <option value={4}>4 Kişi (Standart)</option>
                      <option value={8}>8 Kişi (Grup)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Soru Sayısı</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value) as any)}
                      className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                    >
                      <option value={5}>5 Soru</option>
                      <option value={10}>10 Soru</option>
                      <option value={15}>15 Soru</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-foreground">Soru Başı Süre</label>
                    <select
                      value={timePerQuestion}
                      onChange={(e) => setTimePerQuestion(Number(e.target.value) as any)}
                      className="w-full h-10 px-2.5 rounded-md border border-input bg-background text-xs"
                    >
                      <option value={15}>15 Saniye (Hızlı)</option>
                      <option value={30}>30 Saniye (Standart)</option>
                      <option value={45}>45 Saniye (Geniş)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setIsCreateModalOpen(false)} className="h-10 text-xs">
                    İptal
                  </Button>
                  <Button type="submit" variant="brand" className="h-10 px-6 font-semibold text-xs gap-2">
                    <Plus className="h-4 w-4" />
                    Odayı Oluştur &amp; Lobiye Geç
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
