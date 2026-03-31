'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  Users, ShieldCheck, ShieldX, Phone, UserCheck, UserX,
} from 'lucide-react';
import { mockUsers } from '@/mock/users';
import { User, UserRole } from '@/shared/types';
import { getInitials, formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { ROLE_COLORS, ROLE_LABELS } from '@/shared/config/roles';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [blockDialogUser, setBlockDialogUser] = useState<User | null>(null);
  const [blockReason, setBlockReason] = useState('');

  const activeCount = users.filter((u) => u.status === 'active').length;
  const blockedCount = users.filter((u) => u.status === 'blocked').length;

  const canBlock = (userRole: UserRole) => {
    return userRole === 'prorab' || userRole === 'ombor';
  };

  const handleBlock = (userId: string) => {
    if (!blockReason.trim()) return;
    setUsers(users.map((u) =>
      u.id === userId
        ? { ...u, status: 'blocked' as const, blockedBy: 'u5', blockReason: blockReason.trim() }
        : u
    ));
    setBlockReason('');
    setBlockDialogUser(null);
  };

  const handleUnblock = (userId: string) => {
    setUsers(users.map((u) =>
      u.id === userId
        ? { ...u, status: 'active' as const, blockedBy: undefined, blockReason: undefined }
        : u
    ));
  };

  const roleAvatarColors: Record<UserRole, string> = {
    rahbar: 'bg-purple-600',
    prorab: 'bg-blue-600',
    ombor: 'bg-amber-600',
    admin: 'bg-green-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Foydalanuvchilar</h1>
        <p className="text-muted-foreground">Tizim foydalanuvchilarini boshqarish</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Jami foydalanuvchilar</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Faol</p>
                <p className="text-2xl font-bold">{activeCount}</p>
              </div>
              <UserCheck className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Bloklangan</p>
                <p className="text-2xl font-bold">{blockedCount}</p>
              </div>
              <UserX className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Foydalanuvchilar ro&apos;yxati
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Foydalanuvchi</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Ro&apos;yxatdan o&apos;tgan</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={user.id} className={cn(
                  user.status === 'blocked' && 'bg-red-50/50',
                )}>
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className={cn('h-9 w-9', roleAvatarColors[user.role])}>
                        <AvatarFallback className="text-white text-xs font-medium">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{user.fullName}</p>
                        {user.email && (
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', ROLE_COLORS[user.role])}>
                      {ROLE_LABELS[user.role].uz}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Faol
                      </Badge>
                    ) : (
                      <div>
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-200">
                          <ShieldX className="h-3 w-3 mr-1" /> Bloklangan
                        </Badge>
                        {user.blockReason && (
                          <p className="text-xs text-red-600 mt-0.5">{user.blockReason}</p>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canBlock(user.role) ? (
                      user.status === 'active' ? (
                        <Dialog
                          open={blockDialogUser?.id === user.id}
                          onOpenChange={(open) => {
                            if (open) setBlockDialogUser(user);
                            else { setBlockDialogUser(null); setBlockReason(''); }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50">
                              <ShieldX className="h-3.5 w-3.5 mr-1" /> Bloklash
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Foydalanuvchini bloklash</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                                <Avatar className={cn('h-10 w-10', roleAvatarColors[user.role])}>
                                  <AvatarFallback className="text-white text-sm">
                                    {getInitials(user.fullName)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{user.fullName}</p>
                                  <p className="text-sm text-muted-foreground">{ROLE_LABELS[user.role].uz}</p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1.5 block">
                                  Bloklash sababi (majburiy)
                                </label>
                                <Textarea
                                  value={blockReason}
                                  onChange={(e) => setBlockReason(e.target.value)}
                                  placeholder="Bloklash sababini kiriting..."
                                  className="min-h-[80px]"
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Bekor</Button>
                              </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={() => handleBlock(user.id)}
                                disabled={!blockReason.trim()}
                              >
                                <ShieldX className="h-4 w-4 mr-2" /> Bloklash
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-green-600 hover:text-green-800 hover:bg-green-50"
                          onClick={() => handleUnblock(user.id)}
                        >
                          <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Blokdan chiqarish
                        </Button>
                      )
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
