export enum Mode {
  Study,
  Quiz,
}

export enum QuizType {
  MultipleChoice,
  MultipleAnswer,
  Input,
}

export type LearningSession = {
  user: string;
  startTime: Date;
  completedTime?: Date;
  attempt?: Attempt[];
};

export type Attempt = {
  flashCardId: string | number;
  mode: Mode; //Study or Quiz Mode?
  isCorrect: boolean; // is it correct answer?
  answerTime: number; // how long does it takes to answer
  timestamp: Date; // when the Attempt was done DateTime
  rating?: number;
};

export type FlashCard = {
  id: string | number;
  type: QuizType;
  question: string;
  answer?: string | string[] | number | number[];
  remark?: string;
  choices?: string[] | number[];
  lastAttempt?: Date;
  repetitions?: number; // Number of times the card successfully recalled (meaning it was given quality ≥ 3/correct answer) in a row since the last time it was not.
  interval?: number; // Current interval for the card for review, in days
  ef?: number; // Easiness factor: determines how quickly the inter-repetition interval grows, default 2.5
  //lastResultCorrect: boolean,
};

export type ReviewBucket = {
  immediate: FlashCard[]; //immediate review
  soon: FlashCard[]; //review after 5min
  later: FlashCard[]; //review after 10min
};
