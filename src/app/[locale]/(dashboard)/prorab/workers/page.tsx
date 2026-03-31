'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { mockWorkers } from '@/mock/workers';
import { mockAttendance } from '@/mock/attendance';
import { mockRatings } from '@/mock/ratings';
import { Worker, Attendance, AttendanceStatus, Rating } from '@/shared/types';
import { formatCurrency, getInitials, getStatusColor, generateId } from '@/shared/lib/utils';
import {
  Star, StarOff, Phone, Clock, UserCheck, UserX, UserMinus,
  AlertCircle, MessageSquare, Briefcase,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

const POSITION_LABELS: Record<string, string> = {
  mason: 'G\'ishtchi',
  welder: 'Payvandchi',
  electrician: 'Elektrik',
  plumber: 'Santexnik',
  carpenter: 'Duradgor',
  painter: 'Bo\'yoqchi',
  laborer: 'Ishchi',
  driver: 'Haydovchi',
  crane_operator: 'Kran operatori',
  other: 'Boshqa',
};

export default function ProrabWorkersPage() {
  const myWorkers = mockWorkers.filter((w) => w.prorabId === PRORAB_ID);
  const [attendance, setAttendance] = useState<Attendance[]>(
    mockAttendance.filter((a) => a.projectId === PROJECT_ID)
  );
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const [ratingDialog, setRatingDialog] = useState<{ open: boolean; workerId: string; workerName: string }>({
    open: false,
    workerId: '',
    workerName: '',
  });
  const [newRating, setNewRating] = useState<{ stars: number; comment: string }>({ stars: 0, comment: '' });
  const [hoverStar, setHoverStar] = useState(0);

  const getWorkerAttendance = (workerId: string) => {
    return attendance.find((a) => a.workerId === workerId && a.date === '2026-03-31');
  };

  const handleAttendance = (workerId: string, workerName: string, status: AttendanceStatus) => {
    const existing = attendance.find((a) => a.workerId === workerId && a.date === '2026-03-31');
    if (existing) {
      setAttendance(attendance.map((a) =>
        a.workerId === workerId && a.date === '2026-03-31'
          ? { ...a, status, checkInTime: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : undefined }
          : a
      ));
    } else {
      const newAtt: Attendance = {
        id: generateId(),
        workerId,
        workerName,
        projectId: PROJECT_ID,
        date: '2026-03-31',
        status,
        checkInTime: status === 'present' || status === 'late' ? new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) : undefined,
        markedBy: PRORAB_ID,
      };
      setAttendance([...attendance, newAtt]);
    }
  };

  const handleRating = () => {
    if (newRating.stars === 0 || !newRating.comment.trim()) return;
    const rating: Rating = {
      id: generateId(),
      targetType: 'worker',
      targetId: ratingDialog.workerId,
      authorId: PRORAB_ID,
      authorName: 'Karimov Botir',
      authorRole: 'prorab',
      stars: newRating.stars as 1 | 2 | 3 | 4 | 5,
      comment: newRating.comment,
      createdAt: new Date().toISOString(),
    };
    setRatings([...ratings, rating]);
    setRatingDialog({ open: false, workerId: '', workerName: '' });
    setNewRating({ stars: 0, comment: '' });
  };

  const getAttendanceStatusLabel = (status: string) => {
    switch (status) {
      case 'present': return 'Kelgan';
      case 'absent': return 'Kelmagan';
      case 'late': return 'Kechikkan';
      case 'excused': return 'Ruxsat';
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ishchilar</h1>
        <p className="text-muted-foreground">
          Jami {myWorkers.length} ishchi &middot; Bugungi davomat va baholash
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Kelgan', count: attendance.filter((a) => a.projectId === PROJECT_ID && a.date === '2026-03-31' && a.status === 'present').length, color: 'text-green-600', icon: UserCheck },
          { label: 'Kechikkan', count: attendance.filter((a) => a.projectId === PROJECT_ID && a.date === '2026-03-31' && a.status === 'late').length, color: 'text-orange-600', icon: Clock },
          { label: 'Kelmagan', count: attendance.filter((a) => a.projectId === PROJECT_ID && a.date === '2026-03-31' && a.status === 'absent').length, color: 'text-red-600', icon: UserX },
          { label: 'Ruxsat', count: attendance.filter((a) => a.projectId === PROJECT_ID && a.date === '2026-03-31' && a.status === 'excused').length, color: 'text-blue-600', icon: UserMinus },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className={`h-8 w-8 ${item.color}`} />
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {myWorkers.map((worker) => {
          const att = getWorkerAttendance(worker.id);
          return (
            <Card
              key={worker.id}
              className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                {/* Worker Info */}
                <div className="flex items-start gap-3 mb-4">
                  <Avatar className="h-12 w-12 bg-blue-600">
                    <AvatarFallback className="text-white text-sm font-semibold">
                      {getInitials(worker.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{worker.fullName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {POSITION_LABELS[worker.position] || worker.position}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {renderStars(worker.rating)}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 px-1">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {worker.phone}
                  </div>
                  <div className="font-medium text-foreground">
                    {formatCurrency(worker.dailyRate)}/kun
                  </div>
                </div>

                {/* Attendance */}
                <div className="border-t pt-3 mb-3">
                  <p className="text-xs font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Bugungi davomat
                    {att && (
                      <Badge className={`ml-auto ${getStatusColor(att.status)}`} variant="secondary">
                        {getAttendanceStatusLabel(att.status)}
                        {att.checkInTime && ` (${att.checkInTime})`}
                      </Badge>
                    )}
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={att?.status === status ? 'default' : 'outline'}
                        className={`h-7 text-xs ${
                          att?.status === status
                            ? status === 'present' ? 'bg-green-600 hover:bg-green-700' :
                              status === 'late' ? 'bg-orange-500 hover:bg-orange-600' :
                              status === 'absent' ? 'bg-red-600 hover:bg-red-700' :
                              'bg-blue-600 hover:bg-blue-700'
                            : ''
                        }`}
                        onClick={() => handleAttendance(worker.id, worker.fullName, status)}
                      >
                        {getAttendanceStatusLabel(status)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Rating Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => {
                    setRatingDialog({ open: true, workerId: worker.id, workerName: worker.fullName });
                    setNewRating({ stars: 0, comment: '' });
                    setHoverStar(0);
                  }}
                >
                  <Star className="h-3.5 w-3.5 mr-1" />
                  Baholash
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rating Dialog */}
      <Dialog open={ratingDialog.open} onOpenChange={(open) => setRatingDialog({ ...ratingDialog, open })}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>{ratingDialog.workerName} ni baholash</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 transition-transform hover:scale-110"
                  onMouseEnter={() => setHoverStar(star)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setNewRating({ ...newRating, stars: star })}
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoverStar || newRating.stars)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {newRating.stars > 0 && (
              <p className="text-center text-sm text-muted-foreground">
                {newRating.stars === 1 ? 'Juda yomon' :
                 newRating.stars === 2 ? 'Yomon' :
                 newRating.stars === 3 ? "O'rtacha" :
                 newRating.stars === 4 ? 'Yaxshi' : "A'lo"}
              </p>
            )}
            <Textarea
              placeholder="Izoh yozing (majburiy)..."
              value={newRating.comment}
              onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
              className="min-h-[80px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRatingDialog({ ...ratingDialog, open: false })}>
              Bekor qilish
            </Button>
            <Button onClick={handleRating} disabled={newRating.stars === 0 || !newRating.comment.trim()}>
              Saqlash
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
