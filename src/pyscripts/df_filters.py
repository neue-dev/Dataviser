'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-03 13:53:37
 # @ Modified time: 2024-07-03 19:59:35
 # @ Description:

 This file filters dataframes for specific rows, columns, or other things.
 '''

import pandas as pd

def dfFilterMeta(dfs, meta, metafilter):
  '''
  Filters all the dataframes using their metadata.

  @param    dfs         The actual dataframes to filter.
  @param    meta        The metadata of the dataframes.
  @param    metafilter  The ranges we use to filter the metadata.
  @return               A subset of dfs that have the proper metadata.
  '''
  
  # For each dataframe
  for df_key in dfs:
    to_remove = False
    metadata = meta[df_key]

    # Check if it goes outside the ranges or smth
    for meta_key in metafilter:
      if metadata[meta_key] not in metafilter[meta_key]:
        to_remove = True

    # Remove the df if it does
    if to_remove:
      del dfs[df_key]

  return dfs

def dfFilterRows(dfs, col, rows):
  '''
  Filters dfs by their row values in a particular column.

  @param    dfs   The dfs to filter.
  @param    col   The col whose row values to look at.
  @param    rows  The admissible values for the rows we're filtering.
  @return         The same collection of dfs but filtered.
  '''

  # For each dataframe...
  for df_key in dfs:
    df = dfs[df_key] 

    # Include all rows when an empty list is provided
    if len(rows) == 0:
      continue

    # Do the filtering
    if col == 'index':
      df = df.loc[df.index.isin(rows)]
    else: 
      df = df.loc[df[col].isin(rows)]

    # Save the filtered df
    dfs[df_key] = df

  return dfs

def dfFilterCols(dfs, cols):
  '''
  Filters dfs by their col names.

  @param    dfs   The dfs to filter.
  @param    cols  The columns to include in the filter..
  @return         The same collection of dfs but filtered.
  '''

  for df_key in dfs:

    # Include all cols when an empty list is provided
    if len(cols) == 0:
      continue

    # Filter the df by column names
    dfs[df_key] = dfs[df_key].filter(items=cols)

  return dfs

print('PYTHON: Loaded df_filters.py.')