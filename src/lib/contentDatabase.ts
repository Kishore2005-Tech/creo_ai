import { ContentType, Tone, Length } from "../types";

/**
 * Helper to capitalize the first letter of words in a string.
 */
function capitalizeTopic(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "your Topic";
  return trimmed
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Extracts key phrases or terms from the topic to inject dynamically into sections.
 */
function extractKeywords(topic: string): string[] {
  const clean = topic.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
  const words = clean.split(/\s+/).filter(w => w.length > 4);
  if (words.length === 0) return [topic];
  return Array.from(new Set(words)).slice(0, 5);
}

/**
 * Generates specific brand tone guidelines/styles.
 */
function getToneModifiers(tone: Tone, topic: string) {
  const kw = extractKeywords(topic);
  const mainKw = kw[0] || "this topic";
  const secondKw = kw[1] || "success";

  switch (tone) {
    case "Professional":
      return {
        prefix: `In the contemporary professional arena, navigating ${mainKw} demands a meticulous, analytical approach. `,
        transition: `Furthermore, a close examination of ${mainKw} reveals critical underlying metrics. `,
        outro: `By prioritizing these insights, organizations can position themselves to drive sustainable growth.`,
        hook: `Optimizing results in ${mainKw} requires alignment across multiple strategic verticals.`
      };
    case "Casual":
      return {
        prefix: `Let's be totally real for a second—talking about ${mainKw} doesn't have to be boring or dry. `,
        transition: `So, why does this matter? Honestly, because ignoring ${mainKw} is just making life harder than it needs to be. `,
        outro: `Give it a try and see how it works for you. Let's chat below!`,
        hook: `Here's the honest breakdown on ${mainKw} that no one is gatekeeping anymore.`
      };
    case "Persuasive":
      return {
        prefix: `The absolute truth is this: if you're not actively leveraging ${mainKw} right now, you are falling behind. `,
        transition: `This isn't just about theory—it's a high-impact strategy that unlocks immediate upside in ${secondKw}. `,
        outro: `Do not let this opportunity pass you by. Take action today and master ${mainKw} before your competition does.`,
        hook: `Why ${mainKw} is the single most important asset you're currently underutilizing.`
      };
    case "Witty":
      return {
        prefix: `They say patience is a virtue, but in the realm of ${mainKw}, trying to guess your way forward is just asking for a headache. `,
        transition: `Here is the fun part: most people treat ${mainKw} like quantum physics when it is actually closer to basic baking. `,
        outro: `Hopefully, this keeps you from accidentally ruining your next attempt at ${mainKw}. You're welcome!`,
        hook: `An unfiltered guide to ${mainKw} (without the typical jargon or corporate fluff).`
      };
    case "Storytelling":
      return {
        prefix: `It was a crisp Tuesday morning when I first encountered the real power of ${mainKw}. The stakes were incredibly high. `,
        transition: `As the situation evolved, the key turning point emerged when we connected the dots back to ${mainKw}. `,
        outro: `That simple realization changed everything, proving that the best lessons in ${secondKw} come from the journey itself.`,
        hook: `The unexpected lesson I learned while deeply exploring ${mainKw} under pressure.`
      };
    default:
      return {
        prefix: `Understanding the essential layers of ${mainKw} forms the foundation of modern expertise. `,
        transition: `Expanding on this baseline, we discover the primary drivers that make ${mainKw} so effective. `,
        outro: `Ultimately, implementing these guidelines guarantees a clearer path to mastery.`,
        hook: `A detailed inspection of the core fundamentals of ${mainKw}.`
      };
  }
}

/**
 * Generates the 10 distinct variation details for a topic and tone.
 */
function getVariationDetails(
  topic: string,
  topicTitle: string,
  tone: Tone,
  modifier: ReturnType<typeof getToneModifiers>
) {
  const kw = extractKeywords(topic);
  const mainKw = kw[0] || "Topic Focus";
  const secKw = kw[1] || "Growth Focus";

  return [
    // Angle 0: The Tactical Action Guide
    {
      titleSuffix: "The Tactical Action Guide",
      intro: `${modifier.prefix}Success in ${mainKw} is not built on complex theory; it is the result of concrete, repeatable daily actions. We need to focus on what actually works on the ground level.`,
      section1Header: "1. Simplify Your Setup",
      section1Body: `First, eliminate redundant tools that distract from ${mainKw}. Keep your workspace, data structures, and focus laser-targeted on the immediate goals of your project.`,
      section2Header: "2. The 30-Minute Daily Block",
      section2Body: `Dedicate 30 minutes every morning to pure, uninterrupted execution of ${secKw}. Do not check emails, do not answer messages—just focus entirely on this single high-leverage task.`,
      section3Header: "3. Constant Iterative Adjustments",
      section3Body: `Review your results at the end of every week. Identify the exact bottlenecks holding you back and apply micro-adjustments immediately rather than waiting for massive, painful overhauls.`,
      conclusionHeader: "Executing the Blueprint",
      conclusionBody: `When you treat ${mainKw} as a set of logical daily habits, success becomes inevitable. ${modifier.outro}`,
      bullets: [
        "Audit and delete 2 non-essential steps in your current routine.",
        "Set an alarm for a focused, distraction-free execution window.",
        "Track weekly performance metrics to make data-driven improvements."
      ],
      cta: "Standardize your workflow today and reclaim your focus."
    },

    // Angle 1: The Contrarian Manifesto (Myth-Busting)
    {
      titleSuffix: "The Contrarian Manifesto",
      intro: `${modifier.hook} Most of what you hear about ${mainKw} is completely outdated, recycled fluff designed to sell courses rather than get results. It's time to bust some popular myths.`,
      section1Header: "Myth #1: The Volume Trap",
      section1Body: `You've been told that more volume is always better. In reality, throwing high volumes of unoptimized work at ${secKw} just amplifies your failures. You must prioritize pristine quality first.`,
      section2Header: "Myth #2: The Hidden Tools Obsession",
      section2Body: `People love searching for 'secret tools' or magic solutions. The truth is, standard, free, accessible systems are already 10x more powerful than you need if you execute them with consistency.`,
      section3Header: "Myth #3: Avoiding Friction Is Safe",
      section3Body: `Growth only happens where friction exists. Embracing the uncomfortable learning curve of ${mainKw} is the ultimate competitive advantage that your lazy competitors are actively avoiding.`,
      conclusionHeader: "A Fresh Outlook",
      conclusionBody: `Stop following the generic crowd. Focus on the core mechanics, challenge conventional wisdom, and let actual results speak for themselves. ${modifier.outro}`,
      bullets: [
        "Identify 3 popular 'best practices' that are actively wasting your time.",
        "Double down on the single boring fundamental you've been avoiding.",
        "Measure results by conversions and actual output, not visual metrics."
      ],
      cta: "Stop copying the generic templates. Build something truly authentic today."
    },

    // Angle 2: The Future Trends & Horizon Report
    {
      titleSuffix: "The Horizon Shift & Future Trends",
      intro: `${modifier.prefix}The environment surrounding ${mainKw} is experiencing a massive paradigm shift. Traditional approaches are quickly becoming obsolete as automation and machine learning take center stage.`,
      section1Header: "1. Hyper-Personalization Models",
      section1Body: `Generic, broad strategies no longer capture attention. Tomorrow's winners in ${secKw} will leverage deep contextual parameters to deliver highly relevant, user-focused outcomes.`,
      section2Header: "2. Autonomous Execution Layers",
      section2Body: `By automating manual bottlenecks, you can shift your intellectual energy from low-level mechanics to high-level system architecture and creative decision making.`,
      section3Header: "3. Predictive Data Modeling",
      section3Body: `Instead of reviewing static past logs, next-generation players use real-time trends to pivot before bottlenecks even manifest, maintaining uninterrupted operational velocity.`,
      conclusionHeader: "Preparing for Tomorrow",
      conclusionBody: `The future of ${mainKw} belongs to those who adapt before they are forced to. ${modifier.outro}`,
      bullets: [
        "Audit manual steps that can be safely automated with modern tooling.",
        "Incorporate a real-time analytics loop to monitor shifts instantly.",
        "Shift 20% of your current budget toward next-generation experimentation."
      ],
      cta: "Adopt these future-ready patterns before the market shifts."
    },

    // Angle 3: The 3-Pillar Core Architecture
    {
      titleSuffix: "The 3-Pillar Architecture",
      intro: `${modifier.hook} When you strip away the noise, mastering ${mainKw} boils down to three structural columns. If any of these pillars are weak, the entire structure will collapse.`,
      section1Header: "Pillar I: Absolute Strategic Clarity",
      section1Body: `You must define exactly what success looks like for ${mainKw}. Without clear, measurable, and realistic parameters, any road will take you to the wrong destination.`,
      section2Header: "Pillar II: Execution Velocity",
      section2Body: `The speed at which you test, ship, and iterate is your greatest competitive advantage. A decent plan executed with extreme speed beats a perfect plan executed next month.`,
      section3Header: "Pillar III: Feedback Loop Integrity",
      section3Body: `You must establish channels that capture high-integrity data regarding your performance in ${secKw}. Strip away emotions and let objective metrics drive your next iteration.`,
      conclusionHeader: "Strengthening the Base",
      conclusionBody: `By systematically strengthening each of these three columns, you create a robust, scalable system that can withstand any external market pressure. ${modifier.outro}`,
      bullets: [
        "Document a single, clear, binary metric of success for your current project.",
        "Reduce your approval cycle to ship features or ideas within 24 hours.",
        "Establish an unbiased weekly audit process to review raw performance data."
      ],
      cta: "Align these three essential pillars and solidify your foundation today."
    },

    // Angle 4: The Case Study (Real-World Triumph)
    {
      titleSuffix: "The Case Study: A Turnaround Story",
      intro: `${modifier.prefix}A few months ago, we worked with an innovative system struggling to make any meaningful progress with ${mainKw}. The team was exhausted, resources were depleted, and metrics were flat.`,
      section1Header: "The Core Diagnostic Mess",
      section1Body: `The primary mistake was trying to manage too many variables at once. By focusing on five different channels for ${secKw}, they were spreading their energy too thin and achieving zero traction.`,
      section2Header: "The Aggressive Pivot",
      section2Body: `We immediately ordered a complete shutdown of secondary projects. We consolidated their efforts onto a single, high-leverage channel, standardizing their approach to ${mainKw} with absolute focus.`,
      section3Header: "The Growth Compound",
      section3Body: `Within 45 days, the metrics experienced a dramatic shift. Operational friction dropped by 40%, team velocity doubled, and they unlocked a sustainable 10x return on their focused effort.`,
      conclusionHeader: "Key Takeaway",
      conclusionBody: `This turnaround proves that scaling is not about doing more—it's about doing the core elements with perfect precision. ${modifier.outro}`,
      bullets: [
        "Read the baseline data to pinpoint where the team is currently leaking focus.",
        "De-prioritize at least 3 active side-quests to save creative energy.",
        "Implement a 'one-focus' rule for the next 30 days and watch metrics soar."
      ],
      cta: "Learn from this turnaround and unlock your own breakthrough results."
    },

    // Angle 5: The Diagnostic Audit & Scorecard
    {
      titleSuffix: "The Diagnostic Performance Audit",
      intro: `${modifier.hook} How healthy is your current approach to ${mainKw}? Before you spend another dollar or hour, you must diagnose your exact position. Let's do a quick scorecard assessment.`,
      section1Header: "Factor A: Process Friction Index",
      section1Body: `Does executing ${mainKw} feel like pulling teeth? If your setup requires extensive manual coordination or complex workarounds, your friction index is dangerously high.`,
      section2Header: "Factor B: Iteration Velocity Index",
      section2Body: `How long does it take for an idea to go from concept to deployment in ${secKw}? If this loop takes longer than a week, you are losing valuable feedback to market latency.`,
      section3Header: "Factor C: Metric Alignment Index",
      section3Body: `Are you tracking vanity metrics, or are you measuring numbers that directly influence the bottom line of your project? True health relies on high-integrity indicators.`,
      conclusionHeader: "Calculating Your Score",
      conclusionBody: `By scoring these factors from 1 to 10, you can instantly see the exact bottlenecks holding you back from high performance. ${modifier.outro}`,
      bullets: [
        "Rate your current execution friction on a scale of 1 (smooth) to 10 (broken).",
        "Measure the exact number of days it takes to launch a simple change.",
        "Consolidate your dashboard to show only the 3 most critical growth numbers."
      ],
      cta: "Score your current setup now and systematically eliminate the operational waste."
    },

    // Angle 6: Problem-Agitate-Solve (PAS)
    {
      titleSuffix: "Overcoming the Hardest Challenges",
      intro: `${modifier.prefix}Let's be completely honest: managing ${mainKw} is often incredibly frustrating. You spend hours researching, writing, and configuring, only to see minimal traction. It feels like shouting into a void.`,
      section1Header: "The Real Cost of Delay",
      section1Body: `Every single week you spend running an unoptimized strategy is a week of wasted momentum and lost revenue. This constant spinning of wheels drains your creative energy and leads directly to burnout.`,
      section2Header: "Why Simple Fixes Fail",
      section2Body: `Most people try to solve this by purchasing another software subscription or copying standard trends, which only adds unnecessary noise to an already cluttered system.`,
      section3Header: "The Ultimate Framework Solution",
      section3Body: `The solution is a complete architectural reset. Strip away the fluff, implement a standardized local workflow, and double down on high-converting copywriting templates that deliver instant value in ${secKw}.`,
      conclusionHeader: "Taking Control",
      conclusionBody: `You don't have to keep struggling with complex models. By adopting this streamlined approach, you reclaim absolute control over your project. ${modifier.outro}`,
      bullets: [
        "Stop searching for external validation and analyze your raw internal data.",
        "Draft a single core message that directly addresses your audience's main pain point.",
        "Launch a simplified, high-converting offer within the next 48 hours."
      ],
      cta: "Resolve the frustration today—embrace a simpler, higher-impact framework."
    },

    // Angle 7: The Masterclass Deep Dive
    {
      titleSuffix: "The Masterclass Deep Dive",
      intro: `${modifier.hook} Welcome to this comprehensive deep dive. Today, we are breaking down the absolute fundamentals and advanced strategic parameters required to truly master ${mainKw} at an elite level.`,
      section1Header: "1. Historical & Contextual Evolution",
      section1Body: `To understand where ${mainKw} is going, we must analyze where it came from. The transition from manual, static content models to dynamic, personalized systems has rewritten the rules of engagement.`,
      section2Header: "2. Advanced Optimization Protocols",
      section2Body: `Elite-level results in ${secKw} require systematic split-testing. You must continuously pitch variation angles against each other under controlled settings to verify performance uplift.`,
      section3Header: "3. Scalable Asset Management",
      section3Body: `High performers treat their generated output not as temporary posts, but as evergreen media assets that can be repurposed, cross-compiled, and cataloged for long-term compound value.`,
      conclusionHeader: "Academic Summary",
      conclusionBody: `Proficiency is built on rigorous execution, continuous testing, and structural integrity. Keep practicing these core disciplines daily. ${modifier.outro}`,
      bullets: [
        "Map out an evergreen content matrix that can be repurposed across 5 distinct channels.",
        "Establish a clean, labeled storage archive for all high-performing assets.",
        "Schedule an advanced review session to study top-performing competitors."
      ],
      cta: "Unlock the advanced curriculum. Explore our deep-dive archives today."
    },

    // Angle 8: The FAQ & Q&A Spotlight
    {
      titleSuffix: "FAQ: Top Questions Answered",
      intro: `${modifier.prefix}When it comes to building an efficient strategy for ${mainKw}, several key questions pop up continuously. Let's answer the most critical inquiries directly with zero fluff.`,
      section1Header: "Q1: How long does it take to see actual results?",
      section1Body: `With a structured, clean baseline, you will see a noticeable drop in execution friction immediately. Meaningful metrics in ${secKw} typically start compounding within 14 to 30 days of consistent execution.`,
      section2Header: "Q2: Do I need expensive corporate software?",
      section2Body: `Absolutely not. Some of the most successful projects operate entirely on free, open-source, or highly accessible local text models and cloud spreadsheets. It is the execution that matters, not the tool.`,
      section3Header: "Q3: How do I know if my copy is converting?",
      section3Body: `Monitor your click-through rates, active saves, and direct sign-ups. If your audience is taking the specific actions you request, your copy is working. Otherwise, adjust your hook and try again.`,
      conclusionHeader: "The Next Step",
      conclusionBody: `If you have more questions, the best way to get answers is to start executing and let the live market feedback guide your path. ${modifier.outro}`,
      bullets: [
        "Write down your top 3 operational questions and test them with real experiments.",
        "Refrain from buying any new software for the next 30 days.",
        "Review your audience engagement metrics to identify clear conversion trends."
      ],
      cta: "Have more complex questions? Drop them in our community forum for expert advice."
    },

    // Angle 9: The Executive ROI Blueprint
    {
      titleSuffix: "The Executive ROI Blueprint",
      intro: `${modifier.hook} For directors, founders, and decision makers, ${mainKw} is not just an aesthetic consideration—it is a critical driver of return on investment and bottom-line growth. Let's look at the financial leverage.`,
      section1Header: "1. Operational Cost Mitigation",
      section1Body: `Standardizing copy production and strategy reduces human-hour waste by up to 60%. This direct reduction in overhead instantly boosts your project's net margins.`,
      section2Header: "2. Enterprise Scaling Velocity",
      section2Body: `A reliable, automated system allows your team to expand its output in ${secKw} exponentially without requiring a proportional increase in headcount or budget.`,
      section3Header: "3. Customer Lifetime Value Compound",
      section3Body: `High-converting, strategic brand messaging builds strong customer relationships, increasing repeat transactions and reducing user churn rates across all verticals.`,
      conclusionHeader: "The Strategic Conclusion",
      conclusionBody: `Investing in structured brand copywriting and strategic systems is the highest-leverage decision an executive can make. ${modifier.outro}`,
      bullets: [
        "Calculate the exact hours your team currently wastes on unoptimized drafting.",
        "Implement a structured template library to save critical execution time.",
        "Review client acquisition cost metrics to optimize your strategic ad copy."
      ],
      cta: "Scale your returns and maximize your strategic leverage today."
    }
  ];
}

/**
 * Main content database and generator function.
 * Supports exactly 10 distinct variations (0-9) to allow non-linear cycling.
 */
export function generateLocalContent(
  topic: string,
  contentType: ContentType,
  tone: Tone,
  length: Length,
  iterationIndex: number = 0
): string {
  if (!topic || !topic.trim()) {
    return "Error: Please describe a topic first.";
  }

  // Ensure iterationIndex is bound between 0 and 9
  const index = Math.abs(Math.floor(iterationIndex)) % 10;

  const topicTitle = capitalizeTopic(topic);
  const kw = extractKeywords(topic);
  const mainKw = kw[0] || "Topic Focus";
  const secondaryKw = kw[1] || "Growth & Strategy";
  const modifier = getToneModifiers(tone, topic);
  const vars = getVariationDetails(topic, topicTitle, tone, modifier);
  const currentVar = vars[index] || vars[0];

  // FORMAT OUTPUT BASED ON CONTENT TYPE
  switch (contentType) {
    case "Blog Post": {
      const heading1 = currentVar.section1Header;
      const heading2 = currentVar.section2Header;
      const heading3 = currentVar.section3Header;
      const concTitle = currentVar.conclusionHeader;

      if (length === "Short") {
        return `# ${topicTitle}: ${currentVar.titleSuffix}

${currentVar.intro}

## ${heading1}
${currentVar.section1Body}

### Key Actionable Guidelines:
${currentVar.bullets.map(b => `* **Execute**: ${b}`).join("\n")}

${currentVar.conclusionBody}

***
👉 **Takeaway**: ${currentVar.cta}
`;
      }

      if (length === "Medium") {
        return `# ${topicTitle}: ${currentVar.titleSuffix}

${currentVar.intro}

## ${heading1}
${currentVar.section1Body}

## ${heading2}
${currentVar.section2Body}

### Action Steps:
${currentVar.bullets.map((b, i) => `${i + 1}. ${b}`).join("\n")}

## ${concTitle}
${currentVar.conclusionBody}

***
👉 **Strategic Recommendation**: ${currentVar.cta}
`;
      }

      // Long
      return `# The Definitive Guide to ${topicTitle} (${currentVar.titleSuffix})

${currentVar.intro}

---

## Part 1: ${heading1}
${currentVar.section1Body}

Our analysis shows that failing to address this initial column accounts for over 80% of the friction experienced in ${secondaryKw}. Correcting this setup immediately creates breathing room for rapid scale.

---

## Part 2: ${heading2}
${currentVar.section2Body}

> "Consistency in the boring fundamentals of ${mainKw} will out-perform flashes of uncoordinated brilliance every single time."

---

## Part 3: ${heading3}
${currentVar.section3Body}

### Step-by-Step Execution Checklist:
${currentVar.bullets.map(b => `* [ ] **Active Task**: ${b}`).join("\n")}

---

## Part 4: ${concTitle}
${currentVar.conclusionBody}

***
💡 **Action Plan**: ${currentVar.cta}
`;
    }

    case "Instagram Caption": {
      const hashtags = kw.map(k => `#${k.toLowerCase()}`).join(" ") + ` #creo #writing #${tone.toLowerCase()} #angle${index}`;

      if (length === "Short") {
        return `✨ **${topicTitle} | ${currentVar.titleSuffix}** ✨

${currentVar.intro.substring(0, 150)}...

👉 **Core Task**: ${currentVar.bullets[0]}

🚀 ${currentVar.cta}

👇 Drop a comment below if you are ready to implement!

.
.
.
${hashtags}`;
      }

      if (length === "Medium") {
        return `💡 **${topicTitle} - ${currentVar.titleSuffix}**

${currentVar.intro}

🔥 **How to conquer this:**
1️⃣ ${currentVar.bullets[0]}
2️⃣ ${currentVar.bullets[1]}

⚡ ${currentVar.cta}

👇 What is your biggest hurdle with ${mainKw}? Let's chat!

.
.
.
${hashtags}`;
      }

      // Long
      return `📢 **THE DEEP BREAKDOWN: ${topicTitle}** (${currentVar.titleSuffix}) 📢

${currentVar.intro}

Let's dive straight into the 3 rules you need to execute starting today:

📌 **1. ${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**
${currentVar.section1Body}

📌 **2. ${currentVar.section2Header.replace(/^\d+\.\s*/, "")}**
${currentVar.section2Body}

📌 **3. Actionable Checklist:**
${currentVar.bullets.map(b => `✅ ${b}`).join("\n")}

💬 **Your Turn:** ${currentVar.cta} Leave your thoughts or questions below! 👇

.
.
.
${hashtags}`;
    }

    case "LinkedIn Post": {
      const tags = `#leadership #productivity #strategy #creo #angle${index}`;

      if (length === "Short") {
        return `The most successful modern projects recognize that **${topicTitle}** (${currentVar.titleSuffix}) requires absolute clarity.

${currentVar.intro}

Here is the immediate next step:
💡 ${currentVar.bullets[0]}

${currentVar.cta}

Agree? Let's discuss in the comments.

${tags}`;
      }

      if (length === "Medium") {
        return `A critical takeaway regarding **${topicTitle}** (${currentVar.titleSuffix}) for your professional schedule:

${currentVar.intro}

### Two Key Frameworks to Consider:
1. **${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**: ${currentVar.section1Body.substring(0, 180)}...
2. **${currentVar.section2Header.replace(/^\d+\.\s*/, "")}**: ${currentVar.section2Body.substring(0, 180)}...

### Immediate Action Checklist:
${currentVar.bullets.map(b => `✔ ${b}`).join("\n")}

${currentVar.cta}

Let's connect in the comments to discuss how you're handling this.

${tags}`;
      }

      // Long
      return `I used to believe that **${topicTitle}** was overly complicated. 

I was completely wrong. It boils down to structured execution. Here is the blueprint of **${currentVar.titleSuffix}**:

### The Problem
Too many teams spread their attention across a dozen metrics in ${secondaryKw}, leading to massive friction and zero compound growth. 

### The Solution: Three Key Pillars
1. **${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**
   ${currentVar.section1Body}

2. **${currentVar.section2Header.replace(/^\d+\.\s*/, "")}**
   ${currentVar.section2Body}

3. **${currentVar.section3Header.replace(/^\d+\.\s*/, "")}**
   ${currentVar.section3Body}

### Your Step-by-Step Checklist:
${currentVar.bullets.map(b => `🔹 ${b}`).join("\n")}

${currentVar.conclusionBody}

👉 **Executive Action**: ${currentVar.cta}

What has been your team's experience with ${mainKw}? Let's start a conversation below.

${tags}`;
    }

    case "Twitter/X Thread": {
      const baseTweet = (num: number, text: string) => `${num}/5 🧵 **${topicTitle} - ${currentVar.titleSuffix}**\n\n${text}`;

      if (length === "Short") {
        return `1/3 🧵 **${topicTitle} (${currentVar.titleSuffix})**

${currentVar.intro}

---

2/3 Here is your concrete checklist to optimize:
• ${currentVar.bullets[0]}
• ${currentVar.bullets[1]}

---

3/3 ${currentVar.cta} 

Retweet the first tweet if you found this valuable!`;
      }

      if (length === "Medium") {
        return `1/5 🧵 **${topicTitle} | ${currentVar.titleSuffix}**

${currentVar.intro}

Open this thread for the direct breakdown... 👇

---

2/5 🚀 **${currentVar.section1Header}**

${currentVar.section1Body}

---

3/5 ⚡ **${currentVar.section2Header}**

${currentVar.section2Body}

---

4/5 📋 **Immediate Checklist:**
• ${currentVar.bullets[0]}
• ${currentVar.bullets[1]}
• ${currentVar.bullets[2]}

---

5/5 **The Wrap Up**

${currentVar.cta} 

Follow and bookmark for more templates!`;
      }

      // Long
      return `1/7 🧵 **${topicTitle} | The Masterclass** (${currentVar.titleSuffix})

${currentVar.intro}

Let's walk through the exact steps to build a high-converting loop... 👇

---

2/7 📌 **Part 1: ${currentVar.section1Header}**

${currentVar.section1Body}

---

3/7 📌 **Part 2: ${currentVar.section2Header}**

${currentVar.section2Body}

---

4/7 📌 **Part 3: ${currentVar.section3Header}**

${currentVar.section3Body}

---

5/7 📋 **Actionable Checklist to Deploy Today:**
• ${currentVar.bullets[0]}
• ${currentVar.bullets[1]}

---

6/7 💡 **Strategic Takeaway:**
${currentVar.conclusionBody}

---

7/7 🚀 **Final Action Plan:**
${currentVar.cta}

RT the first tweet to help others master ${mainKw}!`;
    }

    case "YouTube Script": {
      if (length === "Short") {
        return `[SCENE: Fast transition, high-impact background audio begins]
[VISUAL: Dynamic text overlays on screen: "${topicTitle} - ${currentVar.titleSuffix}"]

**HOST (High energy, smiling):**
"If you are still struggling with **${topicTitle}**, listen up because this 60-second strategy is going to shift everything!"

[SCENE: Zoom on host holding a tablet with a diagnostic chart]

**HOST:**
"Most creators try to jump straight to advanced scaling, but you need to master the basics first! ${currentVar.intro.substring(0, 100)}..."

[SCENE: Graphic list showing the checklist]

**HOST:**
"Here is your plan: First, ${currentVar.bullets[0]}. Second, ${currentVar.bullets[1]}. It is literally that straightforward!"

[SCENE: Call to Action card with subscribe button pulsing]

**HOST:**
"${currentVar.cta} Leave a comment below with your score, and hit that subscribe button right now. See ya!"
`;
      }

      if (length === "Medium") {
        return `=========================================
🎥 VIDEO TITLE: The Real Blueprint for ${topicTitle} (${currentVar.titleSuffix})
⏱️ DURATION: ~5 Minutes (Standard Video Script)
=========================================

[0:00 - 0:45] PART 1: THE HOOK
-----------------------------------------
[Visual: Clean, modern studio. Ambient background lights.]
[Audio: Smooth, modern synth-pop track starts playing softly.]

**HOST:**
"We've all seen the videos promising easy shortcuts for ${mainKw}. But let's cut through the fluff and look at a logical framework. ${currentVar.intro}"

[0:45 - 2:00] PART 2: THE DEEP STRATEGY
-----------------------------------------
[Visual: High-quality b-roll of a professional taking neat notes.]

**HOST:**
"First, let's look at: **${currentVar.section1Header}**. ${currentVar.section1Body} This reduces setup friction instantly."

[2:00 - 3:45] PART 3: THE STEP-BY-STEP CHECKLIST
-----------------------------------------
[Visual: Over-the-shoulder screen recording showing specific settings.]

**HOST:**
"Next, we move to: **${currentVar.section2Header}**. ${currentVar.section2Body} 

To implement this starting today, follow this 3-step checklist:
1. ${currentVar.bullets[0]}
2. ${currentVar.bullets[1]}
3. ${currentVar.bullets[2]}"

[3:45 - 5:00] PART 4: CONCLUSION & CTA
-----------------------------------------
[Visual: Host smiling, pointing down toward the description box.]

**HOST:**
"Remember, consistency beats temporary motivation. ${currentVar.cta} 

If this video brought you value, smash that like button and comment below which step you are setting up first. Subscribe for more, and I'll see you in the next deep dive!"
`;
      }

      // Long
      return `=========================================
🎥 VIDEO TITLE: The Masterclass Guide to ${topicTitle}
⏱️ SERIES: ${currentVar.titleSuffix}
⏱️ DURATION: ~10 Minutes (Full-Length Playbook)
=========================================

[0:00 - 1:30] SECTION 1: THE INTRO & STRATEGIC VISION
-----------------------------------------
[Visual: Cinematic intro graphics. Title slide: "Mastering ${mainKw}: ${currentVar.titleSuffix}".]
[Audio: Inspiring, high-quality cinematic orchestra transition.]

**HOST:**
"Welcome back, everyone! Today, we are laying out a complete tactical playbook on **${topicTitle}**. This isn't your standard general overview—we are digging into the precise details that build real results. ${currentVar.intro}"

---

[1:30 - 4:00] SECTION 2: THE PRIMARY CODES
-----------------------------------------
[Visual: High-contrast title card: "Phase 1 - Structure".]

**HOST:**
"Let's jump into the first major vector: **${currentVar.section1Header}**. ${currentVar.section1Body}"

**HOST:**
"Most people skip this step because it feels too simple. But without this baseline, your subsequent efforts in ${secondaryKw} are completely wasted."

---

[4:00 - 6:30] SECTION 3: THE WORKFLOW BRIDGE
-----------------------------------------
[Visual: Animated breakdown on screen showing steps sliding into a timeline.]

**HOST:**
"Once your setup is consolidated, we introduce the second key vector: **${currentVar.section2Header}**. ${currentVar.section2Body}"

**HOST:**
"And here is: **${currentVar.section3Header}**. ${currentVar.section3Body}"

---

[6:30 - 8:30] SECTION 4: THE ACTION CHECKLIST
-----------------------------------------
[Visual: Clean, highly readable bulleted checklist on screen.]

**HOST:**
"To help you execute this blueprint immediately, write down this exact action checklist:
• First: ${currentVar.bullets[0]}
• Second: ${currentVar.bullets[1]}
• Third: ${currentVar.bullets[2]}"

---

[8:30 - 10:00] SECTION 5: SUMMARY & NEXT STEPS
-----------------------------------------
[Visual: Host back in center frame. Soft fade out of background music.]

**HOST:**
"Ultimately, success boils down to focused execution of the basics. ${currentVar.conclusionBody}

${currentVar.cta}

If you want the downloadable template of this entire guide, click the link in the pin comment. Make sure to subscribe, turn on that notification bell, and leave your thoughts below. Keep building, and I will catch you in the next masterclass!"
`;
    }

    case "Product Description": {
      const taglines = [
        `The elite strategic package designed to optimize ${mainKw} instantly.`,
        `The only toolkit built for creators seeking perfection in ${secondaryKw}.`,
        `Unlock the ultimate competitive advantage and scale your system today.`
      ];

      if (length === "Short") {
        return `# The **${topicTitle}** Performance Pack (${currentVar.titleSuffix})

**${taglines[0]}**

${currentVar.intro.substring(0, 180)}...

### Product Features:
* **${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**: Engineered to eliminate friction and maximize output.
* **Rapid Deployment Checklist**: Included templates to help you ${currentVar.bullets[0].toLowerCase()}.

👉 **Buy Now**: ${currentVar.cta}
`;
      }

      if (length === "Medium") {
        return `# The **${topicTitle}** Custom Toolkit (${currentVar.titleSuffix})

**${taglines[1]}**

${currentVar.intro}

### Key Specifications & Features:
* **Feature 1: ${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**  
  ${currentVar.section1Body}

* **Feature 2: ${currentVar.section2Header.replace(/^\d+\.\s*/, "")}**  
  ${currentVar.section2Body}

### What's Included in the Bundle:
1. The Core **${topicTitle}** Playbook
2. 3 High-Convertible Templates:
   * Template A: ${currentVar.bullets[0]}
   * Template B: ${currentVar.bullets[1]}
3. Direct Access to Lifetime Upgrades

***
👉 **Purchase Today**: ${currentVar.cta}
`;
      }

      // Long
      return `# The **${topicTitle}** Professional System (${currentVar.titleSuffix})

**${taglines[2]}**

${currentVar.intro}

---

## Why Choose the ${topicTitle} System?

### 1. Unified Operational Strategy
Most toolkits offer generic templates that ignore brand context. Our suite is designed with absolute flexibility, adapting seamlessly to the critical requirements of ${mainKw}.

### 2. Built-In High Leverage
* **${currentVar.section1Header}**  
  ${currentVar.section1Body}

* **${currentVar.section2Header}**  
  ${currentVar.section2Body}

* **${currentVar.section3Header}**  
  ${currentVar.section3Body}

---

## Detailed Action Plan Included:
${currentVar.bullets.map(b => `* **Standard Workflow**: ${b}`).join("\n")}

---

## Technical Specs & Requirements:
* **Format**: Digital cross-compiled markdown & rich-text spreadsheets.
* **Compatibility**: Universal integration across all standard mobile and desktop environments.
* **License**: Unlimited personal and commercial project permission.

***
🔥 **Secure Your Access**: ${currentVar.cta}
`;
    }

    case "Email": {
      const subject = `Subject: [Masterclass] Your blueprint for ${topicTitle} (${currentVar.titleSuffix})`;
      const previewText = `Preview: Here is the raw truth about optimizing ${mainKw}...`;

      if (length === "Short") {
        return `${subject}
${previewText}

Hi Creator,

${currentVar.intro}

Here is a quick, high-leverage task for you to tackle today:
👉 **Action**: ${currentVar.bullets[0]}

${currentVar.cta}

Best regards,
The Creo Team
`;
      }

      if (length === "Medium") {
        return `${subject}
${previewText}

Hi Creator,

I hope you are having an exceptional, highly productive week.

${currentVar.intro}

Let's break down two key items you can optimize in your routine starting today:

1. **${currentVar.section1Header.replace(/^\d+\.\s*/, "")}**  
   ${currentVar.section1Body}

2. **${currentVar.section2Header.replace(/^\d+\.\s*/, "")}**  
   ${currentVar.section2Body}

### Your Priority To-Do List:
${currentVar.bullets.map((b, i) => `[ ] Step ${i + 1}: ${b}`).join("\n")}

${currentVar.cta}

Best,
The Creo Team
`;
      }

      // Long
      return `${subject}
${previewText}

Hi Creator,

If you have been following our strategy updates for a while, you know we focus on stripping away complexity and focusing on real-world leverage. 

Today, let's explore **${topicTitle}** through a highly strategic lens: **${currentVar.titleSuffix}**.

${currentVar.intro}

---

## The 3-Part Operational Framework

Here are the critical elements we have established to drive high performance:

### Pillar 1: ${currentVar.section1Header.replace(/^\d+\.\s*/, "")}
${currentVar.section1Body}

### Pillar 2: ${currentVar.section2Header.replace(/^\d+\.\s*/, "")}
${currentVar.section2Body}

### Pillar 3: ${currentVar.section3Header.replace(/^\d+\.\s*/, "")}
${currentVar.section3Body}

---

## Your Steps for Immediate Action

To help you put this structural framework into play right now, review this priority to-do list:
${currentVar.bullets.map(b => `* [ ] **Priority Task**: ${b}`).join("\n")}

${currentVar.conclusionBody}

👉 **Immediate Next Step**: [Reserve your seat for our live masterclass](${currentVar.cta})

Let's build something remarkable.

Warm regards,
The Creo Team
`;
    }

    default:
      return `# ${topicTitle}

${currentVar.intro}

## ${currentVar.section1Header}
${currentVar.section1Body}

## ${currentVar.section2Header}
${currentVar.section2Body}

***
👉 ${currentVar.cta}
`;
  }
}
