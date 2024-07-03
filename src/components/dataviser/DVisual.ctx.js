/**
 * @ Author: Mo David
 * @ Create Time: 2024-07-03 03:49:19
 * @ Modified time: 2024-07-03 07:13:32
 * @ Description:
 * 
 * This stores the state of a given chart or visualization.
 */

import { UtilsContext } from "../utils/utils.context"

export const DVisualCtx = UtilsContext({
  isMuted: false,   // When we mute a vis, we prevent it from consuming resources by not rendering it live
  data: [],         // The actual data the vis is rendering
});

export default {
  DVisualCtx,
}