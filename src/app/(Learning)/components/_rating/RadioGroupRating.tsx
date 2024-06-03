import * as React from "react";
import { styled } from "@mui/material/styles";
import Rating, { IconContainerProps } from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import Typography from "@mui/material/Typography";
import { useInput } from "@/common/helpers";

const StyledRating = styled(Rating)(({ theme }) => ({
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}));

const customIcons: {
  [index: string]: {
    icon: React.ReactElement;
    label: string;
  };
} = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon color="error" />,
    label: "Total blackout, complete failure to recall the information.",
  },
  2: {
    icon: <SentimentDissatisfiedIcon color="error" />,
    label:
      "Incorrect response, but upon seeing the correct answer it felt familiar.",
  },
  3: {
    icon: <SentimentNeutralIcon color="error" />,
    label:
      "Incorrect response, but upon seeing the correct answer it seemed easy to remember.",
  },
  4: {
    icon: <SentimentSatisfiedIcon color="warning" />,
    label: "Correct response, but required significant effort to recall.",
  },
  5: {
    icon: <SentimentSatisfiedAltIcon color="success" />,
    label: "Correct response, after some hesitation.",
  },
  6: {
    icon: <SentimentVerySatisfiedIcon color="success" />,
    label: "Correct response with perfect recall.",
  },
};

function IconContainer(props: IconContainerProps) {
  const { value, ...other } = props;
  return <span {...other}>{customIcons[value].icon}</span>;
}

export default function RadioGroupRating({
  getRating,
}: {
  getRating: Function;
}) {
  const [ratingLegend, setRatingLegend, resetRatingLegend] = useInput("");
  return (
    <>
      <StyledRating
        name="rating-flashcard"
        IconContainerComponent={IconContainer}
        getLabelText={(value: number) => customIcons[value].label}
        // onChangeActive={(event: React.SyntheticEvent, value: number) => {
        //   if (value && customIcons[value])
        //     setRatingLegend(customIcons[value].label);
        //   //else resetRatingLegend();
        // }}
        highlightSelectedOnly
        max={6}
        onChange={(event, newValue) => {
          getRating(newValue);
        }}
      />
      {/* <br />
      <Typography component="legend">{ratingLegend}</Typography> */}
    </>
  );
}
