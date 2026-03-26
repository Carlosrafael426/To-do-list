# Exemplos de Extensão - Task Mate

Este arquivo contém exemplos de como estender o Task Mate com novos recursos.

## 1. Adicionar Data de Conclusão

### Modificar o tipo Task
```typescript
// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: number; // ← Novo
  priority: Priority;
  category: string;
  createdAt: number;
  dueDate?: number;
}
```

### Update TaskItem para mostrar data
```typescript
// src/components/TaskItem.tsx
const completedDate = task.completedAt
  ? new Date(task.completedAt).toLocaleDateString('pt-BR')
  : null;

{completedDate && (
  <span className="text-xs text-gray-500">
    Concluída em: {completedDate}
  </span>
)}
```

### Update toggleTaskComplete no Context
```typescript
// src/contexts/TaskContext.tsx
const toggleTaskComplete = useCallback((id: string) => {
  setTasks(prev =>
    prev.map(task =>
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? Date.now() : undefined
          } 
        : task
    )
  );
}, []);
```

## 2. Adicionar Subtarefas

### Novo tipo
```typescript
// src/types/task.ts
export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}

export interface Task {
  // ... props existentes
  subtasks?: SubTask[];
}
```

### Novo Hook
```typescript
// src/hooks/useSubTasks.ts
export const useSubTasks = (taskId: string) => {
  const { updateTask, tasks } = useTaskManager();
  
  const addSubTask = (title: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now()
    };
    
    updateTask(taskId, {
      subtasks: [...(task.subtasks || []), newSubTask]
    });
  };
  
  const toggleSubTask = (subTaskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.subtasks) return;
    
    const updated = task.subtasks.map(st =>
      st.id === subTaskId ? { ...st, completed: !st.completed } : st
    );
    
    updateTask(taskId, { subtasks: updated });
  };
  
  return { addSubTask, toggleSubTask };
};
```

## 3. Adicionar Notificações

### Sistema de notificações
```typescript
// src/contexts/NotificationContext.tsx
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    setNotifications(prev => [...prev, newNotification]);
    
    if (notification.duration !== Infinity) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 3000);
    }
  };
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
```

### Componente de notificação
```typescript
// src/components/NotificationContainer.tsx
export const NotificationContainer = () => {
  const { notifications } = useNotifications();
  
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {notifications.map(notification => (
        <Notification key={notification.id} notification={notification} />
      ))}
    </div>
  );
};
```

## 4. Adicionar Tags Customizadas

### Estender Task
```typescript
export interface Task {
  // ... props existentes
  tags?: string[];
}
```

### Componente Tag
```typescript
// src/components/Tag.tsx
export const Tag: React.FC<{ tag: string; onRemove: () => void }> = ({ tag, onRemove }) => (
  <span className="inline-flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
    {tag}
    <button onClick={onRemove}>×</button>
  </span>
);
```

## 5. Adicionar Arquivo de Exportação/Importação

```typescript
// src/utils/export.ts
export const exportTasks = (tasks: Task[]) => {
  const json = JSON.stringify(tasks, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks-${new Date().toISOString()}.json`;
  link.click();
};

export const importTasks = async (file: File): Promise<Task[]> => {
  const text = await file.text();
  return JSON.parse(text);
};
```

## 6. Adicionar Modo Recorrência

```typescript
// src/types/task.ts
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'yearly' | null;

export interface Task {
  // ... props existentes
  recurrence?: RecurrencePattern;
  recurrenceEndDate?: number;
}

// src/utils/recurrence.ts
export const getNextRecurrenceDate = (date: number, pattern: RecurrencePattern): number => {
  const d = new Date(date);
  
  switch (pattern) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  
  return d.getTime();
};
```

## 7. Adicionar Lembretes por Email (com backend)

```typescript
// src/types/task.ts
export interface Reminder {
  id: string;
  taskId: string;
  email: string;
  sendAt: number;
  sent: boolean;
}

// Você precisaria de um backend/API para isso
export const setupReminder = async (reminder: Reminder) => {
  const response = await fetch('/api/reminders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reminder)
  });
  return response.json();
};
```

## 8. Adicionar Busca Avançada

```typescript
// src/components/AdvancedSearch.tsx
export const AdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    hasDescription: false,
    hasDueDate: false,
    isCompleted: false,
    createdAfter: '',
    createdBefore: ''
  });
  
  // Implementar lógica de busca avançada
};
```

## 9. Adicionar Tema Customizável

```typescript
// src/contexts/ThemeContext.tsx
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
}

export const createTheme = (config: Partial<ThemeConfig>): ThemeConfig => {
  return {
    primaryColor: config.primaryColor || '#3b82f6',
    secondaryColor: config.secondaryColor || '#1e40af',
    accentColor: config.accentColor || '#f59e0b',
    fontFamily: config.fontFamily || 'system-ui'
  };
};
```

## 10. Adicionar Sincronização Cloud

```typescript
// src/utils/cloud-sync.ts
import { Task } from '../types/task';

export const syncWithCloud = async (tasks: Task[]) => {
  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks, timestamp: Date.now() })
    });
    return response.json();
  } catch (error) {
    console.error('Sync failed:', error);
  }
};

export const getCloudTasks = async () => {
  const response = await fetch('/api/tasks');
  return response.json();
};
```

---

## Próximos Passos Recomendados

1. **Barra de Progresso**: Mostrar % de tarefas concluídas
2. **Comentários em Tarefas**: Adicionar notas/histórico
3. **Compartilhamento**: Compartilhar tarefas com outros usuários
4. **Integração com Calendário**: Sincronizar com Google Calendar
5. **Atalhos de Teclado**: Ctrl+K para busca, etc.
6. **PWA**: Funcionar offline com service workers
7. **Análise**: Dashboard com gráficos e estatísticas
8. **Colaboração em Tempo Real**: WebSockets para múltiplos usuários

Todos os exemplos acima seguem os mesmos padrões e convenções do projeto.
