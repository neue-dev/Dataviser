'''
 # @ Author: Mo David
 # @ Create Time: 2024-06-28 17:58:14
 # @ Modified time: 2024-06-28 17:58:22
 # @ Description:

 This file has our definitions of the variables we will be using throughout the environment.
 It inits all the stuff we need.
 '''

META = {}   # Stores the metadata for each df
REF = {}    # The reference of dataframes we use to reset 'DFS'
DFS = {}    # Stores the actual dataframes
OUT = {}    # Always stores the dfs we retrieve in JS
IDS = []    # The ids of the dataframes we'll be using
EXC = []    # The ids to exclude

# Progress log
print('PYTHON: Loaded df.py.')
