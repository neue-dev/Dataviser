'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-03 13:29:12
 # @ Modified time: 2024-07-03 13:29:14
 # @ Description:

 This takes in the variable 'dfs' (which it assumes is already defined) and returns a new dict 'DFS'.
 The new dict contains all the dicts in 'dfs' but as actual pandas dataframes.
 '''

import pandas as pd

META = {}   # Stores the metadata for each df
DFS = {}    # Stores the actual dataframes
OUT = {}    # Always stores the dfs we retrieve in JS

# In case we haven't imported dfs yet
try:

  # For each piece of data in the dict, we save it
  for key in dfs:
    DFS[key] = DF.of(key, pd.DataFrame(dfs[key]['df']))
    META[key] = dfs[key]['meta']
    
  # Since we didn't modify anything, we just set OUT to dfs
  OUT = dfs

  print(OUT);

# dfs was most likely undefined
except NameError:
  print('It seems \'dfs\' is undefined...')
  'It seems \'dfs\' is undefined...'
  
