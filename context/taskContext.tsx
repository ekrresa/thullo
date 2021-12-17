import * as React from 'react';

interface ITaskContext {
  taskId: string;
  handleTaskId: (taskId: string) => void;
}

const TaskContext = React.createContext<ITaskContext>({
  taskId: '',
  handleTaskId: () => {},
});

export function TaskProvider({ children }: React.PropsWithChildren<unknown>) {
  const [taskId, setTaskId] = React.useState('');

  const handleTaskId = React.useCallback((taskId: string) => setTaskId(taskId), []);

  return (
    <TaskContext.Provider value={{ taskId, handleTaskId }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const taskContext = React.useContext(TaskContext);

  if (taskContext === undefined) {
    throw new Error('Component is not within TaskProvider');
  }

  return taskContext;
}
