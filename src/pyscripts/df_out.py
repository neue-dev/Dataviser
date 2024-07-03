'''
 # @ Author: Mo David
 # @ Create Time: 2024-07-03 20:01:41
 # @ Modified time: 2024-07-03 20:01:46
 # @ Description:

 Saves the transformed dataframes to the output variable.
 '''

# Reset the output first
OUT = {}

'''
We check for options here first.
Because of how Python works, we have to wrap each in a try-catch.
'''
try:
  ORIENT
except: 
  ORIENT = 'dict'

'''
We generate the output here.
We have to return both the new dfs and their corresponding metadata.
'''
try:

  # For each DF, we save it's df as a dict
  for key in DFS:

    # Create entries for each df
    OUT[key] = {
      'df': DFS[key].to_dict(ORIENT),
      'meta': META[key]
    }

  # Reset the dfs
  DFS = REF

except NameError:
  print('PYTHON: I don\'t think DFS has been defined.')
