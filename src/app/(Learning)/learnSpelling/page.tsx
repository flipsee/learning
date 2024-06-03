"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  TextField,
  FormLabel,
  Chip,
  FormControl,
  Button,
  Select,
  MenuItem,
  Switch,
} from "@mui/material";

import BaseCard from "@/app/(Learning)/components/_shared/BaseCard";
import DoneIcon from "@mui/icons-material/Done";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import DangerousIcon from "@mui/icons-material/Dangerous";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import RadioGroupRating from "@/app/(Learning)/components/_rating/RadioGroupRating";

//Common-Start
import {
  Mode,
  LearningSession,
  Attempt,
  FlashCard,
  QuizType,
} from "@/types/types";
import {
  generateRandomNumber,
  generateNewMathQuestion,
  exportJSON,
  useInput,
} from "@/common/helpers";
//Common-End

const LearnSpelling = () => {
  const [operator, setOperator] = useState("*");
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(10);
  const [mode, setMode] = useState<Mode>(Mode.Quiz);

  const [showCorrect, setShowCorrect, resetShowCorrect] = useInput(false);
  const [showWrong, setShowWrong, resetShowWrong] = useInput(false);
  const [playing, setPlaying, resetPlaying] = useInput(false);
  const [correctScore, setCorrectScore, resetCorrectScore] = useInput(0);
  const [wrongScore, setWrongScore, resetWrongScore] = useInput(0);

  const [deck, setDeck] = useState<FlashCard[]>([]); //FlashCards Deck
  const [question, setQuestion] = useState<FlashCard | null>(null); //Current FlashCard

  const [learningSession, setLearningSession] =
    useState<LearningSession | null>(null);
  const [attempt, setAttempt] = useState<Attempt[]>([]);

  const user = "me";
  let startQuestionTime = Date.now();

  useEffect(() => {
    document.title = `Math Game`;
  }, [playing]);

  const getLearningRating = (rating: number) => {
    console.log(`Parent rating: ${rating}`);
  };

  const handleChoiceOnClick = (selectedAnswer: string | number) => {
    let isCorrect = false;

    //check answer
    if (question) {
      if (selectedAnswer === question.answer) {
        //Correct answer
        setCorrectScore(correctScore + 1); //add correct Score
        setShowCorrect(true); //display correct Card

        setQuestion(getNextQuestion()); //continue with next question
        startQuestionTime = Date.now(); //set answer timer
        isCorrect = true;
      } else {
        //Wrong answer
        setWrongScore(wrongScore + 1); //add wrong score
        setShowWrong(true); //display wrong card
      }

      //log Attempt Analytics
      let temp: Attempt = {
        flashCardId: question.id,
        mode: Mode.Quiz, //Study or Quiz Mode?
        isCorrect: isCorrect, // is it correct answer?
        answerTime: (Date.now().valueOf() - startQuestionTime.valueOf()) / 1000, // how long does it takes for the user to answer (just for info)
        timestamp: new Date(), // when the Attempt was done DateTime
      };
      setAttempt((oldArray) => [...oldArray, temp]);
      //console.log(JSON.stringify(attempt));
    }

    //hide the corrent & wrong cards (if its displayed)
    setTimeout(() => {
      resetShowCorrect();
      resetShowWrong();
    }, 1000);
  };

  const getNextQuestion = (): FlashCard => {
    let num1 = generateRandomNumber(min, max); //randomize Num1
    let num2 = generateRandomNumber(min, max); //randomize Num2

    //check if the Num1, Num2, operator combination already in the existing FlashCards?
    if (deck) {
      let existingQuestion = deck.find(
        (obj) => obj.id === `${num1} ${operator} ${num2}`
      );
      if (existingQuestion != undefined) {
        existingQuestion.choices?.sort(() => Math.random() - 0.5);
        return existingQuestion;
      }
    }

    //else if not found, generate a new Math Questions based on the params
    let result: FlashCard = generateNewMathQuestion(num1, num2, operator); //generate new Math Question

    setDeck((oldArray) => [...oldArray, result]); //append to the FlashCards list

    return result;
  };

  const handleButtonStartStop = () => {
    if (playing == true) {
      //Stop the Learning Session
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

      //print analytics to the console
      //TO DO; offer user to download analytics as json
      console.log(`FlashCards ${JSON.stringify(deck)}`); //Flashcards
      console.log(`SessionResult ${JSON.stringify(endSession)}`); //Learning Session
      let fileName = `LearningSession_${endSession.user}_${endSession.startTime
        .toISOString()
        .slice(0, 10)}`;
      exportJSON(endSession, fileName); //export

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <BaseCard title="Math Game - Settings">
          <Stack spacing={5}>
            <FormControl fullWidth>
              <Stack spacing={2}>
                <FormLabel id="label-operator">Operator</FormLabel>
                <Select
                  id="select-operator"
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                >
                  <MenuItem value="+">Addition</MenuItem>
                  <MenuItem value="-">Substraction</MenuItem>
                  <MenuItem value="*">Multiplication</MenuItem>
                  <MenuItem value="/">Subtraction</MenuItem>
                </Select>
                <FormLabel id="label-number-from">Range</FormLabel>
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="From:"
                    id="label-number-from"
                    type="number"
                    variant="outlined"
                    value={min}
                    onChange={(e) => setMin(Number(e.target.value))}
                  />
                  <TextField
                    label="To:"
                    id="label-number-to"
                    type="number"
                    variant="outlined"
                    value={max}
                    onChange={(e) => setMax(Number(e.target.value))}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography>Study</Typography>
                    <Switch
                      id="switch-mode"
                      defaultChecked
                      onChange={(e) =>
                        setMode(e.target.checked ? Mode.Quiz : Mode.Study)
                      }
                    />
                    <Typography>Quiz</Typography>
                  </Stack>
                  <Button
                    variant="outlined"
                    onClick={handleButtonStartStop}
                    startIcon={
                      playing ? <StopCircleIcon /> : <PlayCircleOutlineIcon />
                    }
                  >
                    {playing ? "Stop" : "Start"}
                  </Button>
                </Stack>
              </Stack>
            </FormControl>
          </Stack>
        </BaseCard>
      </Grid>

      <Grid item xs={12} lg={12}>
        <BaseCard title="Math Game">
          <Stack spacing={3}>
            <Stack spacing={3} direction="row">
              {mode == Mode.Quiz && (
                <Chip
                  color="warning"
                  style={{ color: "black" }}
                  icon={<FaceRetouchingNaturalIcon />}
                  label={"Correct: " + correctScore}
                />
              )}
              {mode == Mode.Quiz && (
                <Chip
                  color="secondary"
                  style={{ color: "black" }}
                  icon={<CoronavirusIcon />}
                  label={"wrong: " + wrongScore}
                />
              )}
              {mode == Mode.Quiz && showCorrect && (
                <Chip color="success" icon={<DoneIcon />} label="Correct" />
              )}
              {mode == Mode.Quiz && showWrong && (
                <Chip
                  color="error"
                  icon={<DangerousIcon />}
                  label="Try Again"
                />
              )}
            </Stack>
            <Grid container direction="column" alignItems="center">
              <Card variant="outlined">
                <CardHeader title="Select the correct choice"></CardHeader>
                <CardContent>
                  <Typography variant="h2" component="div">
                    {question ? question.question : ""}
                    {mode == Mode.Study && question
                      ? ` = ${question.answer}`
                      : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  {
                    //Quiz Mode, render the Choices
                    mode == Mode.Quiz &&
                      question &&
                      question.choices &&
                      question.choices.map(function (value, i) {
                        return (
                          <Button
                            key={i}
                            variant="contained"
                            size="small"
                            onClick={() => handleChoiceOnClick(value)}
                          >
                            {value}
                          </Button>
                        );
                      })
                  }

                  {
                    //Study Mode, render the Rating
                    mode == Mode.Study && (
                      <RadioGroupRating getRating={getLearningRating} />
                    )
                  }
                </CardActions>
              </Card>
            </Grid>
          </Stack>
        </BaseCard>
      </Grid>
    </Grid>
  );
};

export default LearnSpelling;
