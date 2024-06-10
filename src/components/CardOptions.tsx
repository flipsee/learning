import { Button } from "@mui/material";

type Props = {
  choices: string[] | number[];
  clickEvent: Function;
};

const CardOptions = ({ choices, clickEvent }: Props) => {
  return (
    <>
      {choices.map(function (value: string | number, i: any) {
        return (
          <Button
            key={i}
            variant="contained"
            size="small"
            onClick={() => clickEvent(value)}
          >
            {value}
          </Button>
        );
      })}
    </>
  );
};
export default CardOptions;
