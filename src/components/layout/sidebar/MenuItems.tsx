import { IconHome, IconAbacus, IconAbc, IconCards } from "@tabler/icons-react";

import { uniqueId } from "lodash";

export type MenuitemType = {
  id: string;
  title: string;
  icon: typeof IconHome;
  href: string;
  subheader?: string;
};

const Menuitems: MenuitemType[] = [
  {
    id: uniqueId(),
    title: "Home",
    icon: IconHome,
    href: "/",
  },
  {
    id: uniqueId(),
    title: "Learn Basic Math",
    icon: IconAbacus,
    href: "/learnMath",
  },
  {
    id: uniqueId(),
    title: "Learn Spelling (WIP)",
    icon: IconAbc,
    href: "/learnSpelling",
  },
  {
    id: uniqueId(),
    title: "Flash Cards (WIP)",
    icon: IconCards,
    href: "/flashCards",
  },
];

export default Menuitems;
