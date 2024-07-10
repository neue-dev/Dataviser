'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-06 06:54:53
 # @ Modified time: 2024-07-06 06:54:59
 # @ Description:

 Transforms our dataframes into different forms so we can use them for different datavis things.
 '''

import pandas as pd
import numpy as np

def df_transform_col_sums(dfs):
  '''
  Creates a dataframe with the same columns but with a single row.
  The row contains the sum of all entries per column in the original df.

  @param    df  The dataframes we want to convert.
  @return       A new set of dataframes with the transformed columns.
  '''

  # The output dfs
  out = {}

  # Convert each of the dataframes
  for df in dfs:
    index = dfs[df].index
    out[df] = pd.DataFrame(dfs[df].apply(np.sum, axis=1), index=index).transpose()

  return out
  

def df_transform_row_sums(dfs):
  '''
  Creates a new dataframe with the same row indices but with a single column.
  The column contains the sum of all entries per row in the original df.

  @param    df  The dataframes we want to convert.
  @return       A new set of dataframes with the transformed columns.
  '''

  # The output dfs
  out = {}

  # Convert each of the dataframes
  for df in dfs:
    out[df] = pd.DataFrame(dfs[df].apply(np.sum, axis=1))
  
  return out