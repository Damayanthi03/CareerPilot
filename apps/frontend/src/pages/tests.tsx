import { useState, useEffect, useCallback } from "react";
import {
  FlaskConical, CheckCircle2, Clock, Trophy, ArrowRight, Lock,
  ChevronLeft, RotateCcw, TimerOff, AlertTriangle, CheckCheck, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type Question = { q: string; options: string[]; correct: number };
type QuizState = "list" | "quiz" | "results";

const QUIZ_BANK: Record<number, { duration: number; questions: Question[] }> = {
  1: {
    duration: 1500,
    questions: [
      {
        q: "A train travels 120 km in 2 hours. What is its average speed?",
        options: ["40 km/h", "60 km/h", "80 km/h", "100 km/h"],
        correct: 1,
      },
      {
        q: "What is the next number in the series: 2, 6, 18, 54, ___?",
        options: ["108", "162", "72", "216"],
        correct: 1,
      },
      {
        q: "If 5 workers can complete a job in 12 days, how many days will 10 workers take?",
        options: ["24 days", "8 days", "6 days", "10 days"],
        correct: 2,
      },
      {
        q: "Find the odd one out: 3, 5, 7, 9, 11",
        options: ["3", "9", "7", "11"],
        correct: 1,
      },
      {
        q: "A rectangle has a length of 12 cm and width of 8 cm. What is its area?",
        options: ["80 cm²", "96 cm²", "40 cm²", "64 cm²"],
        correct: 1,
      },
      {
        q: "If MANGO is coded as OCPIQ, how is APPLE coded?",
        options: ["CRRNG", "CRRNH", "BQQMF", "DSSOH"],
        correct: 0,
      },
      {
        q: "A bag contains 3 red and 2 blue balls. What is the probability of picking a red ball?",
        options: ["2/5", "3/2", "3/5", "1/5"],
        correct: 2,
      },
      {
        q: "Which of the following is NOT a prime number?",
        options: ["17", "23", "27", "31"],
        correct: 2,
      },
      {
        q: "If 2x + 5 = 17, what is the value of x?",
        options: ["5", "6", "7", "8"],
        correct: 1,
      },
      {
        q: "Complete the analogy: Doctor : Hospital :: Teacher : ___",
        options: ["Student", "School", "Book", "Library"],
        correct: 1,
      },
    ],
  },
  2: {
    duration: 900,
    questions: [
      {
        q: "When starting a new project, you typically:",
        options: [
          "Dive in immediately and figure it out as you go",
          "Plan thoroughly before taking any action",
          "Research briefly then start with a rough plan",
          "Wait for detailed instructions from others",
        ],
        correct: 2,
      },
      {
        q: "In a team setting, you prefer to:",
        options: [
          "Take a leadership role and direct others",
          "Collaborate equally and share decisions",
          "Support the team as a contributor",
          "Work independently with minimal team interaction",
        ],
        correct: 1,
      },
      {
        q: "When facing a tight deadline, you:",
        options: [
          "Panic and find it hard to focus",
          "Thrive under pressure and become more productive",
          "Break the task into steps and tackle it methodically",
          "Ask for an extension whenever possible",
        ],
        correct: 2,
      },
      {
        q: "How do you handle constructive criticism of your work?",
        options: [
          "Take it personally and feel discouraged",
          "Ignore it and stick to your approach",
          "Listen carefully and use it to improve",
          "Argue your point of view",
        ],
        correct: 2,
      },
      {
        q: "Which work environment do you find most productive?",
        options: [
          "Quiet, solo workspace with no interruptions",
          "Open collaborative environment with frequent interaction",
          "Flexible hybrid — sometimes solo, sometimes team",
          "Structured with clear hierarchy and defined roles",
        ],
        correct: 2,
      },
      {
        q: "When you make a mistake at work, you:",
        options: [
          "Feel very guilty and dwell on it",
          "Immediately blame external factors",
          "Acknowledge it, learn from it, and move on",
          "Try to hide it to avoid embarrassment",
        ],
        correct: 2,
      },
      {
        q: "Your approach to learning new skills is:",
        options: [
          "You prefer formal training programs",
          "Self-directed — you learn by doing and exploring",
          "You learn best from mentors and peers",
          "You avoid new skills unless absolutely required",
        ],
        correct: 1,
      },
      {
        q: "How do you prioritize tasks when everything seems urgent?",
        options: [
          "Do the easiest ones first to get quick wins",
          "Tackle the hardest tasks first",
          "Assess impact and deadline, then prioritize",
          "Do tasks in the order they were received",
        ],
        correct: 2,
      },
      {
        q: "How important is work-life balance to you?",
        options: [
          "Not important — career comes first",
          "Somewhat important but I often sacrifice personal time",
          "Very important — I set clear boundaries",
          "I haven't really thought about it",
        ],
        correct: 2,
      },
      {
        q: "When you disagree with a colleague's idea, you:",
        options: [
          "Stay quiet to avoid conflict",
          "Express your disagreement loudly",
          "Share your perspective respectfully with supporting reasons",
          "Complain about it to others behind their back",
        ],
        correct: 2,
      },
    ],
  },
  3: {
    duration: 1800,
    questions: [
      {
        q: "What does 'API' stand for in software development?",
        options: [
          "Application Programming Interface",
          "Advanced Protocol Integration",
          "Automated Program Instruction",
          "Application Process Index",
        ],
        correct: 0,
      },
      {
        q: "Which of the following is a version control system?",
        options: ["Docker", "Git", "Nginx", "Jenkins"],
        correct: 1,
      },
      {
        q: "In machine learning, what is 'overfitting'?",
        options: [
          "When the model is too simple to capture patterns",
          "When the model performs well on training but poorly on new data",
          "When the model takes too long to train",
          "When the training dataset is too large",
        ],
        correct: 1,
      },
      {
        q: "What is the primary purpose of a 'database index'?",
        options: [
          "To back up data automatically",
          "To speed up data retrieval operations",
          "To encrypt data for security",
          "To organize data into tables",
        ],
        correct: 1,
      },
      {
        q: "Which HTTP status code indicates 'Not Found'?",
        options: ["200", "301", "404", "500"],
        correct: 2,
      },
      {
        q: "What does 'SQL' stand for?",
        options: [
          "Standard Query Layout",
          "Structured Query Language",
          "System Query Logic",
          "Secure Queue Layer",
        ],
        correct: 1,
      },
      {
        q: "In Python, what data type is the result of: type(3.14)?",
        options: ["int", "str", "float", "double"],
        correct: 2,
      },
      {
        q: "What is the main advantage of cloud computing over on-premise servers?",
        options: [
          "It's always faster",
          "It requires no internet connection",
          "It offers scalability and pay-as-you-go pricing",
          "It provides more security by default",
        ],
        correct: 2,
      },
      {
        q: "In cybersecurity, what is 'phishing'?",
        options: [
          "A type of encryption algorithm",
          "Fraudulent attempts to steal credentials through deception",
          "A method of network performance testing",
          "A firewall configuration technique",
        ],
        correct: 1,
      },
      {
        q: "What does 'UI' stand for in software design?",
        options: [
          "Unified Infrastructure",
          "User Integration",
          "User Interface",
          "Unified Instruction",
        ],
        correct: 2,
      },
    ],
  },
  4: {
    duration: 1200,
    questions: [
      {
        q: "Which sentence is grammatically correct?",
        options: [
          "Each of the students have submitted their assignments.",
          "Each of the students has submitted their assignment.",
          "Each of the students has submitted their assignments.",
          "Each of the student has submitted their assignments.",
        ],
        correct: 2,
      },
      {
        q: "Which email opening is most professional for a first contact?",
        options: [
          "Hey there!",
          "Yo, what's up?",
          "Dear Mr. / Ms. [Last Name],",
          "Hiya [First Name],",
        ],
        correct: 2,
      },
      {
        q: "What is the best way to convey urgency in a professional email without being rude?",
        options: [
          "WRITE IN ALL CAPS to show importance",
          "Add multiple exclamation marks!!!",
          "Politely mention the deadline and its impact",
          "Send the same email multiple times",
        ],
        correct: 2,
      },
      {
        q: "In professional writing, what does 'concise' mean?",
        options: [
          "Writing in a very formal tone",
          "Expressing ideas clearly using as few words as needed",
          "Using complex vocabulary to show expertise",
          "Including all possible details",
        ],
        correct: 1,
      },
      {
        q: "Choose the sentence with correct punctuation:",
        options: [
          "The meeting is on Monday however, we can reschedule.",
          "The meeting is on Monday; however, we can reschedule.",
          "The meeting is on Monday however we can reschedule.",
          "The meeting is on Monday, however we can reschedule.",
        ],
        correct: 1,
      },
      {
        q: "When listening actively in a meeting, you should:",
        options: [
          "Interrupt to show you understand",
          "Check your phone while others speak",
          "Maintain eye contact and nod to show engagement",
          "Start preparing your response while others talk",
        ],
        correct: 2,
      },
      {
        q: "Which word best replaces 'utilize' for simpler, clearer writing?",
        options: ["employ", "use", "leverage", "implement"],
        correct: 1,
      },
      {
        q: "A colleague misunderstood your email and did the wrong task. What's the best response?",
        options: [
          "Blame them publicly for not reading properly",
          "Apologize for any confusion and clarify the task clearly",
          "Ignore it and redo the task yourself",
          "Forward the original email and say 'read it again'",
        ],
        correct: 1,
      },
      {
        q: "What is the purpose of an 'executive summary' in a report?",
        options: [
          "To list all references and sources",
          "To provide a brief overview of the key points for busy readers",
          "To include all technical details of the report",
          "To list the team members who contributed",
        ],
        correct: 1,
      },
      {
        q: "Which closing is most appropriate for a formal business email?",
        options: [
          "Cheers,",
          "TTYL,",
          "Yours sincerely,",
          "Bye for now,",
        ],
        correct: 2,
      },
    ],
  },
};

const testCategories = [
  {
    id: 1,
    title: "Technical Aptitude",
    description: "Assess your problem-solving, logical reasoning, and quantitative skills.",
    duration: "25 min",
    questions: 10,
    difficulty: "Medium",
    color: "from-blue-500 to-indigo-600",
    badge: "Available",
    badgeVariant: "outline" as const,
  },
  {
    id: 2,
    title: "Personality & Work Style",
    description: "Understand your work preferences, leadership style, and team dynamics.",
    duration: "15 min",
    questions: 10,
    difficulty: "Easy",
    color: "from-violet-500 to-purple-600",
    badge: "Available",
    badgeVariant: "outline" as const,
  },
  {
    id: 3,
    title: "Domain Knowledge",
    description: "Test your expertise in core technology concepts: APIs, databases, ML, and more.",
    duration: "30 min",
    questions: 10,
    difficulty: "Hard",
    color: "from-emerald-500 to-teal-600",
    badge: "Available",
    badgeVariant: "outline" as const,
  },
  {
    id: 4,
    title: "Communication Skills",
    description: "Evaluate written communication, comprehension, and professional language use.",
    duration: "20 min",
    questions: 10,
    difficulty: "Medium",
    color: "from-amber-500 to-orange-600",
    badge: "Available",
    badgeVariant: "outline" as const,
  },
];

const difficultyColor: Record<string, string> = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
  Hard: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Tests() {
  const [quizState, setQuizState] = useState<QuizState>("list");
  const [activeTestId, setActiveTestId] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [scores, setScores] = useState<Record<number, number>>({});
  const [showConfirm, setShowConfirm] = useState(false);

  const quiz = activeTestId ? QUIZ_BANK[activeTestId] : null;
  const test = testCategories.find((t) => t.id === activeTestId);
  const totalQ = quiz?.questions.length ?? 0;
  const answeredCount = Object.keys(answers).length;

  const submitQuiz = useCallback(() => {
    if (!quiz || activeTestId === null) return;
    const correct = quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
    const score = Math.round((correct / quiz.questions.length) * 100);
    setScores((prev) => ({ ...prev, [activeTestId]: score }));
    setQuizState("results");
  }, [quiz, activeTestId, answers]);

  useEffect(() => {
    if (quizState !== "quiz") return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, timeLeft, submitQuiz]);

  function startTest(id: number) {
    const q = QUIZ_BANK[id];
    if (!q) return;
    setActiveTestId(id);
    setCurrentQ(0);
    setAnswers({});
    setTimeLeft(q.duration);
    setShowConfirm(false);
    setQuizState("quiz");
  }

  function selectAnswer(qIdx: number, optIdx: number) {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  function goBack() {
    setQuizState("list");
    setActiveTestId(null);
    setAnswers({});
    setShowConfirm(false);
  }

  if (quizState === "quiz" && quiz && test) {
    const question = quiz.questions[currentQ];
    const isLast = currentQ === totalQ - 1;
    const isTimeLow = timeLeft <= 60;
    const progressPct = ((currentQ + 1) / totalQ) * 100;

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => setShowConfirm(true)}
          >
            <ChevronLeft className="h-4 w-4" /> Exit Test
          </Button>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {answeredCount}/{totalQ} answered
            </span>
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm tabular-nums",
              isTimeLow
                ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse"
                : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
            )}>
              <Clock className="h-3.5 w-3.5" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Exit confirm */}
        {showConfirm && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Exit test?</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Your progress will be lost.</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => setShowConfirm(false)}>Keep Going</Button>
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white" onClick={goBack}>Exit</Button>
              </div>
            </div>
          </div>
        )}

        {/* Test title + progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-muted-foreground">{test.title}</p>
            <span className="text-sm font-medium">
              Question <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentQ + 1}</span> of {totalQ}
            </span>
          </div>
          <Progress value={progressPct} className="h-2" />
        </div>

        {/* Question card */}
        <Card className="shadow-md border-indigo-100 dark:border-indigo-900">
          <CardContent className="pt-6 pb-6">
            <p className="text-lg font-semibold leading-relaxed mb-6">{question.q}</p>

            <div className="space-y-3">
              {question.options.map((option, idx) => {
                const isSelected = answers[currentQ] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(currentQ, idx)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 text-sm font-medium",
                      isSelected
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                        : "border-border bg-background hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQ((q) => Math.max(0, q - 1))}
            disabled={currentQ === 0}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          {isLast ? (
            <Button
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={submitQuiz}
            >
              <CheckCheck className="h-4 w-4" />
              Submit Test
            </Button>
          ) : (
            <Button
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setCurrentQ((q) => Math.min(totalQ - 1, q + 1))}
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Question dots */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {quiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQ(i)}
              className={cn(
                "h-7 w-7 rounded-lg text-xs font-bold transition-all",
                i === currentQ
                  ? "bg-indigo-600 text-white shadow-sm scale-110"
                  : answers[i] !== undefined
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (quizState === "results" && quiz && test && activeTestId !== null) {
    const score = scores[activeTestId] ?? 0;
    const correct = Math.round((score / 100) * totalQ);
    const wrong = totalQ - correct;
    const passed = score >= 60;

    return (
      <div className="max-w-xl mx-auto space-y-6">
        {/* Result header */}
        <div className="text-center space-y-3">
          <div className={cn(
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white text-2xl font-extrabold shadow-lg",
            passed ? "bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30" : "bg-gradient-to-br from-rose-500 to-pink-600 shadow-rose-500/30"
          )}>
            {passed ? <Trophy className="h-9 w-9" /> : <TimerOff className="h-9 w-9" />}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {passed ? "Great Job!" : "Keep Practising!"}
            </h1>
            <p className="text-muted-foreground mt-1">{test.title} — Results</p>
          </div>
        </div>

        {/* Score circle card */}
        <Card className={cn("border-2", passed ? "border-emerald-200 dark:border-emerald-800" : "border-rose-200 dark:border-rose-800")}>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center justify-center mb-6">
              <div className={cn(
                "relative flex h-32 w-32 items-center justify-center rounded-full border-8",
                passed ? "border-emerald-200 dark:border-emerald-800" : "border-rose-200 dark:border-rose-800"
              )}>
                <div>
                  <p className={cn("text-4xl font-extrabold tabular-nums text-center", passed ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500")}>{score}%</p>
                  <p className="text-xs text-muted-foreground text-center mt-0.5">Score</p>
                </div>
              </div>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">Total</p>
                <p className="text-xl font-bold">{totalQ}</p>
              </div>
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{correct}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="rounded-xl bg-rose-50 dark:bg-rose-900/20 p-3">
                <XCircle className="h-4 w-4 text-rose-500 mx-auto mb-1" />
                <p className="text-xl font-bold text-rose-500">{wrong}</p>
                <p className="text-xs text-muted-foreground">Wrong</p>
              </div>
            </div>

            <div className="mt-4">
              <Progress value={score} className="h-3" />
              <div className="flex justify-between text-xs mt-1.5 text-muted-foreground">
                <span>0%</span>
                <span className="font-medium text-foreground">Pass mark: 60%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers review */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Review Answers</h3>
          {quiz.questions.map((q, i) => {
            const selected = answers[i];
            const isCorrect = selected === q.correct;
            return (
              <div key={i} className={cn(
                "rounded-xl border p-4 text-sm",
                isCorrect ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10" : "border-rose-200 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-900/10"
              )}>
                <div className="flex items-start gap-2 mb-2">
                  {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />}
                  <p className="font-medium leading-snug">{q.q}</p>
                </div>
                {!isCorrect && (
                  <div className="ml-6 space-y-1">
                    {selected !== undefined && (
                      <p className="text-xs text-rose-600 dark:text-rose-400">
                        Your answer: <span className="font-semibold">{q.options[selected]}</span>
                      </p>
                    )}
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">
                      Correct: <span className="font-semibold">{q.options[q.correct]}</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2" onClick={goBack}>
            <ChevronLeft className="h-4 w-4" /> All Tests
          </Button>
          <Button className="flex-1 gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => startTest(activeTestId)}>
            <RotateCcw className="h-4 w-4" /> Retake Test
          </Button>
        </div>
      </div>
    );
  }

  const completedIds = Object.keys(scores).map(Number);
  const completed = completedIds.length;
  const total = testCategories.filter((t) => !("locked" in t && t.locked)).length;
  const avgScore = completed > 0
    ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / completed)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/25">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Skill Tests</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Complete tests to strengthen your profile and discover where you excel.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Overall Progress</p>
            <div className="flex items-center gap-2">
              <Progress value={(completed / total) * 100} className="w-32 h-2" />
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{completed}/{total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "Avg Score", value: completed > 0 ? `${avgScore}%` : "—", icon: Trophy, color: "text-amber-600 dark:text-amber-400" },
          { label: "Questions", value: completed * 10, icon: Clock, color: "text-indigo-600 dark:text-indigo-400" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-4 pb-4">
              <stat.icon className={`h-5 w-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {testCategories.map((test) => {
          const isLocked = "locked" in test && test.locked;
          const isDone = completedIds.includes(test.id);
          const score = scores[test.id];
          return (
            <Card
              key={test.id}
              className={cn(
                "relative overflow-hidden transition-all duration-200",
                isLocked ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"
              )}
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${test.color}`} />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{test.title}</CardTitle>
                  <Badge variant={isDone ? "secondary" : test.badgeVariant} className="shrink-0 text-xs">
                    {isDone ? "Completed" : test.badge}
                  </Badge>
                </div>
                <CardDescription className="text-xs leading-relaxed">{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{test.duration}</span>
                  <span>{test.questions} questions</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${difficultyColor[test.difficulty]}`}>
                    {test.difficulty}
                  </span>
                </div>

                {isDone && score !== undefined && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Last Score</span>
                      <span className={cn("font-semibold", score >= 60 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500")}>{score}%</span>
                    </div>
                    <Progress value={score} className="h-1.5" />
                  </div>
                )}

                {isLocked ? (
                  <Button variant="outline" size="sm" disabled className="w-full gap-2 text-xs">
                    <Lock className="h-3.5 w-3.5" /> Coming Soon
                  </Button>
                ) : isDone ? (
                  <Button variant="outline" size="sm" className="w-full gap-2 text-xs" onClick={() => startTest(test.id)}>
                    <RotateCcw className="h-3.5 w-3.5" /> Retake Test
                  </Button>
                ) : (
                  <Button size="sm" className="w-full gap-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white" onClick={() => startTest(test.id)}>
                    Start Test <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
