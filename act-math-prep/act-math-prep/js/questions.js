// ============================================================
// ACT MATH PREP - Question Generator Engine
// All 20 topics, fully randomized numbers, ACT-style 4 choices
// ============================================================

const TOPICS = {
  functions: {
    label: "Functions",
    color: "#e74c3c",
    skills: ["Function Notation", "Transforming Functions", "Domain & Range", "Composite Functions", "Function Operations", "Inverse Functions"]
  },
  statistics: {
    label: "Statistics",
    color: "#e67e22",
    skills: ["Mean Median Mode", "Interpreting Venn Diagrams", "Standard Deviation & Range", "Expected Value"]
  },
  probability: {
    label: "Probability",
    color: "#f1c40f",
    skills: ["Basic Probability"]
  },
  triangleProperties: {
    label: "Triangle Properties",
    color: "#2ecc71",
    skills: ["Similar Triangles", "Sum of Angles in a Triangle", "Angle-Side Inequality Theorem", "Isosceles & Equilateral Triangles"]
  },
  solveForVariable: {
    label: "Solve for Variable",
    color: "#1abc9c",
    skills: ["Solving Equations for a Variable", "Solving Inequalities for a Variable"]
  },
  fractionsDecimals: {
    label: "Fractions & Decimals",
    color: "#3498db",
    skills: ["Operations with Fractions and Decimals", "Optimize Fractions"]
  },
  factoring: {
    label: "Factoring",
    color: "#9b59b6",
    skills: ["Factoring Quadratic Expressions", "Zeroes and Roots of a Function", "Quadratic Formula"]
  },
  systemsOfEquations: {
    label: "Systems of Equations",
    color: "#fd79a8",
    skills: ["Systems of Equations"]
  },
  circles: {
    label: "Circles",
    color: "#00b894",
    skills: ["Sector Area", "Arc Length", "Equation of a Circle", "Central & Inscribed Angles"]
  },
  lines: {
    label: "Lines",
    color: "#6c5ce7",
    skills: ["Slope Calculation", "Equation of a Line", "Parallel & Perpendicular Lines"]
  },
  numberProperties: {
    label: "Number Properties",
    color: "#d63031",
    skills: ["Rational and Irrational", "Multiples", "Factors", "Divisibility Rules", "Integer Properties"]
  },
  polynomials: {
    label: "Polynomials",
    color: "#0984e3",
    skills: ["FOIL", "Polynomial Arithmetic", "Special Binomial Expansion"]
  },
  trigSOHCAHTOA: {
    label: "Trig: SOH CAH TOA",
    color: "#00cec9",
    skills: ["SOHCAHTOA"]
  },
  complexNumbers: {
    label: "Complex Numbers",
    color: "#e17055",
    skills: ["Complex & Imaginary Numbers"]
  },
  coordinatePlane: {
    label: "Coordinate Plane",
    color: "#74b9ff",
    skills: ["(x,y) Coordinate Plane", "Distance Formula"]
  },
  unitConversion: {
    label: "Unit Conversion",
    color: "#55efc4",
    skills: ["Unit Conversion"]
  },
  ratios: {
    label: "Ratios",
    color: "#a29bfe",
    skills: ["Ratios"]
  },
  sequences: {
    label: "Sequences",
    color: "#fd7272",
    skills: ["Sequence Notation", "Arithmetic Sequence (Sum)", "Arithmetic Sequence (Nth Term)"]
  },
  area: {
    label: "Area",
    color: "#badc58",
    skills: ["Area"]
  },
  advancedTrig: {
    label: "Advanced Trigonometry",
    color: "#f9ca24",
    skills: ["The Unit Circle & Radians", "Trig Graph Vocabulary", "Trig Identities"]
  }
};

// ---- Utility helpers ----
function rInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function rChoice(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function simplifyFrac(n, d) { const g = gcd(Math.abs(n), Math.abs(d)); return [n/g, d/g]; }
function fracStr(n, d) { const [sn, sd] = simplifyFrac(n, d); return sd === 1 ? `${sn}` : `${sn}/${sd}`; }
function wrongChoices(correct, deltas, fmt) {
  return deltas.map(d => fmt ? fmt(correct + d) : correct + d);
}
function makeChoices(correct, wrongs) {
  const all = [correct, ...wrongs.slice(0,3)];
  return shuffle(all);
}

// ============================================================
// QUESTION GENERATORS — one per skill
// ============================================================

const GENERATORS = {

  // ---- FUNCTIONS ----
  "Function Notation": () => {
    const a = rInt(2, 8), b = rInt(1, 10), x = rInt(1, 6);
    const result = a * x * x - b * x + rInt(1, 5);
    const c = rInt(1, 5);
    const fx = a * x * x - b * x + c;
    const wrongs = [fx + rInt(1,4), fx - rInt(1,4), fx + rInt(5,9)];
    return {
      question: `If f(x) = ${a}x² − ${b}x + ${c}, what is f(${x})?`,
      choices: makeChoices(fx, wrongs),
      answer: fx,
      explanation: `Substitute x = ${x}: f(${x}) = ${a}(${x})² − ${b}(${x}) + ${c} = ${a*x*x} − ${b*x} + ${c} = ${fx}.`
    };
  },

  "Transforming Functions": () => {
    const transforms = [
      { desc: "shifts the graph up", type: "up" },
      { desc: "shifts the graph down", type: "down" },
      { desc: "shifts the graph right", type: "right" },
      { desc: "shifts the graph left", type: "left" },
    ];
    const t = rChoice(transforms);
    const k = rInt(2, 8);
    let newFunc, explanation;
    if (t.type === "up") { newFunc = `f(x) + ${k}`; explanation = `Adding ${k} outside f(x) shifts the graph up ${k} units.`; }
    else if (t.type === "down") { newFunc = `f(x) − ${k}`; explanation = `Subtracting ${k} outside f(x) shifts the graph down ${k} units.`; }
    else if (t.type === "right") { newFunc = `f(x − ${k})`; explanation = `Replacing x with (x − ${k}) inside f(x) shifts the graph right ${k} units.`; }
    else { newFunc = `f(x + ${k})`; explanation = `Replacing x with (x + ${k}) inside f(x) shifts the graph left ${k} units.`; }
    const choices = shuffle([newFunc, `f(x + ${k})`, `f(x − ${k})`, `f(x) − ${k}`].filter((v,i,a)=>a.indexOf(v)===i)).slice(0,4);
    if (!choices.includes(newFunc)) choices[3] = newFunc;
    return {
      question: `The graph of f(x) is transformed so that every point ${t.desc} by ${k} units. Which function represents this transformation?`,
      choices: shuffle(choices),
      answer: newFunc,
      explanation
    };
  },

  "Domain & Range": () => {
    const a = rInt(2, 8), b = rInt(1, 6);
    const types = [
      {
        question: `What is the domain of f(x) = √(x − ${b})?`,
        answer: `x ≥ ${b}`,
        wrongs: [`x > ${b}`, `x ≤ ${b}`, `x ≥ ${-b}`],
        explanation: `For a square root, the expression inside must be ≥ 0. So x − ${b} ≥ 0, which means x ≥ ${b}.`
      },
      {
        question: `What is the range of f(x) = ${a}x² + ${b}?`,
        answer: `y ≥ ${b}`,
        wrongs: [`y ≤ ${b}`, `y ≥ ${-b}`, `All real numbers`],
        explanation: `Since ${a}x² ≥ 0 for all x, the minimum value of f(x) is ${b} (when x = 0). So the range is y ≥ ${b}.`
      }
    ];
    const t = rChoice(types);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  "Composite Functions": () => {
    const a = rInt(2, 5), b = rInt(1, 6), c = rInt(1, 4), x = rInt(1, 4);
    const gx = a * x + b;
    const fgx = c * gx + rInt(1, 5);
    const d = rInt(1, 5);
    const fofg = c * (a * x + b) + d;
    const wrongs = [fofg + 2, fofg - 2, fofg + 5];
    return {
      question: `If f(x) = ${c}x + ${d} and g(x) = ${a}x + ${b}, what is (f∘g)(${x})?`,
      choices: makeChoices(fofg, wrongs),
      answer: fofg,
      explanation: `First find g(${x}) = ${a}(${x}) + ${b} = ${a*x + b}. Then f(g(${x})) = ${c}(${a*x+b}) + ${d} = ${c*(a*x+b)} + ${d} = ${fofg}.`
    };
  },

  "Function Operations": () => {
    const a = rInt(2, 6), b = rInt(1, 8), c = rInt(1, 5), d = rInt(1, 6), x = rInt(1, 4);
    const fx = a * x + b, gx = c * x + d;
    const ops = [
      { op: "+", res: fx + gx, exp: `f(${x}) + g(${x}) = ${fx} + ${gx} = ${fx+gx}` },
      { op: "−", res: fx - gx, exp: `f(${x}) − g(${x}) = ${fx} − ${gx} = ${fx-gx}` },
      { op: "×", res: fx * gx, exp: `f(${x}) × g(${x}) = ${fx} × ${gx} = ${fx*gx}` }
    ];
    const chosen = rChoice(ops);
    const wrongs = [chosen.res + 3, chosen.res - 3, chosen.res + 7];
    return {
      question: `If f(x) = ${a}x + ${b} and g(x) = ${c}x + ${d}, what is (f ${chosen.op} g)(${x})?`,
      choices: makeChoices(chosen.res, wrongs),
      answer: chosen.res,
      explanation: chosen.exp
    };
  },

  "Inverse Functions": () => {
    const a = rInt(2, 7), b = rInt(1, 10);
    const y = rInt(3, 12);
    const inv = (y - b) / a;
    const invClean = Math.round(inv * 100) / 100;
    const answerStr = Number.isInteger(invClean) ? `${invClean}` : `(${y} − ${b})/${a}`;
    const wrongs = [`(${y} + ${b})/${a}`, `${a*y - b}`, `${a}/${y - b}`];
    return {
      question: `If f(x) = ${a}x + ${b}, what is f⁻¹(${y})?`,
      choices: makeChoices(answerStr, wrongs),
      answer: answerStr,
      explanation: `To find the inverse, set y = ${a}x + ${b}. Swap x and y: x = ${a}y + ${b}. Solve for y: y = (x − ${b})/${a}. So f⁻¹(${y}) = (${y} − ${b})/${a}.`
    };
  },

  // ---- STATISTICS ----
  "Mean Median Mode": () => {
    const types = ["mean", "median", "mode"];
    const t = rChoice(types);
    const nums = Array.from({length: rInt(5,7)}, () => rInt(10, 30));
    if (t === "mode") { const rep = rChoice(nums); nums.push(rep); }
    const sorted = [...nums].sort((a,b) => a-b);
    let answer, explanation, question;
    if (t === "mean") {
      const sum = nums.reduce((a,b)=>a+b,0);
      const mean = Math.round((sum / nums.length) * 10) / 10;
      answer = mean;
      question = `Find the mean of the data set: {${nums.join(", ")}}`;
      explanation = `Sum = ${sum}. Mean = ${sum} ÷ ${nums.length} = ${mean}.`;
      const wrongs = [mean + 2, mean - 2, mean + 5];
      return { question, choices: makeChoices(answer, wrongs), answer, explanation };
    } else if (t === "median") {
      const mid = Math.floor(sorted.length / 2);
      answer = sorted.length % 2 === 0 ? (sorted[mid-1]+sorted[mid])/2 : sorted[mid];
      question = `Find the median of the data set: {${nums.join(", ")}}`;
      explanation = `Sorted: {${sorted.join(", ")}}. Median = ${answer}.`;
      const wrongs = [answer + 2, answer - 2, answer + 4];
      return { question, choices: makeChoices(answer, wrongs), answer, explanation };
    } else {
      const freq = {};
      nums.forEach(n => freq[n] = (freq[n]||0)+1);
      answer = +Object.entries(freq).sort((a,b)=>b[1]-a[1])[0][0];
      question = `Find the mode of the data set: {${nums.join(", ")}}`;
      explanation = `The number that appears most often is ${answer}.`;
      const wrongs = [answer + 1, sorted[0], sorted[sorted.length-1]];
      return { question, choices: makeChoices(answer, wrongs), answer, explanation };
    }
  },

  "Interpreting Venn Diagrams": () => {
    const totalA = rInt(10, 20), both = rInt(3, 8), totalB = rInt(10, 20);
    const onlyA = totalA - both, onlyB = totalB - both;
    const total = onlyA + onlyB + both + rInt(2, 8);
    const neither = total - onlyA - onlyB - both;
    const questions = [
      { q: `In a class of ${total} students, ${totalA} play soccer and ${totalB} play basketball. ${both} play both. How many play neither?`, a: neither, exp: `Total in A∪B = ${totalA} + ${totalB} − ${both} = ${totalA+totalB-both}. Neither = ${total} − ${totalA+totalB-both} = ${neither}.` },
      { q: `In a survey, ${onlyA} people like only cats, ${onlyB} like only dogs, and ${both} like both. How many people were surveyed (not counting those who like neither)?`, a: onlyA+onlyB+both, exp: `Total = only cats + only dogs + both = ${onlyA} + ${onlyB} + ${both} = ${onlyA+onlyB+both}.` }
    ];
    const chosen = rChoice(questions);
    const wrongs = [chosen.a + rInt(1,4), chosen.a - rInt(1,3), chosen.a + rInt(5,9)];
    return { question: chosen.q, choices: makeChoices(chosen.a, wrongs), answer: chosen.a, explanation: chosen.exp };
  },

  "Standard Deviation & Range": () => {
    const nums = Array.from({length: rInt(5,7)}, () => rInt(5, 50));
    const range = Math.max(...nums) - Math.min(...nums);
    const wrongs = [range + rInt(1,4), range - rInt(1,3), range + rInt(5,10)];
    return {
      question: `What is the range of the data set: {${nums.join(", ")}}?`,
      choices: makeChoices(range, wrongs),
      answer: range,
      explanation: `Range = Max − Min = ${Math.max(...nums)} − ${Math.min(...nums)} = ${range}.`
    };
  },

  "Expected Value": () => {
    const outcomes = [rInt(1,5), rInt(6,10), rInt(11,15)];
    const probs = [0.2, 0.5, 0.3];
    const ev = Math.round((outcomes[0]*probs[0] + outcomes[1]*probs[1] + outcomes[2]*probs[2]) * 100) / 100;
    const wrongs = [ev + 0.5, ev - 0.5, ev + 1.2];
    return {
      question: `A game pays $${outcomes[0]} with probability 0.2, $${outcomes[1]} with probability 0.5, and $${outcomes[2]} with probability 0.3. What is the expected value?`,
      choices: makeChoices(`$${ev}`, wrongs.map(w => `$${w}`)),
      answer: `$${ev}`,
      explanation: `E(X) = ${outcomes[0]}(0.2) + ${outcomes[1]}(0.5) + ${outcomes[2]}(0.3) = ${(outcomes[0]*0.2).toFixed(2)} + ${(outcomes[1]*0.5).toFixed(2)} + ${(outcomes[2]*0.3).toFixed(2)} = $${ev}.`
    };
  },

  // ---- PROBABILITY ----
  "Basic Probability": () => {
    const total = rInt(10, 30), favorable = rInt(2, total - 2);
    const [n, d] = simplifyFrac(favorable, total);
    const answer = fracStr(favorable, total);
    const wrongs = [fracStr(total-favorable, total), fracStr(favorable+1, total), fracStr(favorable, total+2)];
    const items = rChoice(["red marbles", "blue cards", "winning tickets", "defective parts"]);
    return {
      question: `A bag contains ${total} items, of which ${favorable} are ${items}. If one item is selected at random, what is the probability of selecting a ${items.slice(0,-1)}?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `P(event) = favorable outcomes / total outcomes = ${favorable}/${total} = ${answer}.`
    };
  },

  // ---- TRIANGLE PROPERTIES ----
  "Similar Triangles": () => {
    const a = rInt(3, 8), b = rInt(4, 10), scale = rInt(2, 4);
    const A = a * scale, B = b * scale, x = rInt(5, 12);
    const missing = (x * scale);
    const wrongs = [missing + 2, missing - 1, missing + 4];
    return {
      question: `Triangle ABC is similar to Triangle DEF. In Triangle ABC, side a = ${a} and side b = ${b}. In Triangle DEF, side d = ${A}. What is the length of side e?`,
      choices: makeChoices(missing, wrongs),
      answer: missing,
      explanation: `The scale factor is ${A}/${a} = ${scale}. So side e = ${b} × ${scale} = ${missing}.`
    };
  },

  "Sum of Angles in a Triangle": () => {
    const a = rInt(30, 80), b = rInt(20, 100 - a);
    const c = 180 - a - b;
    const wrongs = [c + 5, c - 5, c + 10];
    return {
      question: `In a triangle, two of the angles measure ${a}° and ${b}°. What is the measure of the third angle?`,
      choices: makeChoices(`${c}°`, wrongs.map(w=>`${w}°`)),
      answer: `${c}°`,
      explanation: `The sum of angles in a triangle is 180°. Third angle = 180° − ${a}° − ${b}° = ${c}°.`
    };
  },

  "Angle-Side Inequality Theorem": () => {
    const sides = [rInt(3,6), rInt(7,10), rInt(11,15)];
    const sorted = [...sides].sort((a,b)=>a-b);
    return {
      question: `A triangle has sides of length ${sides[0]}, ${sides[1]}, and ${sides[2]}. Which side is opposite the LARGEST angle?`,
      choices: makeChoices(`${sorted[2]}`, [`${sorted[0]}`, `${sorted[1]}`, "Cannot be determined"]),
      answer: `${sorted[2]}`,
      explanation: `The largest angle is opposite the longest side. The longest side is ${sorted[2]}.`
    };
  },

  "Isosceles & Equilateral Triangles": () => {
    const types = [
      () => {
        const base = rInt(40, 80);
        const leg = (180 - base) / 2;
        return {
          question: `An isosceles triangle has a vertex angle of ${base}°. What is the measure of each base angle?`,
          answer: `${leg}°`,
          wrongs: [`${leg+5}°`, `${leg-5}°`, `${180-leg}°`],
          explanation: `In an isosceles triangle, base angles are equal. Base angles = (180° − ${base}°) / 2 = ${leg}°.`
        };
      },
      () => {
        return {
          question: `Each angle of an equilateral triangle measures how many degrees?`,
          answer: "60°",
          wrongs: ["45°", "90°", "72°"],
          explanation: `All three angles of an equilateral triangle are equal. 180° ÷ 3 = 60°.`
        };
      }
    ];
    const t = rChoice(types)();
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  // ---- SOLVE FOR VARIABLE ----
  "Solving Equations for a Variable": () => {
    const a = rInt(2, 9), b = rInt(1, 15), c = rInt(1, 20);
    const x = Math.round(((c - b) / a) * 10) / 10;
    const xStr = Number.isInteger(x) ? `${x}` : `${c-b}/${a}`;
    const wrongs = [`${x+1}`, `${x-1}`, `${x+2}`];
    return {
      question: `Solve for x: ${a}x + ${b} = ${c}`,
      choices: makeChoices(xStr, wrongs),
      answer: xStr,
      explanation: `Subtract ${b} from both sides: ${a}x = ${c-b}. Divide both sides by ${a}: x = ${xStr}.`
    };
  },

  "Solving Inequalities for a Variable": () => {
    const a = rInt(2, 9), b = rInt(1, 15), c = rInt(1, 20);
    const flip = Math.random() > 0.5;
    const coeff = flip ? -a : a;
    const x = flip ? (b - c) / a : (c - b) / a;
    const xClean = Math.round(x * 10) / 10;
    const sign = flip ? "≥" : "≤";
    const answer = `x ${sign} ${xClean}`;
    const wrongs = [`x ≤ ${xClean}`, `x ≥ ${xClean + 1}`, `x ${sign} ${xClean + 2}`];
    return {
      question: `Solve for x: ${coeff}x + ${b} ${flip ? "≤" : "≥"} ${c}`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `Subtract ${b}: ${coeff}x ${flip ? "≤" : "≥"} ${c-b}. Divide by ${coeff}${flip ? " (flip the inequality!)" : ""}: ${answer}.`
    };
  },

  // ---- FRACTIONS & DECIMALS ----
  "Operations with Fractions and Decimals": () => {
    const ops = [
      () => {
        const n1=rInt(1,5),d1=rInt(2,8),n2=rInt(1,5),d2=rInt(2,8);
        const resN = n1*d2 + n2*d1, resD = d1*d2;
        const ans = fracStr(resN, resD);
        const wrongs = [fracStr(n1+n2, d1+d2), fracStr(resN+1, resD), fracStr(resN-1, resD)];
        return { question: `What is ${n1}/${d1} + ${n2}/${d2}?`, answer: ans, wrongs, explanation: `Find common denominator: (${n1}×${d2} + ${n2}×${d1})/(${d1}×${d2}) = ${resN}/${resD} = ${ans}.` };
      },
      () => {
        const n1=rInt(1,5),d1=rInt(2,8),n2=rInt(1,5),d2=rInt(2,8);
        const resN = n1*n2, resD = d1*d2;
        const ans = fracStr(resN, resD);
        const wrongs = [fracStr(resN+1, resD), fracStr(n1+n2, d1+d2), fracStr(resN, resD+1)];
        return { question: `What is ${n1}/${d1} × ${n2}/${d2}?`, answer: ans, wrongs, explanation: `Multiply numerators and denominators: (${n1}×${n2})/(${d1}×${d2}) = ${resN}/${resD} = ${ans}.` };
      }
    ];
    const t = rChoice(ops)();
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  "Optimize Fractions": () => {
    const nums = [rInt(2,5), rInt(6,9), rInt(1,4), rInt(7,12)];
    const max = Math.max(...nums), min = Math.min(...nums);
    const answer = `${max}/${min}`;
    const wrongs = [`${min}/${max}`, `${nums[1]}/${nums[0]}`, `${nums[2]}/${nums[3]}`];
    return {
      question: `Using the digits ${nums.join(", ")}, each used exactly once, what fraction a/b has the MAXIMUM value?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `To maximize a fraction, put the largest number (${max}) in the numerator and the smallest (${min}) in the denominator: ${answer}.`
    };
  },

  // ---- FACTORING ----
  "Factoring Quadratic Expressions": () => {
    const r1 = rInt(-6, 6), r2 = rInt(-6, 6);
    const b = -(r1 + r2), c = r1 * r2;
    const bStr = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
    const cStr = c >= 0 ? `+ ${c}` : `− ${Math.abs(c)}`;
    const answer = `(x ${r1 >= 0 ? '−' : '+'} ${Math.abs(r1)})(x ${r2 >= 0 ? '−' : '+'} ${Math.abs(r2)})`;
    const wrongs = [
      `(x + ${Math.abs(r1)})(x + ${Math.abs(r2)})`,
      `(x − ${Math.abs(r1)+1})(x + ${Math.abs(r2)})`,
      `(x − ${Math.abs(r1)})(x + ${Math.abs(r2)+1})`
    ];
    return {
      question: `Factor the quadratic: x² ${bStr}x ${cStr}`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `Find two numbers that multiply to ${c} and add to ${b}: those are ${-r1} and ${-r2}. So the factored form is ${answer}.`
    };
  },

  "Zeroes and Roots of a Function": () => {
    const r1 = rInt(-5, -1), r2 = rInt(1, 5);
    const answer = `x = ${r1} and x = ${r2}`;
    const wrongs = [`x = ${-r1} and x = ${-r2}`, `x = ${r1} and x = ${-r2}`, `x = ${-r1} and x = ${r2}`];
    return {
      question: `What are the zeros of f(x) = (x − ${r2})(x + ${Math.abs(r1)})?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `Set each factor equal to 0: x − ${r2} = 0 → x = ${r2}; x + ${Math.abs(r1)} = 0 → x = ${r1}.`
    };
  },

  "Quadratic Formula": () => {
    const a = 1, b = rInt(-6, 6), disc = b*b - 4*rInt(1,3);
    const safeDisc = Math.abs(b*b - 4);
    const bVal = rChoice([-4,-3,-2,2,3,4]);
    const discVal = bVal*bVal - 4;
    if (discVal < 0) {
      return {
        question: `Use the quadratic formula to determine the nature of the roots of x² + ${bVal}x + ${bVal*bVal} = 0. What is the discriminant?`,
        choices: makeChoices(`${bVal*bVal - 4*bVal*bVal}`, [`${bVal*bVal}`, `${4*bVal*bVal}`, "0"]),
        answer: `${bVal*bVal - 4*bVal*bVal}`,
        explanation: `Discriminant = b² − 4ac = ${bVal}² − 4(1)(${bVal*bVal}) = ${bVal*bVal} − ${4*bVal*bVal} = ${bVal*bVal - 4*bVal*bVal}.`
      };
    }
    const bQ = rInt(2,5)*2, c = rInt(1,5);
    const disc2 = bQ*bQ - 4*c;
    const sqrtDisc = Math.sqrt(disc2);
    const x1 = (-bQ + sqrtDisc) / 2, x2 = (-bQ - sqrtDisc) / 2;
    if (Math.floor(sqrtDisc) !== sqrtDisc) {
      return {
        question: `For the equation x² − ${bQ}x + ${c} = 0, what is the value of the discriminant?`,
        choices: makeChoices(disc2, [disc2+4, disc2-4, bQ*bQ]),
        answer: disc2,
        explanation: `Discriminant = b² − 4ac = (${bQ})² − 4(1)(${c}) = ${bQ*bQ} − ${4*c} = ${disc2}.`
      };
    }
    return {
      question: `Solve x² − ${bQ}x + ${c} = 0 using the quadratic formula.`,
      choices: makeChoices(`x = ${x1} or x = ${x2}`, [`x = ${x1+1} or x = ${x2-1}`, `x = ${x1-1} or x = ${x2}`, `x = ${-x1} or x = ${-x2}`]),
      answer: `x = ${x1} or x = ${x2}`,
      explanation: `x = (${bQ} ± √${disc2}) / 2 = (${bQ} ± ${sqrtDisc}) / 2. So x = ${x1} or x = ${x2}.`
    };
  },

  // ---- SYSTEMS OF EQUATIONS ----
  "Systems of Equations": () => {
    const x = rInt(-4, 6), y = rInt(-4, 6);
    const a1 = rInt(1, 4), b1 = rInt(1, 4);
    const a2 = rInt(1, 4), b2 = rInt(1, 4);
    const c1 = a1*x + b1*y, c2 = a2*x + b2*y;
    const answer = `x = ${x}, y = ${y}`;
    const wrongs = [`x = ${x+1}, y = ${y}`, `x = ${x}, y = ${y+1}`, `x = ${y}, y = ${x}`];
    return {
      question: `Solve the system: ${a1}x + ${b1}y = ${c1} and ${a2}x + ${b2}y = ${c2}`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `By substitution or elimination, x = ${x} and y = ${y}. Check: ${a1}(${x}) + ${b1}(${y}) = ${c1} ✓ and ${a2}(${x}) + ${b2}(${y}) = ${c2} ✓`
    };
  },

  // ---- CIRCLES ----
  "Sector Area": () => {
    const r = rInt(3, 10), angle = rChoice([30, 45, 60, 90, 120, 180]);
    const area = Math.round((angle/360) * Math.PI * r * r * 100) / 100;
    const wrongs = [Math.round(area * 1.1 * 100)/100, Math.round(area * 0.9 * 100)/100, Math.round(area * 1.5 * 100)/100];
    return {
      question: `A circle has radius ${r}. What is the area of a sector with central angle ${angle}°? (Use π ≈ 3.14159)`,
      choices: makeChoices(area, wrongs),
      answer: area,
      explanation: `Sector Area = (${angle}/360) × π × r² = (${angle}/360) × π × ${r}² ≈ ${area}.`
    };
  },

  "Arc Length": () => {
    const r = rInt(3, 10), angle = rChoice([30, 45, 60, 90, 120]);
    const arc = Math.round((angle/360) * 2 * Math.PI * r * 100) / 100;
    const wrongs = [Math.round(arc*1.2*100)/100, Math.round(arc*0.8*100)/100, Math.round((arc+2)*100)/100];
    return {
      question: `A circle has radius ${r}. What is the arc length corresponding to a central angle of ${angle}°? (Use π ≈ 3.14159)`,
      choices: makeChoices(arc, wrongs),
      answer: arc,
      explanation: `Arc Length = (${angle}/360) × 2πr = (${angle}/360) × 2π(${r}) ≈ ${arc}.`
    };
  },

  "Equation of a Circle": () => {
    const h = rInt(-5, 5), k = rInt(-5, 5), r = rInt(2, 8);
    const types = [
      {
        question: `What is the center of the circle described by (x − ${h})² + (y − ${k})² = ${r*r}?`,
        answer: `(${h}, ${k})`,
        wrongs: [`(${-h}, ${-k})`, `(${h}, ${-k})`, `(${-h}, ${k})`],
        explanation: `The equation (x − h)² + (y − k)² = r² has center (h, k). Here h = ${h}, k = ${k}.`
      },
      {
        question: `What is the radius of the circle described by (x − ${h})² + (y − ${k})² = ${r*r}?`,
        answer: `${r}`,
        wrongs: [`${r*r}`, `${r+1}`, `${r-1}`],
        explanation: `The radius is √${r*r} = ${r}.`
      }
    ];
    const t = rChoice(types);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  "Central & Inscribed Angles": () => {
    const arc = rInt(40, 160);
    const inscribed = arc / 2;
    const types = [
      { question: `An inscribed angle intercepts an arc of ${arc}°. What is the measure of the inscribed angle?`, answer: `${inscribed}°`, wrongs: [`${arc}°`, `${arc*2}°`, `${inscribed+10}°`], explanation: `An inscribed angle = ½ × intercepted arc = ½ × ${arc}° = ${inscribed}°.` },
      { question: `A central angle intercepts an arc of ${arc}°. What is the measure of the central angle?`, answer: `${arc}°`, wrongs: [`${arc/2}°`, `${arc*2}°`, `${arc-10}°`], explanation: `A central angle equals its intercepted arc. The central angle = ${arc}°.` }
    ];
    const t = rChoice(types);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  // ---- LINES ----
  "Slope Calculation": () => {
    const x1 = rInt(-5,5), y1 = rInt(-5,5), x2 = rInt(-5,5), y2 = rInt(-5,5);
    if (x1 === x2) return GENERATORS["Slope Calculation"]();
    const rise = y2 - y1, run = x2 - x1;
    const [n, d] = simplifyFrac(rise, run);
    const answer = d === 1 ? `${n}` : `${n}/${d}`;
    const wrongs = [`${n+1}`, `${-n}/${d}`, `${d}/${n}`];
    return {
      question: `What is the slope of the line passing through (${x1}, ${y1}) and (${x2}, ${y2})?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `m = (y₂ − y₁)/(x₂ − x₁) = (${y2} − ${y1})/(${x2} − ${x1}) = ${rise}/${run} = ${answer}.`
    };
  },

  "Equation of a Line": () => {
    const m = rInt(-4, 4), b = rInt(-6, 6);
    if (m === 0) return GENERATORS["Equation of a Line"]();
    const x = rInt(1, 5);
    const y = m * x + b;
    const mStr = m === 1 ? "" : m === -1 ? "-" : `${m}`;
    const bStr = b >= 0 ? `+ ${b}` : `− ${Math.abs(b)}`;
    const answer = `y = ${mStr}x ${bStr}`;
    const wrongs = [`y = ${m+1}x ${bStr}`, `y = ${mStr}x + ${b+2}`, `y = ${-m}x ${bStr}`];
    return {
      question: `A line has slope ${m} and y-intercept ${b}. Which equation represents this line?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `Slope-intercept form: y = mx + b. With m = ${m} and b = ${b}: ${answer}.`
    };
  },

  "Parallel & Perpendicular Lines": () => {
    const m = rInt(-4, 4);
    if (m === 0) return GENERATORS["Parallel & Perpendicular Lines"]();
    const [n, d] = simplifyFrac(-1, m);
    const perpSlope = d === 1 ? `${n}` : `${n}/${d}`;
    const type = rChoice(["parallel", "perpendicular"]);
    if (type === "parallel") {
      const b2 = rInt(-6,6);
      return {
        question: `Which of the following lines is parallel to y = ${m}x + ${rInt(-5,5)}?`,
        choices: makeChoices(`y = ${m}x + ${b2}`, [`y = ${n}/${d}x + ${b2}`, `y = ${m+1}x + ${b2}`, `y = ${-m}x + ${b2}`]),
        answer: `y = ${m}x + ${b2}`,
        explanation: `Parallel lines have the same slope. The slope here is ${m}, so the parallel line is y = ${m}x + ${b2}.`
      };
    } else {
      const b2 = rInt(-6,6);
      return {
        question: `Which of the following lines is perpendicular to y = ${m}x + ${rInt(-5,5)}?`,
        choices: makeChoices(`y = ${perpSlope}x + ${b2}`, [`y = ${m}x + ${b2}`, `y = ${m+1}x + ${b2}`, `y = ${-m}x + ${b2}`]),
        answer: `y = ${perpSlope}x + ${b2}`,
        explanation: `Perpendicular lines have slopes that are negative reciprocals. The negative reciprocal of ${m} is ${perpSlope}.`
      };
    }
  },

  // ---- NUMBER PROPERTIES ----
  "Rational and Irrational": () => {
    const qs = [
      { question: "Which of the following is an irrational number?", choices: ["√2", "1/3", "0.5", "7"], answer: "√2", explanation: "√2 cannot be expressed as p/q for integers p, q. It is irrational. All other choices are rational." },
      { question: "The product of a nonzero rational number and an irrational number is always:", choices: ["Irrational", "Rational", "An integer", "Zero"], answer: "Irrational", explanation: "A nonzero rational × irrational always produces an irrational number." },
      { question: "Which of the following is a rational number?", choices: ["4/7", "√3", "π", "√5"], answer: "4/7", explanation: "4/7 can be expressed as a fraction of two integers, so it is rational." }
    ];
    return rChoice(qs);
  },

  "Multiples": () => {
    const a = rInt(2, 9), b = rInt(2, 9);
    const lcm = a * b / gcd(a, b);
    const wrongs = [lcm + a, lcm - b, a * b];
    return {
      question: `What is the least common multiple (LCM) of ${a} and ${b}?`,
      choices: makeChoices(lcm, wrongs.filter(w => w !== lcm)),
      answer: lcm,
      explanation: `GCD(${a}, ${b}) = ${gcd(a,b)}. LCM = (${a} × ${b}) / ${gcd(a,b)} = ${lcm}.`
    };
  },

  "Factors": () => {
    const a = rInt(12, 48), b = rInt(12, 48);
    const g = gcd(a, b);
    const wrongs = [g + 1, g - 1, g * 2].filter(w => w !== g && w > 0);
    return {
      question: `What is the greatest common factor (GCF) of ${a} and ${b}?`,
      choices: makeChoices(g, wrongs),
      answer: g,
      explanation: `Factor each: ${a} = ... and ${b} = ... The GCF is ${g}.`
    };
  },

  "Divisibility Rules": () => {
    const rules = [
      { question: `Which of the following numbers is divisible by 3?`, choices: ["123", "124", "125", "127"], answer: "123", explanation: "For divisibility by 3, the digit sum must be divisible by 3. 1+2+3=6, which is divisible by 3." },
      { question: `Which of the following is divisible by 9?`, choices: ["729", "730", "728", "731"], answer: "729", explanation: "For divisibility by 9, the digit sum must be divisible by 9. 7+2+9=18, which is divisible by 9." },
      { question: `A number ends in 0 or 5. It must be divisible by:`, choices: ["5", "3", "9", "7"], answer: "5", explanation: "If a number ends in 0 or 5, it is divisible by 5." }
    ];
    return rChoice(rules);
  },

  "Integer Properties": () => {
    const qs = [
      { question: "What is the result of adding two odd integers?", choices: ["Even", "Odd", "Could be either", "Zero"], answer: "Even", explanation: "Odd + Odd = Even. For example, 3 + 5 = 8." },
      { question: "What is the result of multiplying two even integers?", choices: ["Even", "Odd", "Could be either", "Prime"], answer: "Even", explanation: "Even × Even = Even. For example, 4 × 6 = 24." },
      { question: "What is the result of multiplying an odd integer by an even integer?", choices: ["Even", "Odd", "Could be either", "Zero"], answer: "Even", explanation: "Odd × Even = Even. For example, 3 × 4 = 12." }
    ];
    return rChoice(qs);
  },

  // ---- POLYNOMIALS ----
  "FOIL": () => {
    const a = rInt(1, 5), b = rInt(1, 6), c = rInt(1, 5), d = rInt(1, 6);
    const first = a*c, outer = a*d, inner = b*c, last = b*d;
    const midCoeff = outer + inner;
    const answer = `${first}x² + ${midCoeff}x + ${last}`;
    const wrongs = [`${first}x² + ${midCoeff+1}x + ${last}`, `${first+1}x² + ${midCoeff}x + ${last}`, `${first}x² + ${midCoeff}x + ${last+1}`];
    return {
      question: `Expand: (${a}x + ${b})(${c}x + ${d})`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `FOIL: First=${a}×${c}=${first}, Outer=${a}×${d}=${outer}, Inner=${b}×${c}=${inner}, Last=${b}×${d}=${last}. Result: ${first}x² + (${outer}+${inner})x + ${last} = ${answer}.`
    };
  },

  "Polynomial Arithmetic": () => {
    const a1=rInt(1,5),b1=rInt(1,8),a2=rInt(1,5),b2=rInt(1,8);
    const type = rChoice(["add","subtract"]);
    const ra = type === "add" ? a1+a2 : a1-a2;
    const rb = type === "add" ? b1+b2 : b1-b2;
    const op = type === "add" ? "+" : "−";
    const answer = `${ra}x + ${rb}`;
    const wrongs = [`${ra+1}x + ${rb}`, `${ra}x + ${rb+1}`, `${ra-1}x + ${rb-1}`];
    return {
      question: `Simplify: (${a1}x + ${b1}) ${op} (${a2}x + ${b2})`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `Combine like terms: (${a1} ${op} ${a2})x + (${b1} ${op} ${b2}) = ${ra}x + ${rb}.`
    };
  },

  "Special Binomial Expansion": () => {
    const a = rInt(2, 6), b = rInt(1, 5);
    const type = rChoice(["square_plus", "square_minus"]);
    if (type === "square_plus") {
      const answer = `${a*a}x² + ${2*a*b}x + ${b*b}`;
      const wrongs = [`${a*a}x² + ${a*b}x + ${b*b}`, `${a*a}x² + ${2*a*b}x + ${b}`, `${a}x² + ${2*a*b}x + ${b*b}`];
      return {
        question: `Expand: (${a}x + ${b})²`,
        choices: makeChoices(answer, wrongs),
        answer,
        explanation: `(a + b)² = a² + 2ab + b². Here: (${a}x)² + 2(${a}x)(${b}) + ${b}² = ${a*a}x² + ${2*a*b}x + ${b*b}.`
      };
    } else {
      const answer = `${a*a}x² − ${2*a*b}x + ${b*b}`;
      const wrongs = [`${a*a}x² + ${2*a*b}x + ${b*b}`, `${a*a}x² − ${a*b}x + ${b*b}`, `${a*a}x² − ${2*a*b}x − ${b*b}`];
      return {
        question: `Expand: (${a}x − ${b})²`,
        choices: makeChoices(answer, wrongs),
        answer,
        explanation: `(a − b)² = a² − 2ab + b². Here: (${a}x)² − 2(${a}x)(${b}) + ${b}² = ${a*a}x² − ${2*a*b}x + ${b*b}.`
      };
    }
  },

  // ---- SOHCAHTOA ----
  "SOHCAHTOA": () => {
    const angles = [30, 45, 60];
    const angle = rChoice(angles);
    const ratios = {
      30: { sin: "1/2", cos: "√3/2", tan: "1/√3" },
      45: { sin: "√2/2", cos: "√2/2", tan: "1" },
      60: { sin: "√3/2", cos: "1/2", tan: "√3" }
    };
    const fn = rChoice(["sin", "cos", "tan"]);
    const answer = ratios[angle][fn];
    const hyp = rInt(5, 15);
    const opp30 = hyp / 2, adj30 = Math.round(hyp * Math.sqrt(3) / 2);
    const scenario = rChoice([
      {
        question: `In a right triangle, the opposite side = ${opp30} and the hypotenuse = ${hyp}. What is sin(θ)?`,
        answer: fracStr(opp30, hyp),
        wrongs: [fracStr(hyp, opp30), fracStr(adj30, hyp), fracStr(opp30, adj30)],
        explanation: `sin(θ) = opposite/hypotenuse = ${opp30}/${hyp} = ${fracStr(opp30, hyp)}.`
      },
      {
        question: `What is sin(${angle}°)?`,
        answer,
        wrongs: Object.values(ratios[angle]).filter(r => r !== answer),
        explanation: `sin(${angle}°) = ${answer}. Remember: SOH = sin = Opposite/Hypotenuse.`
      }
    ]);
    return { ...scenario, choices: makeChoices(scenario.answer, scenario.wrongs) };
  },

  // ---- COMPLEX NUMBERS ----
  "Complex & Imaginary Numbers": () => {
    const qs = [
      () => {
        const n = rInt(1, 10);
        const powers = [{p:"i¹",a:"i"},{p:"i²",a:"-1"},{p:"i³",a:"-i"},{p:"i⁴",a:"1"},{p:"i⁵",a:"i"},{p:"i⁶",a:"-1"}];
        const chosen = rChoice(powers);
        return { question: `What is the value of ${chosen.p}?`, choices: makeChoices(chosen.a, ["i","-1","1","-i"].filter(x=>x!==chosen.a)), answer: chosen.a, explanation: `Powers of i cycle every 4: i¹=i, i²=−1, i³=−i, i⁴=1. So ${chosen.p} = ${chosen.a}.` };
      },
      () => {
        const a = rInt(1,5), b = rInt(1,5), c = rInt(1,5), d = rInt(1,5);
        const re = a+c, im = b+d;
        const answer = `${re} + ${im}i`;
        const wrongs = [`${re+1} + ${im}i`, `${re} + ${im+1}i`, `${a+c-1} + ${b+d}i`];
        return { question: `What is (${a} + ${b}i) + (${c} + ${d}i)?`, choices: makeChoices(answer, wrongs), answer, explanation: `Add real and imaginary parts separately: (${a}+${c}) + (${b}+${d})i = ${answer}.` };
      }
    ];
    return rChoice(qs)();
  },

  // ---- COORDINATE PLANE ----
  "(x,y) Coordinate Plane": () => {
    const m = rInt(-4, 4), b = rInt(-6, 6);
    if (m === 0) return GENERATORS["(x,y) Coordinate Plane"]();
    const qs = [
      {
        question: `Where does the line y = ${m}x + ${b} cross the y-axis?`,
        answer: `(0, ${b})`,
        wrongs: [`(${b}, 0)`, `(0, ${b+1})`, `(0, ${-b})`],
        explanation: `The y-intercept occurs where x = 0. y = ${m}(0) + ${b} = ${b}. The y-intercept is (0, ${b}).`
      },
      {
        question: `In which quadrant does the point (${rInt(1,8)}, ${-rInt(1,8)}) lie?`,
        answer: "Quadrant IV",
        wrongs: ["Quadrant I", "Quadrant II", "Quadrant III"],
        explanation: "Quadrant IV contains points where x > 0 and y < 0."
      }
    ];
    const t = rChoice(qs);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  "Distance Formula": () => {
    const x1=rInt(-5,5), y1=rInt(-5,5), x2=rInt(-5,5), y2=rInt(-5,5);
    const dx=x2-x1, dy=y2-y1;
    const d2 = dx*dx + dy*dy;
    const d = Math.round(Math.sqrt(d2) * 100) / 100;
    const answer = `√${d2}` ;
    const wrongs = [`√${d2+4}`, `√${d2-4 > 0 ? d2-4 : d2+8}`, `${d}`];
    return {
      question: `What is the distance between (${x1}, ${y1}) and (${x2}, ${y2})?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `d = √[(x₂−x₁)² + (y₂−y₁)²] = √[(${x2}−${x1})² + (${y2}−${y1})²] = √[${dx*dx} + ${dy*dy}] = √${d2} ≈ ${d}.`
    };
  },

  // ---- UNIT CONVERSION ----
  "Unit Conversion": () => {
    const conversions = [
      () => {
        const mph = rInt(30, 80);
        const fps = Math.round(mph * 5280 / 3600 * 100) / 100;
        return { question: `A car travels at ${mph} miles per hour. What is its speed in feet per second? (1 mile = 5,280 feet)`, answer: `${fps} ft/s`, wrongs: [`${mph * 5280} ft/s`, `${Math.round(mph * 3600 / 5280 * 100)/100} ft/s`, `${fps + 10} ft/s`], explanation: `${mph} mi/hr × (5280 ft/mi) × (1 hr/3600 s) = ${fps} ft/s.` };
      },
      () => {
        const cm = rInt(50, 200);
        const m = cm / 100;
        return { question: `Convert ${cm} centimeters to meters.`, answer: `${m} m`, wrongs: [`${cm * 100} m`, `${cm * 10} m`, `${m + 1} m`], explanation: `${cm} cm × (1 m / 100 cm) = ${m} m.` };
      },
      () => {
        const hours = rInt(1, 5), rate = rInt(20, 60);
        const total = hours * rate;
        return { question: `A machine produces ${rate} widgets per hour. How many widgets does it produce in ${hours} hours?`, answer: `${total}`, wrongs: [`${total + rate}`, `${total - rate}`, `${total * 2}`], explanation: `${rate} widgets/hr × ${hours} hr = ${total} widgets.` };
      }
    ];
    const t = rChoice(conversions)();
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  // ---- RATIOS ----
  "Ratios": () => {
    const a = rInt(2, 8), b = rInt(2, 8), total = rInt(20, 60);
    const partA = Math.round(total * a / (a + b));
    const partB = total - partA;
    const answer = partA;
    const wrongs = [partA + 2, partA - 2, partB];
    const items = rChoice(["boys to girls", "cats to dogs", "apples to oranges", "red to blue marbles"]);
    return {
      question: `The ratio of ${items} is ${a}:${b}. If there are ${total} total, how many are in the first group?`,
      choices: makeChoices(answer, wrongs),
      answer,
      explanation: `First group = (${a}/${a+b}) × ${total} = ${partA}.`
    };
  },

  // ---- SEQUENCES ----
  "Sequence Notation": () => {
    const a1 = rInt(2, 10), d = rInt(2, 6), n = rInt(5, 10);
    const an = a1 + (n - 1) * d;
    const wrongs = [an + d, an - d, a1 + n * d];
    return {
      question: `In an arithmetic sequence, a₁ = ${a1} and d = ${d}. What is a₍${n}₎?`,
      choices: makeChoices(an, wrongs),
      answer: an,
      explanation: `aₙ = a₁ + (n−1)d = ${a1} + (${n}−1)(${d}) = ${a1} + ${(n-1)*d} = ${an}.`
    };
  },

  "Arithmetic Sequence (Sum)": () => {
    const a1 = rInt(2, 8), d = rInt(2, 5), n = rInt(5, 10);
    const an = a1 + (n-1)*d;
    const sum = (n / 2) * (a1 + an);
    const wrongs = [sum + n, sum - n, sum + d * n];
    return {
      question: `Find the sum of the first ${n} terms of an arithmetic sequence where a₁ = ${a1} and d = ${d}.`,
      choices: makeChoices(sum, wrongs),
      answer: sum,
      explanation: `aₙ = ${a1} + (${n}−1)(${d}) = ${an}. Sum = (n/2)(a₁ + aₙ) = (${n}/2)(${a1} + ${an}) = ${sum}.`
    };
  },

  "Arithmetic Sequence (Nth Term)": () => {
    const a1 = rInt(2, 10), d = rInt(2, 8), target = rInt(3, 8);
    const an = a1 + (target - 1) * d;
    const wrongs = [an + d, an - d, a1 + target * d];
    return {
      question: `An arithmetic sequence starts at ${a1} with a common difference of ${d}. What is the ${target}${["st","nd","rd"][target-1]||"th"} term?`,
      choices: makeChoices(an, wrongs),
      answer: an,
      explanation: `a₍${target}₎ = a₁ + (${target}−1)d = ${a1} + ${target-1}×${d} = ${a1} + ${(target-1)*d} = ${an}.`
    };
  },

  // ---- AREA ----
  "Area": () => {
    const shapes = [
      () => { const b=rInt(4,15),h=rInt(4,15); return { question:`What is the area of a triangle with base ${b} and height ${h}?`, answer:(b*h/2), wrongs:[b*h, b*h/2+1, (b+1)*h/2], explanation:`Area = (1/2)bh = (1/2)(${b})(${h}) = ${b*h/2}.` }; },
      () => { const l=rInt(4,15),w=rInt(3,12); return { question:`What is the area of a rectangle with length ${l} and width ${w}?`, answer:l*w, wrongs:[2*(l+w), l*w+l, l*w-w], explanation:`Area = lw = ${l} × ${w} = ${l*w}.` }; },
      () => { const r=rInt(3,10); const a=Math.round(Math.PI*r*r*100)/100; return { question:`What is the area of a circle with radius ${r}? (Use π ≈ 3.14159)`, answer:a, wrongs:[Math.round(2*Math.PI*r*100)/100, Math.round(a*1.1*100)/100, Math.round(a*0.9*100)/100], explanation:`Area = πr² = π(${r})² ≈ ${a}.` }; },
      () => { const a=rInt(4,10),b=rInt(6,14),h=rInt(3,8); const area=(a+b)/2*h; return { question:`What is the area of a trapezoid with parallel sides ${a} and ${b} and height ${h}?`, answer:area, wrongs:[area+h, area-h, (a+b)*h], explanation:`Area = ((a+b)/2)h = ((${a}+${b})/2)(${h}) = ${area}.` }; }
    ];
    const t = rChoice(shapes)();
    return { ...t, choices: makeChoices(t.answer, t.wrongs.filter(w=>w!==t.answer)) };
  },

  // ---- ADVANCED TRIG ----
  "The Unit Circle & Radians": () => {
    const conversions = [
      { deg: 30, rad: "π/6" }, { deg: 45, rad: "π/4" }, { deg: 60, rad: "π/3" },
      { deg: 90, rad: "π/2" }, { deg: 180, rad: "π" }, { deg: 270, rad: "3π/2" }
    ];
    const type = rChoice(["toRad", "toDeg"]);
    const chosen = rChoice(conversions);
    if (type === "toRad") {
      return {
        question: `Convert ${chosen.deg}° to radians.`,
        choices: makeChoices(chosen.rad, conversions.filter(c=>c.rad!==chosen.rad).slice(0,3).map(c=>c.rad)),
        answer: chosen.rad,
        explanation: `Radians = degrees × π/180 = ${chosen.deg} × π/180 = ${chosen.rad}.`
      };
    } else {
      return {
        question: `Convert ${chosen.rad} radians to degrees.`,
        choices: makeChoices(`${chosen.deg}°`, conversions.filter(c=>c.deg!==chosen.deg).slice(0,3).map(c=>`${c.deg}°`)),
        answer: `${chosen.deg}°`,
        explanation: `Degrees = radians × 180/π = ${chosen.rad} × 180/π = ${chosen.deg}°.`
      };
    }
  },

  "Trig Graph Vocabulary": () => {
    const A = rInt(2, 5), B = rInt(2, 4), D = rInt(1, 4);
    const amplitude = A;
    const period = `2π/${B}`;
    const qs = [
      { question: `What is the amplitude of y = ${A}sin(${B}x) + ${D}?`, answer: `${A}`, wrongs: [`${A*2}`, `${D}`, `${B}`], explanation: `Amplitude = |A| = |${A}| = ${A}.` },
      { question: `What is the period of y = ${A}sin(${B}x) + ${D}?`, answer: period, wrongs: [`2π`, `π/${B}`, `${B}π`], explanation: `Period = 2π/B = 2π/${B}.` },
      { question: `What is the vertical shift of y = ${A}sin(${B}x) + ${D}?`, answer: `${D} units up`, wrongs: [`${D} units down`, `${A} units up`, `${B} units up`], explanation: `The vertical shift is D = ${D}, which shifts the graph ${D} units up.` }
    ];
    const t = rChoice(qs);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  },

  "Trig Identities": () => {
    const angle = rInt(10, 80);
    const qs = [
      { question: `Using a Pythagorean identity, if sin(θ) = 3/5, what is cos²(θ)?`, answer: "16/25", wrongs: ["9/25", "1/25", "7/25"], explanation: `sin²(θ) + cos²(θ) = 1. cos²(θ) = 1 − (3/5)² = 1 − 9/25 = 16/25.` },
      { question: `Which of the following equals sin(90° − ${angle}°)?`, answer: `cos(${angle}°)`, wrongs: [`sin(${angle}°)`, `tan(${angle}°)`, `−cos(${angle}°)`], explanation: `Cofunction identity: sin(90° − x) = cos(x). So sin(90° − ${angle}°) = cos(${angle}°).` },
      { question: `sin²(θ) + cos²(θ) = ?`, answer: "1", wrongs: ["0", "sin(θ)", "2"], explanation: `This is the fundamental Pythagorean identity: sin²(θ) + cos²(θ) = 1.` }
    ];
    const t = rChoice(qs);
    return { ...t, choices: makeChoices(t.answer, t.wrongs) };
  }
};

// ============================================================
// SKILL → TOPIC MAP
// ============================================================
const SKILL_TO_TOPIC = {};
Object.entries(TOPICS).forEach(([topicId, topic]) => {
  topic.skills.forEach(skill => { SKILL_TO_TOPIC[skill] = topicId; });
});

// ============================================================
// MAIN GENERATE FUNCTION
// ============================================================
function generateQuestion(topicId, skillOverride) {
  const topic = TOPICS[topicId];
  if (!topic) return null;
  const skill = skillOverride || rChoice(topic.skills);
  const generator = GENERATORS[skill];
  if (!generator) return null;
  try {
    const q = generator();
    return { ...q, topic: topicId, skill, topicLabel: topic.label, id: Date.now() + Math.random() };
  } catch(e) {
    console.warn("Generator error for", skill, e);
    return generateQuestion(topicId, skillOverride);
  }
}

// ============================================================
// ADAPTIVE WEIGHTING
// ============================================================
function getAdaptiveQuestion(stats, topicFilter, skillFilter) {
  const allTopics = Object.keys(TOPICS);
  
  if (skillFilter) {
    const topicId = SKILL_TO_TOPIC[skillFilter];
    return topicId ? generateQuestion(topicId, skillFilter) : null;
  }
  
  if (topicFilter) {
    return generateQuestion(topicFilter);
  }

  // Calculate weights: wrong answers increase weight, correct answers decrease
  const weights = allTopics.map(topicId => {
    const s = stats[topicId] || { correct: 0, total: 0 };
    const incorrect = s.total - s.correct;
    const pct = s.total > 0 ? s.correct / s.total : 0.5;
    // Higher weight for more incorrect answers
    return Math.max(1, 10 - Math.floor(pct * 8) + incorrect * 2);
  });

  const totalWeight = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < allTopics.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return generateQuestion(allTopics[i]);
  }
  return generateQuestion(rChoice(allTopics));
}
