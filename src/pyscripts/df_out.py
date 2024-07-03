'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-03 20:01:41
 # @ Modified time: 2024-07-03 20:01:46
 # @ Description:

 Saves the transformed dataframes to the output variable.
 '''

try:

  # Reset the output variable
  OUT = {}
  
  # For each DF, we save it's df as a dict
  for key in DFS:
    OUT[key] = DFS[key].to_dict('dict')

  # Reset the dfs
  DFS = REF

except NameError:
  print('PYTHON: I don\'t think DFS has been defined.')
