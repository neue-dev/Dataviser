'''
 # @ Author: Mo David
 # @ Create Time: 2024-06-28 17:58:14
 # @ Modified time: 2024-06-28 17:58:22
 # @ Description:

 This file tests our implementation of the df monad.
 '''

class df:
  '''
  This class defines a wrapper around dataframe instances.
  '''

  def __init__(self, dataframe):
    self._dataframe = dataframe

  def map(self, f):
    '''
    This function maps the dataframe to its new value using the given callback.
    If the dataframe is invalid, we don't bother executing the function.
    '''

    # The dataframe was invalid
    if this._dataframe is None:
      return df(None)

    # Map the original value elsewhere
    return df(f(self._dataframe))