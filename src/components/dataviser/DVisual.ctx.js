/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-03 03:51:18
 * @ Description:
 * 
 * This stores the state of a given chart or visualization.
 */

import { createContext } from "react";

export const DVisualContextInitial = {
  isMuted: false,   // When we mute a vis, we prevent it from consuming resources by not rendering it live
  data: [],         // The actual data the vis is rendering
};

export const DVisualContext = createContext(DVisualContextInitial);

export default {
  DVisualContextInitial,
  DVisualContext,
}