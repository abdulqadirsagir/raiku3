export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  difficulty: Difficulty;
}

export enum Difficulty {
  Simple = 'Simple',
  Challenging = 'Challenging',
  Hard = 'Hard',
}