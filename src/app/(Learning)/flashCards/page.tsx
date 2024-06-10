"use client";
import React, { useState, useEffect } from "react";
import {
  Grid,
  Stack,
  TextField,
  FormLabel,
  InputLabel,
  Chip,
  FormControl,
  Button,
  Select,
  MenuItem,
  Switch,
  Slider,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import BaseCard from "@/components/BaseCard";
import DoneIcon from "@mui/icons-material/Done";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";
import DangerousIcon from "@mui/icons-material/Dangerous";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import LoopIcon from "@mui/icons-material/Loop";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import RadioGroupRating from "@/components/RadioGroupRating";

//Common-Start
import { Mode, LearningSession, Attempt, FlashCard } from "@/types/types";
import {
  exportJSON,
  useInput,
  updateCardScore,
  evaluateQuiz,
  getRandomQuestionFromDeck,
} from "@/common/helpers";

import { RotateCard } from "@/common/styles";
//Common-End

let sampleDeck = [
  {
    id: 1,
    type: 0,
    question: "anjing",
    remark: "dog",
  },
  {
    id: 2,
    type: 0,
    question: "kucing",
    remark: "cat",
  },
  {
    id: 3,
    type: 0,
    question: "harimau",
    remark: "tiger",
  },
  {
    id: 4,
    type: 0,
    question: "beruang",
    remark: "bear",
  },
  {
    id: 5,
    type: 0,
    question: "burung",
    remark: "bird",
  },
];

const FlashCards = () => {
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
    document.title = `Basic Math Game`;
  }, [playing]);

  const updateLastCardinDeck = (card: FlashCard) => {
    let tempDeck = deck;
    tempDeck.pop();
    setDeck([...tempDeck, card]);
  };

  const logAttempt = (isCorrect: boolean, rating?: number) => {
    if (question) {
      //log Attempt Analytics
      let temp: Attempt = {
        flashCardId: question.id,
        mode: Mode.Quiz, //Study or Quiz Mode?
        isCorrect: isCorrect, // is it correct answer?
        answerTime: (Date.now().valueOf() - startQuestionTime.valueOf()) / 1000, // how long does it takes for the user to answer (just for info)
        timestamp: new Date(), // when the Attempt was done DateTime
      };
      setAttempt((oldArray) => [...oldArray, temp]);

      //recalculate Question EF & update score last record of the Deck
      updateLastCardinDeck(evaluateQuiz(question, isCorrect, rating));
    }
  };

  const getLearningRating = (rating: number) => {
    logAttempt(rating <= 3 ? false : true, rating - 1);
    setQuestion(getNextQuestion()); //generate Next Question
  };

  const handleChoiceOnClick = (selectedAnswer: string | number) => {
    //check answer
    if (question) {
      if (selectedAnswer === question.answer) {
        //Correct answer
        setCorrectScore(correctScore + 1); //add correct Score
        setShowCorrect(true); //display correct Card
        logAttempt(true);

        setQuestion(getNextQuestion()); //continue with next question
        startQuestionTime = Date.now(); //set answer timer
      } else {
        //Wrong answer
        setWrongScore(wrongScore + 1); //add wrong score
        setShowWrong(true); //display wrong card
        logAttempt(false);
      }
    }

    //hide the corrent & wrong cards (if its displayed)
    setTimeout(() => {
      resetShowCorrect();
      resetShowWrong();
    }, 1000);
  };

  const getNextQuestion = (): FlashCard => {
    //from the deck select questions and filter based on interval

    //else if not found, generate a new Math Questions based on the params
    let result: FlashCard | null = getRandomQuestionFromDeck(deck);
    return result ? result : ({} as FlashCard);
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
      let report = {
        cards: deck,
        LearningSession: endSession,
      };
      console.log(`report ${JSON.stringify(report)}`); //report
      let fileName = `LearningSession_${endSession.user}_${endSession.startTime
        .toISOString()
        .slice(0, 10)}`;
      exportJSON(report, fileName); //export

      //reset state
      resetPlaying(); //Stop Playing
      resetCorrectScore();
      resetWrongScore();
      setQuestion(null);
      setAttempt([]);
      setLearningSession(null);
    } else {
      setDeck(sampleDeck); //load the playing deck

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
    <Grid container spacing={1}>
      <Grid item xs={12} lg={12}>
        <BaseCard title="Settings">
          <Stack spacing={2}>
            <FormControl fullWidth sx={{ m: 1, minWidth: 150 }}>
              <Stack direction="row" spacing={1}>
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
                  variant="contained"
                  onClick={handleButtonStartStop}
                  startIcon={
                    playing ? <StopCircleIcon /> : <PlayCircleOutlineIcon />
                  }
                >
                  {playing ? "Stop" : "Start"}
                </Button>
              </Stack>
            </FormControl>
          </Stack>
        </BaseCard>
      </Grid>

      <Grid item xs={12} lg={12}>
        <BaseCard title="Basic Math Game">
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
                <CardHeader
                  title={
                    playing
                      ? "Select the correct answer"
                      : "Click Start to Play!"
                  }
                ></CardHeader>
                <CardContent>
                  <Typography variant="h2" component="div">
                    {question ? question.question : ""}
                    {mode == Mode.Study && question
                      ? ` = ${question.answer}`
                      : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  {/* {
                    //Quiz Mode, render the Choices
                    mode == Mode.Quiz && question && <LoopIcon />
                  } */}

                  {
                    //Study Mode, render the Rating
                    mode == Mode.Study && question && (
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

export default FlashCards;
