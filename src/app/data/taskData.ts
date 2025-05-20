// src/app/data/tasksData.ts
export interface Task {
    id: number;
    title: string;
    date: string; // ISO string o dd/MM/yyyy
    time: string; // e.g. "09:00 AM"
  }
  
  export const tasksData: Task[] = [
    { id: 1, title: 'Riego de Bonsái', date: '2025-05-20', time: '09:00 AM' },
    { id: 2, title: 'Fertilización', date: '2025-05-20', time: '10:00 AM' },
    { id: 3, title: 'Poda Rosa', date: '2025-05-21', time: '08:30 AM' },
    // …más tareas
  ];
  