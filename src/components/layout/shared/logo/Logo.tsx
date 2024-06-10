import Link from "next/link";
import { styled } from "@mui/material";
import Image from "next/image"; 

const LinkStyled = styled(Link)(() => ({
  height: "40px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => { 
  return (
    <LinkStyled href="/">
      <Image src={process.env.NEXT_PUBLIC_BASE_PATH + "/next.svg"} alt="logo" height={40} width={105} priority />
    </LinkStyled>
  );
};

export default Logo;
