'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Users, Star, Phone, Briefcase, DollarSign,
  CheckCircle, XCircle, TrendingUp,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockWorkers } from '@/mock/workers';
import { mockProjects } from '@/mock/projects';
import { mockSalaries } from '@/mock/salaries';
import { mockRatings } from '@/mock/ratings';
import { formatCurrency, getInitials } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const positionLabels: Record<string, string> = {
  mason: 'Bricklayer', welder: 'Payvandchi', electrician: 'Elektrik',
  plumber: 'Santexnik', carpenter: 'Duradgor', painter: 'Bo\'yoqchi',
  laborer: 'Ishchi', driver: 'Haydovchi', crane_operator: 'Kran operatori',
  other: 'Boshqa',
};

export default function RahbarWorkersPage() {
  const activeWorkers = mockWorkers.filter((w) => w.isActive).length;
  const avgRating = mockWorkers.length > 0
    ? (mockWorkers.reduce((s, w) => s + w.rating, 0) / mockWorkers.length).toFixed(1)
    : '0';
  const totalSalary = mockWorkers.reduce((s, w) => s + w.monthlySalary, 0);

  const stats: StatCard[] = [
    { title: 'Jami ishchilar', value: mockWorkers.length, icon: 'Users', color: 'blue' },
    { title: 'Faol', value: activeWorkers, icon: 'CheckSquare', color: 'green' },
    { title: "O'rtacha reyting", value: avgRating, icon: 'TrendingUp', color: 'yellow' },
    { title: 'Jami oylik', value: formatCurrency(totalSalary), icon: 'DollarSign', color: 'purple' },
  ];

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name?.split(' - ')[0] || id;

  const getWorkerRatings = (workerId: string) => {
    return mockRatings.filter((r) => r.targetType === 'worker' && r.targetId === workerId);
  };

  const getSalaryInfo = (workerId: string) => {
    return mockSalaries.find((s) => s.workerId === workerId);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              'h-3.5 w-3.5',
              star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
        <span className="ml-1 text-xs font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ishchilar</h1>
        <p className="text-muted-foreground">Barcha ishchilar, reytinglari va oylik ma&apos;lumotlari</p>
      </div>

      <StatsGrid stats={stats} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Ishchilar ro&apos;yxati ({mockWorkers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Ishchi</TableHead>
                <TableHead>Lavozim</TableHead>
                <TableHead>Loyiha</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead className="text-right">Kunlik stavka</TableHead>
                <TableHead className="text-right">Oylik</TableHead>
                <TableHead className="text-center">Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkers
                .sort((a, b) => b.rating - a.rating)
                .map((worker, index) => {
                  const salary = getSalaryInfo(worker.id);
                  return (
                    <TableRow key={worker.id} className={cn(!worker.isActive && 'opacity-60')}>
                      <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className={cn(
                            'h-8 w-8',
                            worker.rating >= 4.5 ? 'bg-green-600' :
                            worker.rating >= 3.5 ? 'bg-blue-600' : 'bg-orange-600'
                          )}>
                            <AvatarFallback className="text-white text-xs">
                              {getInitials(worker.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{worker.fullName}</p>
                            <p className="text-xs text-muted-foreground">Ishga olingan: {worker.hireDate}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {positionLabels[worker.position] || worker.position}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{getProjectName(worker.projectId)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {worker.phone}
                        </div>
                      </TableCell>
                      <TableCell>{renderStars(worker.rating)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(worker.dailyRate)}</TableCell>
                      <TableCell className="text-right text-sm font-medium">
                        {salary ? formatCurrency(salary.finalAmount) : formatCurrency(worker.monthlySalary)}
                      </TableCell>
                      <TableCell className="text-center">
                        {worker.isActive ? (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" /> Faol
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                            <XCircle className="h-3 w-3 mr-1" /> Nofaol
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
