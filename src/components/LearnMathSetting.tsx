import React, { useState, useEffect } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  PlayCircleOutline as PlayCircleOutlineIcon,
  StopCircle as StopCircleIcon,
} from "@mui/icons-material";
import { Mode } from "@/types/types";
import BaseCard from "./BaseCard";

type Props = {
  setting: {
    min: number;
    max: number;
    operator: string;
    mode: Mode;
  };
  setSetting: Function;
  playing: boolean;
  startStopLearningSession: Function;
};

const LearMathSetting = ({
  setting,
  setSetting,
  playing,
  startStopLearningSession,
}: Props) => {
  const [operator, setOperator] = useState(setting.operator);
  const [min, setMin] = useState(setting.min);
  const [max, setMax] = useState(setting.max);
  const [mode, setMode] = useState<Mode>(setting.mode);

  useEffect(() => {
    setSetting({
      min,
      max,
      operator,
      mode,
    });
  }, [min, max, operator, mode]);

  return (
    <Grid item xs={12} lg={12}>
      <BaseCard title="Settings">
        <Stack spacing={2}>
          <FormControl fullWidth sx={{ m: 1, minWidth: 150 }}>
            <Stack direction="row" spacing={1}>
              <Stack>
                <InputLabel id="label-operator">Operator</InputLabel>
                <Select
                  label="Operator"
                  labelId="label-operator"
                  id="select-operator"
                  value={setting.operator}
                  onChange={(e) => setOperator(e.target.value)}
                  autoWidth
                  disabled={playing}
                >
                  <MenuItem value="+">Addition</MenuItem>
                  <MenuItem value="-">Substraction</MenuItem>
                  <MenuItem value="*">Multiplication</MenuItem>
                  <MenuItem value="/">Subtraction</MenuItem>
                </Select>
              </Stack>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="From:"
                  id="label-number-from"
                  type="number"
                  variant="outlined"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  disabled={playing}
                />
                <TextField
                  label="To:"
                  id="label-number-to"
                  type="number"
                  variant="outlined"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  disabled={playing}
                />
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Study</Typography>
                <Switch
                  id="switch-mode"
                  defaultChecked
                  onChange={(e) =>
                    setMode(e.target.checked ? Mode.Quiz : Mode.Study)
                  }
                  disabled={playing}
                />
                <Typography>Quiz</Typography>
              </Stack>
              <Button
                variant="contained"
                onClick={() => startStopLearningSession()}
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
  );
};

export default LearMathSetting;
