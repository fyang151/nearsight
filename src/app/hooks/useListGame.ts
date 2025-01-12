// TODO: refactor to avoid repeat logic in game hooks

import { useState, useEffect } from "react";

import championIcons from "../data/championIcons";
import champions from "../data/champions.json";

import { useGameProps } from "../types/champion";

export const useRandomGame = ({
  xPixels,
  yPixels,
  isGrayScale,
}: useGameProps) => {};
