export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar_url?: string;
  score: number;
  difficulty: Difficulty;
  last_played?: string;
  rank?: number;
}

export enum Difficulty {
  Simple = 'Simple',
  Challenging = 'Challenging',
  Hard = 'Hard',
}