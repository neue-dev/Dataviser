'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-03 13:29:12
 # @ Modified time: 2024-07-03 13:29:14
 # @ Description:

 This takes in the variable 'dfs' (which it assumes is already defined) and returns a new dict 'DFS'.
 The new dict contains all the dicts in 'dfs' but as actual pandas dataframes.
 '''

import pandas as pd

# !THIS SHOULD BE MOVED ELSEWHERE AND SHUD BE SWAPPABLE FOR OTHER LOGIC
def preprocess(df):
  '''
  Preprocesses the df and makes sure it has the right columns and rows.
  '''

  # Set the index and columns
  df = df.set_index(0)
  df.columns = df.iloc[0]
  
  # Grab all the numeric columns and convert them
  cols = df.columns #.drop('')
  df[cols] = df[cols].apply(pd.to_numeric, errors='coerce').fillna(0)

  return df

# In case we haven't imported dfs yet
try:

  # For each piece of data in the dict, we save it
  for key in dfs:

    # Create the dataframe and its meta data
    REF[key] = preprocess(pd.DataFrame(dfs[key]['df']))
    DFS[key] = REF[key]
    META[key] = dfs[key]['meta']

    # If the sum df hasn't been defined yet
    if 'sum' not in DFS:
      META['sum'] = {}
      DFS['sum'] = DFS[key]

    # Get total of all dataframes too
    else:
      DFS['sum'] = DFS['sum'].add(DFS[key], fill_value=0).fillna(0)
    
  # Since we didn't modify anything, we just set OUT to dfs
  OUT = dfs

# dfs was most likely undefined
except NameError:
  print('PYTHON: It seems \'dfs\' is undefined...')
  
