"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import BaseCard from "@/components/BaseCard";
import RadioGroupRating from "@/components/RadioGroupRating";
import { Mode, LearningSession, Attempt, FlashCard } from "@/types/types";
import {
  generateRandomNumber,
  generateNewMathQuestion,
  exportJSON,
  useInput,
  evaluateQuiz,
  updateLastCardinDeck,
} from "@/common/helpers";
import LearMathSetting from "@/components/LearnMathSetting";
import Score from "@/components/Score";
import CardOptions from "@/components/CardOptions";

const LearnMath = () => {
  const [playing, setPlaying, resetPlaying] = useInput(false); //Status is Playing?
  const [setting, setSetting] = useState({
    min: 1,
    max: 10,
    operator: "*",
    mode: Mode.Quiz,
  });

  const [answerStatus, setAnswerStatus, resetAnswerStatus] = useInput(null); //flag to show Right Banner

  const [deck, setDeck] = useState<FlashCard[]>([]); //FlashCards Deck
  const [question, setQuestion] = useState<FlashCard | null>(null); //Current FlashCard

  const [learningSession, setLearningSession] =
    useState<LearningSession | null>(null);
  const [attempt, setAttempt] = useState<Attempt[]>([]);
  const [correctScore, setCorrectScore, resetCorrectScore] = useInput(0); //Count of Correct answer
  const [wrongScore, setWrongScore, resetWrongScore] = useInput(0); //Count of Wrong answer

  const user = "me";
  let startQuestionTime = Date.now();

  useEffect(() => {
    document.title = `Learn Basic Math`;
  }, []);

  const getNextQuestion = (): FlashCard => {
    let num1 = generateRandomNumber(setting.min, setting.max); //randomize Num1
    let num2 = generateRandomNumber(setting.min, setting.max); //randomize Num2

    //check if the Num1, Num2, operator combination already in the existing FlashCards?
    if (deck) {
      let existingQuestion = deck.find(
        (obj) => obj.id === `${num1} ${setting.operator} ${num2}`
      );
      if (existingQuestion != undefined) {
        existingQuestion.choices?.sort(() => Math.random() - 0.5);
        return existingQuestion;
      }
    }

    //else if not found, generate a new Math Questions based on the params
    let result: FlashCard = generateNewMathQuestion(
      num1,
      num2,
      setting.operator
    ); //generate new Math Question

    setDeck((oldArray) => [...oldArray, result]); //append to the FlashCards list

    return result;
  };

  const logAttempt = (isCorrect: boolean, rating?: number) => {
    if (question) {
      //Add Attempt as the last item in the list
      setAttempt((oldArray) => [
        ...oldArray,
        {
          flashCardId: question.id,
          mode: setting.mode, //Study or Quiz Mode?
          isCorrect: isCorrect, // is it correct answer?
          answerTime:
            (Date.now().valueOf() - startQuestionTime.valueOf()) / 1000, // how long does it takes for the user to answer (just for info)
          timestamp: new Date(), // when the Attempt was done DateTime
        },
      ]);

      //recalculate Question EF & update score last record of the Deck
      setDeck(
        updateLastCardinDeck(evaluateQuiz(question, isCorrect, rating), deck)
      );
    }
  };

  const handleStartStopSession = () => {
    if (playing == true) {
      //Stop the Learning Session
      if (attempt.length > 0) {
        let endSession: LearningSession = {
          user:
            learningSession && learningSession.user ? learningSession.user : "",
          startTime:
            learningSession && learningSession.startTime
              ? learningSession.startTime
              : new Date(),
          completedTime: new Date(),
          attempt: attempt,
        };

        //offer user to download analytics as json
        let report = {
          cards: deck,
          LearningSession: endSession,
        };
        let fileName = `LearningSession_${
          endSession.user
        }_${endSession.startTime.toISOString().slice(0, 10)}`;
        exportJSON(report, fileName); //export

        //print analytics to the console
        //console.log(`report ${JSON.stringify(report)}`); //report
      }

      //reset state
      resetPlaying(); //Stop Playing
      resetCorrectScore();
      resetWrongScore();
      setQuestion(null);
      setAttempt([]);
      setLearningSession(null);
    } else {
      //Learning Session start
      setLearningSession({
        user: user,
        startTime: new Date(),
        attempt: [],
      });
      setPlaying(true); //start playing
      setQuestion(getNextQuestion()); //generate Next Question
    }
  };

  const handleRating = (rating: number) => {
    logAttempt(rating <= 3 ? false : true, rating - 1);
    setQuestion(getNextQuestion()); //generate Next Question
  };

  const handleChoiceOnClick = (selectedAnswer: string | number) => {
    //check answer
    if (question) {
      if (selectedAnswer === question.answer) {
        //Correct answer
        setCorrectScore(correctScore + 1); //add correct Score
        setAnswerStatus(true); //display correct Card
        logAttempt(true);

        setQuestion(getNextQuestion()); //continue with next question
        startQuestionTime = Date.now(); //set answer timer
      } else {
        //Wrong answer
        setWrongScore(wrongScore + 1); //add wrong score
        setAnswerStatus(false); //display wrong card
        logAttempt(false);
      }
    }

    //hide the corrent & wrong cards (if its displayed)
    setTimeout(() => {
      resetAnswerStatus();
    }, 1000);
  };

  return (
    <Grid container spacing={1}>
      <LearMathSetting
        setting={setting}
        setSetting={setSetting}
        playing={playing}
        startStopLearningSession={handleStartStopSession}
      ></LearMathSetting>
      {playing && (
        <Grid item xs={12} lg={12}>
          <BaseCard title="Basic Math Game">
            <Stack spacing={3}>
              {setting.mode == Mode.Quiz && (
                <Score
                  correctScore={correctScore}
                  wrongScore={wrongScore}
                  answerStatus={answerStatus}
                ></Score>
              )}
              <Grid container direction="column" alignItems="center">
                <Card variant="outlined">
                  <CardHeader title="Select the correct answer"></CardHeader>
                  <CardContent>
                    <Typography variant="h2" component="div">
                      {question
                        ? question.question +
                          (setting.mode == Mode.Study
                            ? ` = ${question.answer}`
                            : "")
                        : ""}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    {question && setting.mode == Mode.Quiz ? (
                      //Quiz Mode, render the Choices
                      <CardOptions
                        choices={question.choices ? question.choices : []}
                        clickEvent={handleChoiceOnClick}
                      />
                    ) : (
                      //Study Mode, render the Rating
                      <RadioGroupRating getRating={handleRating} />
                    )}
                  </CardActions>
                </Card>
              </Grid>
            </Stack>
          </BaseCard>
        </Grid>
      )}
    </Grid>
  );
};

export default LearnMath;
