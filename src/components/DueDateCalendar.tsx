import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useTaskManager } from '../hooks/useTaskManager';
import type { Task } from '../types/task';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const normalizeDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const DueDateCalendar: React.FC = () => {
  const { tasks } = useTaskManager();
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const tasksByDay = useMemo(() => {
    const map: Record<number, Task[]> = {};
    tasks.forEach(task => {
      if (!task.dueDate) return;
      const due = new Date(task.dueDate);
      if (due.getFullYear() !== currentMonth.getFullYear() || due.getMonth() !== currentMonth.getMonth()) {
        return;
      }
      const day = due.getDate();
      map[day] = map[day] ? [...map[day], task] : [task];
    });
    return map;
  }, [tasks, currentMonth]);

  const selectedDate = useMemo(() => {
    const now = new Date();
    return normalizeDay(now);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startWeekday = currentMonth.getDay();

  const handlePrev = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNext = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const tasksToday = tasksByDay[selectedDate.getDate()] || [];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-md space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <CalendarDays size={18} />
          <h3 className="text-sm font-semibold">Agenda de Prazos</h3>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft size={18} />
          </button>
          <button onClick={handleNext} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-gray-700 dark:text-gray-200 font-medium mb-2">
        {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </div>

      <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 dark:text-gray-400">
        {WEEKDAYS.map(day => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startWeekday }, (_, idx) => (
          <div key={`empty-${idx}`} className="h-10" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasTasks = !!tasksByDay[day];
          const isToday =
            normalizeDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)).getTime() === selectedDate.getTime();
          return (
            <button
              key={`day-${day}`}
              type="button"
              className={`h-10 rounded-lg border transition-colors ${
                isToday
                  ? 'bg-blue-500 text-white border-blue-400'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              disabled
            >
              <div className="text-center text-[10px]">{day}</div>
              {hasTasks && (
                <div className="h-1 mt-1 w-1 mx-auto rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
        {Object.keys(tasksByDay).length === 0
          ? 'Nenhuma tarefa com data de vencimento neste mês.'
          : `Dias com tarefas marcadas: ${Object.keys(tasksByDay).join(', ')}`}
      </div>

      {tasksToday.length > 0 && (
        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900 rounded-lg text-xs text-gray-800 dark:text-gray-100">
          <p className="font-semibold">Tarefas para hoje ({selectedDate.toLocaleDateString('pt-BR')}):</p>
          <ul className="list-disc list-inside">
            {tasksToday.map(task => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
