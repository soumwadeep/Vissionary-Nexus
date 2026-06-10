// Goal classifier - detect goal type from user input
export interface GoalClassification {
  goalType: string;
  confidence: number;
  isResumeIntent?: boolean;
}

const goalKeywords: Record<string, string[]> = {
  hackathon: ["hackathon", "hack", "competition", "contest", "win", "prize"],
  startup: ["startup", "build a startup", "launch", "business", "company"],
  learning: ["learn", "study", "course", "tutorial", "skill", "teach", "education"],
  career: ["career", "job", "interview", "resume", "promotion", "hire"],
  team_building: ["team", "teammates", "find team", "join team", "recruit", "collaborate"],
  project_building: ["project", "build", "create", "make", "develop", "app", "software"],
  web3: ["web3", "blockchain", "crypto", "nft", "defi", "smart contract", "solidity"],
  blockchain: ["blockchain", "web3", "crypto", "nft", "defi", "smart contract", "solidity"],
};

const resumeKeywords = [
  "continue my previous goal",
  "resume my goal",
  "continue where i left off",
  "show my active goals",
  "what's my progress",
  "what is my progress",
  "my active goals",
  "my goals",
];

export function classifyGoal(goal: string): GoalClassification {
  const lowerGoal = goal.toLowerCase();
  let bestType = "general";
  let maxMatches = 0;
  let isResumeIntent = false;

  // Check for resume intent first
  for (const phrase of resumeKeywords) {
    if (lowerGoal.includes(phrase)) {
      isResumeIntent = true;
      break;
    }
  }

  // Now check for goal type
  for (const [type, keywords] of Object.entries(goalKeywords)) {
    let matches = 0;
    for (const keyword of keywords) {
      if (lowerGoal.includes(keyword)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestType = type;
    }
  }

  // Calculate confidence
  const confidence = Math.min(1, maxMatches / 3); // Max confidence 1.0 with 3+ matches

  return {
    goalType: bestType,
    confidence,
    isResumeIntent,
  };
}
