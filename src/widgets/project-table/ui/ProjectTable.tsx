'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2 } from 'lucide-react';
import { Project } from '@/shared/types';
import { formatCurrency, getStatusColor } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/mock/users';

interface ProjectTableProps {
  projects: Project[];
  className?: string;
}

const statusLabels: Record<string, string> = {
  planning: 'Rejalashtirish',
  active: 'Faol',
  paused: "To'xtatilgan",
  completed: 'Tugallangan',
};

export function ProjectTable({ projects, className }: ProjectTableProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Loyihalar ({projects.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loyiha</TableHead>
              <TableHead>Prorab</TableHead>
              <TableHead>Holati</TableHead>
              <TableHead>Jarayon</TableHead>
              <TableHead className="text-right">Byudjet</TableHead>
              <TableHead className="text-right">Sarflangan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const prorab = mockUsers.find((u) => u.id === project.prorabId);
              const spentPercent = Math.round((project.spent / project.budget) * 100);
              return (
                <TableRow key={project.id} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{project.name}</p>
                      <p className="text-xs text-muted-foreground">{project.address}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{prorab?.fullName || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(project.status))}>
                      {statusLabels[project.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <Progress value={project.progress} className="h-2 flex-1" />
                      <span className="text-xs font-medium w-8">{project.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">{formatCurrency(project.budget)}</TableCell>
                  <TableCell className="text-right">
                    <span className={cn('text-sm font-medium', spentPercent > 80 ? 'text-red-600' : 'text-emerald-600')}>
                      {formatCurrency(project.spent)}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
