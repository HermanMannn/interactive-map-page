import { useEffect, useState, useCallback } from "react";
import { Delete } from "lucide-react";

const WORDS = [
  { word: "CANAAN", hint: "Ancient name for the region." },
  { word: "JUDEA", hint: "Historical name for the hilly southern part." },
  { word: "OLIVE", hint: "Symbol of Palestinian rootedness and agriculture." },
  { word: "WATER", hint: "Used in 'watermelon' as a symbol of resistance." },
  { word: "LANDS", hint: "Refers to the occupied territories or 'Holy Land'." },
  { word: "ACRE", hint: "Historic city in northern Palestine." },
  { word: "HAIFA", hint: "Port city in historic Palestine." },
  { word: "AMMAN", hint: "Capital of Jordan, historically linked to the region." },
  { word: "ARABS", hint: "Demographic group native to the area." },
];

// Filter to 5-letter words only for classic wordle (Canaan is 6, Acre is 4)
const PLAYABLE = WORDS.filter((w) => w.word.length === 5);

const MAX_GUESSES = 6;
const KEYBOARD_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function pickRandom() {
  return PLAYABLE[Math.floor(Math.random() * PLAYABLE.length)];
}

function evaluate(guess, target) {
  const result = Array(guess.length).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");

  // First pass: correct
  guessArr.forEach((ch, i) => {
    if (ch === targetArr[i]) {
      result[i] = "correct";
      targetArr[i] = null;
    }
  });
  // Second pass: present
  guessArr.forEach((ch, i) => {
    if (result[i] === "correct") return;
    const idx = targetArr.indexOf(ch);
    if (idx !== -1) {
      result[i] = "present";
      targetArr[idx] = null;
    }
  });
  return result;
}

const tileClass = (state) => {
  if (state === "correct") return "bg-green-600 text-white border-green-600";
  if (state === "present") return "bg-yellow-500 text-white border-yellow-500";
  if (state === "absent") return "bg-muted text-muted-foreground border-muted";
  return "bg-card text-foreground border-border";
};

const keyClass = (state) => {
  if (state === "correct") return "bg-green-600 text-white";
  if (state === "present") return "bg-yellow-500 text-white";
  if (state === "absent") return "bg-muted/60 text-muted-foreground";
  return "bg-card text-foreground hover:bg-accent/40";
};

export default function Wordle() {
  const [target, setTarget] = useState(() => pickRandom());
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [status, setStatus] = useState("playing"); // playing | won | lost
  const [shake, setShake] = useState(false);

  const wordLen = target.word.length;

  const reset = () => {
    setTarget(pickRandom());
    setGuesses([]);
    setCurrent("");
    setStatus("playing");
  };

  const submit = useCallback(() => {
    if (current.length !== wordLen) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    const next = [...guesses, current];
    setGuesses(next);
    setCurrent("");
    if (current === target.word) setStatus("won");
    else if (next.length >= MAX_GUESSES) setStatus("lost");
  }, [current, guesses, target.word, wordLen]);

  const handleKey = useCallback(
    (key) => {
      if (status !== "playing") return;
      if (key === "ENTER") return submit();
      if (key === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(key) && current.length < wordLen) {
        setCurrent((c) => c + key);
      }
    },
    [current.length, status, submit, wordLen],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") handleKey("ENTER");
      else if (e.key === "Backspace") handleKey("BACK");
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey]);

  // Build keyboard letter states
  const letterStates = {};
  guesses.forEach((g) => {
    const ev = evaluate(g, target.word);
    g.split("").forEach((ch, i) => {
      const prev = letterStates[ch];
      const next = ev[i];
      const rank = { correct: 3, present: 2, absent: 1 };
      if (!prev || rank[next] > rank[prev]) letterStates[ch] = next;
    });
  });

  const rows = Array.from({ length: MAX_GUESSES }, (_, r) => {
    if (r < guesses.length) {
      const g = guesses[r];
      const ev = evaluate(g, target.word);
      return g.split("").map((ch, i) => ({ ch, state: ev[i] }));
    }
    if (r === guesses.length) {
      return Array.from({ length: wordLen }, (_, i) => ({
        ch: current[i] || "",
        state: "empty",
        active: !!current[i],
      }));
    }
    return Array.from({ length: wordLen }, () => ({ ch: "", state: "empty" }));
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4 overflow-y-auto bg-background p-4 pr-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Palestine Wordle</h1>
        <p className="text-sm text-muted-foreground">
          Guess the {wordLen}-letter word — themed around Palestinian heritage.
        </p>
      </div>

      <div className={`flex flex-col gap-1.5 ${shake ? "animate-pulse" : ""}`}>
        {rows.map((row, r) => (
          <div key={r} className="flex gap-1.5">
            {row.map((tile, i) => (
              <div
                key={i}
                className={`flex h-12 w-12 items-center justify-center rounded border-2 text-xl font-bold uppercase transition-colors ${tileClass(
                  tile.state,
                )} ${tile.active ? "border-primary" : ""}`}
              >
                {tile.ch}
              </div>
            ))}
          </div>
        ))}
      </div>

      {status !== "playing" && (
        <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-card p-4 text-center">
          <p className="text-lg font-semibold text-foreground">
            {status === "won" ? "🎉 You got it!" : "😔 Out of guesses"}
          </p>
          <p className="text-sm text-muted-foreground">
            The word was <span className="font-bold text-foreground">{target.word}</span> —{" "}
            {target.hint}
          </p>
          <button
            onClick={reset}
            className="mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Play again
          </button>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-1.5">
        {KEYBOARD_ROWS.map((row, r) => (
          <div key={r} className="flex justify-center gap-1">
            {r === 2 && (
              <button
                onClick={() => handleKey("ENTER")}
                className="rounded bg-card px-3 text-xs font-bold text-foreground hover:bg-accent/40"
              >
                ENTER
              </button>
            )}
            {row.split("").map((k) => (
              <button
                key={k}
                onClick={() => handleKey(k)}
                className={`h-10 w-7 rounded text-sm font-bold transition-colors sm:w-8 ${keyClass(letterStates[k])}`}
              >
                {k}
              </button>
            ))}
            {r === 2 && (
              <button
                onClick={() => handleKey("BACK")}
                className="flex items-center rounded bg-card px-2 text-foreground hover:bg-accent/40"
              >
                <Delete className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
