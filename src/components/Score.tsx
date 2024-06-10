import { Chip, Stack } from "@mui/material";
import {
  Done as DoneIcon,
  FaceRetouchingNatural as FaceRetouchingNaturalIcon,
  Coronavirus as CoronavirusIcon,
  Dangerous as DangerousIcon,
} from "@mui/icons-material";

type Props = {
  correctScore: number;
  wrongScore: number;
  answerStatus: boolean;
};

const Score = ({ correctScore, wrongScore, answerStatus }: Props) => {
  return (
    <Stack spacing={3} direction="row">
      <Chip
        color="warning"
        style={{ color: "black" }}
        icon={<FaceRetouchingNaturalIcon />}
        label={"Correct: " + correctScore}
      />
      <Chip
        color="secondary"
        style={{ color: "black" }}
        icon={<CoronavirusIcon />}
        label={"wrong: " + wrongScore}
      />
      {answerStatus === true && (
        <Chip color="success" icon={<DoneIcon />} label="Correct" />
      )}
      {answerStatus === false && (
        <Chip color="error" icon={<DangerousIcon />} label="Try Again" />
      )}
    </Stack>
  );
};
export default Score;
