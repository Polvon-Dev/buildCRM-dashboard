'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { mockTasks } from '@/mock/tasks';
import { mockWorkers } from '@/mock/workers';
import { Task, TaskStatus, TaskPriority } from '@/shared/types';
import { formatDate, getStatusColor, generateId } from '@/shared/lib/utils';
import {
  Plus, Clock, CheckCircle2, AlertTriangle, PlayCircle,
  Calendar, User, Flag, ArrowRight, ArrowUp, ArrowDown,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabTasksPage() {
  const myWorkers = mockWorkers.filter((w) => w.prorabId === PRORAB_ID);
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.filter((t) => t.projectId === PROJECT_ID && t.createdBy === PRORAB_ID)
  );
  const [activeTab, setActiveTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    assignedTo: '',
    dueDate: '',
  });

  const filteredTasks = activeTab === 'all'
    ? tasks
    : tasks.filter((t) => t.status === activeTab);

  const getTabCount = (status: string) => {
    if (status === 'all') return tasks.length;
    return tasks.filter((t) => t.status === status).length;
  };

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) return;
    const task: Task = {
      id: generateId(),
      title: newTask.title,
      description: newTask.description,
      projectId: PROJECT_ID,
      assignedTo: newTask.assignedTo,
      createdBy: PRORAB_ID,
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks([task, ...tasks]);
    setNewTask({ title: '', description: '', priority: 'medium', assignedTo: '', dueDate: '' });
    setDialogOpen(false);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((t) =>
      t.id === taskId
        ? { ...t, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : t.completedAt }
        : t
    ));
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <ArrowUp className="h-3.5 w-3.5 text-red-500" />;
      case 'high': return <ArrowUp className="h-3.5 w-3.5 text-orange-500" />;
      case 'medium': return <ArrowRight className="h-3.5 w-3.5 text-blue-500" />;
      case 'low': return <ArrowDown className="h-3.5 w-3.5 text-gray-400" />;
      default: return null;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Juda muhim';
      case 'high': return 'Yuqori';
      case 'medium': return "O'rta";
      case 'low': return 'Past';
      default: return priority;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-600 border-gray-200',
    };
    return colors[priority] || colors.medium;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'in_progress': return 'Jarayonda';
      case 'completed': return 'Tugallangan';
      case 'overdue': return "Muddati o'tgan";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vazifalar</h1>
          <p className="text-muted-foreground">Barcha vazifalarni boshqaring va kuzating</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi vazifa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yangi vazifa yaratish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sarlavha</label>
                <Input
                  placeholder="Vazifa nomini kiriting"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tavsif</label>
                <Textarea
                  placeholder="Vazifa haqida batafsil..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Muhimlik darajasi</label>
                  <Select
                    value={newTask.priority}
                    onValueChange={(v) => setNewTask({ ...newTask, priority: v as TaskPriority })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Past</SelectItem>
                      <SelectItem value="medium">O&apos;rta</SelectItem>
                      <SelectItem value="high">Yuqori</SelectItem>
                      <SelectItem value="urgent">Juda muhim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Muddat</label>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mas&apos;ul ishchi</label>
                <Select
                  value={newTask.assignedTo}
                  onValueChange={(v) => setNewTask({ ...newTask, assignedTo: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ishchini tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {myWorkers.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.fullName} — {w.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleCreateTask} disabled={!newTask.title || !newTask.assignedTo || !newTask.dueDate}>
                Yaratish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            Barchasi ({getTabCount('all')})
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
            Kutilmoqda ({getTabCount('pending')})
          </TabsTrigger>
          <TabsTrigger value="in_progress" className="text-xs sm:text-sm">
            <PlayCircle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
            Jarayonda ({getTabCount('in_progress')})
          </TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
            Tugallangan ({getTabCount('completed')})
          </TabsTrigger>
          <TabsTrigger value="overdue" className="text-xs sm:text-sm">
            <AlertTriangle className="h-3.5 w-3.5 mr-1 hidden sm:inline" />
            Muddati ({getTabCount('overdue')})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Bu bo&apos;limda vazifalar yo&apos;q
          </div>
        ) : (
          filteredTasks.map((task) => {
            const worker = mockWorkers.find((w) => w.id === task.assignedTo);
            return (
              <Card
                key={task.id}
                className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{task.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                    </div>
                    <Badge className={getPriorityBadge(task.priority)} variant="outline">
                      {getPriorityIcon(task.priority)}
                      <span className="ml-1">{getPriorityLabel(task.priority)}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(task.dueDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {worker?.fullName || "Noma'lum"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(task.status)} variant="secondary">
                      {getStatusLabel(task.status)}
                    </Badge>
                    <div className="flex gap-1">
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleStatusChange(task.id, 'in_progress')}
                        >
                          <PlayCircle className="h-3.5 w-3.5 mr-1" />
                          Boshlash
                        </Button>
                      )}
                      {task.status === 'in_progress' && (
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          Tugallash
                        </Button>
                      )}
                      {task.status === 'overdue' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() => handleStatusChange(task.id, 'in_progress')}
                        >
                          <PlayCircle className="h-3.5 w-3.5 mr-1" />
                          Davom etish
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
