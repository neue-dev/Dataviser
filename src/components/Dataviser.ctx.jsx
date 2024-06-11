/**
 * @ Author: Mo David
 * @ Create Time: 2024-06-11 18:55:32
 * @ Modified time: 2024-06-11 19:00:45
 * @ Description:
 * 
 * Stores most of the trivial app state, such as launch, themes, etc.
 */

import { createContext } from 'react'

export const DataviserContext = createContext({
  showTitle: true,
});

export default DataviserContext;