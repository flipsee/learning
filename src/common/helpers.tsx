import { FlashCard, QuizType } from "@/types/types";
import { useState } from "react";

export const useInput = (initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  return [value, (e: any) => setValue(e), () => setValue(initialValue)];
};

export const generateRandomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const exportJSON = (obj: object, filename: string) => {
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const basicCalculateNumber = (num1: number, num2: number, operator: string) => {
  switch (operator) {
    case "+":
      return num1 + num2;
      break;
    case "-":
      return num1 - num2;
      break;
    case "*":
      return num1 * num2;
      break;
    case "/":
      if (num2 == 0) throw new Error("Division by Zero error");
      return parseFloat((num1 / num2).toFixed(2));
      break;
    default:
      throw new Error("Invalid operator");
  }
};

export const generateNewMathQuestion = (
  num1: number,
  num2: number,
  operator: string
): FlashCard => {
  let choiceCount = 3;

  let result: FlashCard = {
    id: `${num1} ${operator} ${num2}`,
    type: QuizType.MultipleChoice,
    question: `${num1} ${operator} ${num2}`,
    answer: 0,
  };

  result.answer = basicCalculateNumber(num1, num2, operator);

  var wrongAnswers: number[] = [];

  //add close choice
  wrongAnswers.push(basicCalculateNumber(num1 - 1, num2, operator));
  wrongAnswers.push(basicCalculateNumber(num1 + 1, num2, operator));
  // wrongAnswers.push(basicCalculateNumber(num1, num2 - 1, operator));
  // wrongAnswers.push(basicCalculateNumber(num1, num2 + 1, operator));

  //add random choice, if choice count still less than the required choice
  while (wrongAnswers.length < choiceCount) {
    let wrong = Math.floor(Math.random() * (num1 * num2)) + 1;
    if (wrong !== result.answer && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }

  var allAnswers = [result.answer, ...wrongAnswers]; //combine choice (correct & wrong choice)

  result.choices = allAnswers.sort(() => Math.random() - 0.5); //randomize Choices

  return result;
};

/**
 * Quality:
    0: "Total blackout", complete failure to recall the information.
    1: Incorrect response, but upon seeing the correct answer it felt familiar.
    2: Incorrect response, but upon seeing the correct answer it seemed easy to remember.
    3: Correct response, but required significant effort to recall.
    4: Correct response, after some hesitation.
    5: Correct response with perfect recall.
 */
export const evaluateQuiz = (
  card: FlashCard,
  isCorrect: boolean,
  quality?: number
) => {
  let calculatedQuality = 4;
  if (isCorrect) {
    //Correct, 3 to 5
    if (card.repetitions && card.repetitions <= 2) calculatedQuality = 3;
    else if (card.repetitions && card.repetitions <= 3) calculatedQuality = 4;
    else calculatedQuality = 5;
  } else {
    //Wrong Answer 0 to 2
    if (card.ef && card.ef <= 1.3) calculatedQuality = 0;
    else if (card.ef && card.ef <= 1.5) calculatedQuality = 1;
    else calculatedQuality = 2;
  }

  return updateCardScore(card, quality ? quality : calculatedQuality);
};

//SuperMemo logic to update the question repetition and ef
export const updateCardScore = (card: FlashCard, quality: number) => {
  const MIN_EF = 1.3; // The minimum easiness factor

  // Update the easiness factor
  let newEF =
    (card.ef ? card.ef : MIN_EF) +
    (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < MIN_EF) newEF = MIN_EF; // EF cannot go below 1.3

  // Update repetitions and interval
  if (quality < 3) {
    // If quality is less than 3, start repetitions from the beginning, but do not change the EF
    card.repetitions = 0;
    card.interval = 1;
  } else {
    // Otherwise, increase the number of repetitions and calculate the new interval
    card.repetitions = card.repetitions ? card.repetitions + 1 : 1; //repetitions + 1
    if (card.repetitions === 1) {
      card.interval = 1;
    } else if (card.repetitions === 2) {
      card.interval = 6;
    } else {
      card.interval = Math.round((card.interval ? card.interval : 1) * newEF);
    }
  }

  card.ef = newEF; // Update the easiness factor in the card
  card.lastAttempt = new Date(); // Update last attempt
  return card;
};

export const getRandomQuestionFromDeck = (
  deck: FlashCard[]
): FlashCard | null => {
  return deck && deck.length > 0
    ? deck[Math.floor(Math.random() & deck.length)]
    : null;
};
export const sortDeckbyField = (
  deck: FlashCard[],
  field: string
): FlashCard[] | null => {
  return deck.sort((a, b) => {
    //sort by interval
    if (a.interval && b.interval && a.interval > b.interval) return 1;
    if (a.interval && b.interval && a.interval < b.interval) return -1;

    //sort by Last Attempt
    if (a.lastAttempt && b.lastAttempt && a.lastAttempt > b.lastAttempt)
      return 1;
    if (a.lastAttempt && b.lastAttempt && a.lastAttempt < b.lastAttempt)
      return -1;

    return 0;
  });
  return null;
};
