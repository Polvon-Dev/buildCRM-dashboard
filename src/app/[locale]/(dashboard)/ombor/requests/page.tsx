'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ClipboardList, CheckCircle2, XCircle, AlertTriangle, Clock,
  MessageSquare, ChevronDown, ChevronUp,
} from 'lucide-react';
import { mockMaterialRequests } from '@/mock/requests';
import { MaterialRequest, RequestStatus } from '@/shared/types';
import { formatDateTime, getStatusColor } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';

const statusLabels: Record<RequestStatus, string> = {
  pending: 'Kutilmoqda',
  approved: 'Tasdiqlangan',
  rejected: 'Rad etilgan',
  delivered: 'Yetkazilgan',
};

const statusIcons: Record<RequestStatus, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
  delivered: <CheckCircle2 className="h-3.5 w-3.5" />,
};

export default function RequestsPage() {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState<MaterialRequest[]>(mockMaterialRequests);
  const [rejectComment, setRejectComment] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'approved' as RequestStatus,
              approvedBy: user?.id,
              approvedAt: new Date().toISOString(),
            }
          : r
      )
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'rejected' as RequestStatus,
              rejectionReason: rejectComment[id] || "Rad etildi",
            }
          : r
      )
    );
    setRejectComment((prev) => ({ ...prev, [id]: '' }));
  };

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const otherRequests = requests.filter((r) => r.status !== 'pending');

  const renderRequest = (request: MaterialRequest) => {
    const isExpanded = expandedId === request.id;
    const isPending = request.status === 'pending';

    return (
      <Card
        key={request.id}
        className={cn(
          'transition-all',
          request.urgency === 'urgent' && isPending && 'border-red-300 shadow-red-100 shadow-md',
          isPending && 'border-yellow-200'
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold">{request.materialName}</h3>
                <Badge variant="outline" className={cn('text-xs', getStatusColor(request.status))}>
                  {statusIcons[request.status]}
                  <span className="ml-1">{statusLabels[request.status]}</span>
                </Badge>
                {request.urgency === 'urgent' && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Tezkor!
                  </Badge>
                )}
              </div>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{request.requestedByName}</span>
                  {' '} — {request.quantity} {request.unit}
                </p>
                {request.comment && (
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{request.comment}&rdquo;
                  </p>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(request.createdAt)}
                </p>
              </div>

              {request.rejectionReason && (
                <div className="mt-2 p-2 bg-red-50 rounded-md border border-red-100">
                  <p className="text-xs text-red-700">
                    <span className="font-medium">Rad sababi:</span> {request.rejectionReason}
                  </p>
                </div>
              )}

              {request.approvedAt && (
                <div className="mt-2 p-2 bg-green-50 rounded-md border border-green-100">
                  <p className="text-xs text-green-700">
                    Tasdiqlangan: {formatDateTime(request.approvedAt)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="text-lg font-bold">
                {request.quantity} {request.unit}
              </p>
              {isPending && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Tasdiqlash
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (rejectComment[request.id]?.trim()) {
                        handleReject(request.id);
                      } else {
                        setExpandedId(request.id);
                      }
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rad etish
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Reject comment field */}
          {isPending && isExpanded && (
            <div className="mt-3 space-y-2 border-t pt-3">
              <label className="text-sm font-medium">Rad etish sababi</label>
              <Textarea
                value={rejectComment[request.id] || ''}
                onChange={(e) =>
                  setRejectComment((prev) => ({ ...prev, [request.id]: e.target.value }))
                }
                placeholder="Rad etish sababini yozing..."
                className="min-h-[60px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setExpandedId(null)}
                >
                  Bekor qilish
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(request.id)}
                  disabled={!rejectComment[request.id]?.trim()}
                >
                  Rad etish
                </Button>
              </div>
            </div>
          )}

          {/* Toggle comment section */}
          <div className="mt-3 border-t pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground w-full"
              onClick={() => setExpandedId(isExpanded ? null : request.id)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Izohlar
              {isExpanded ? (
                <ChevronUp className="h-3 w-3 ml-1" />
              ) : (
                <ChevronDown className="h-3 w-3 ml-1" />
              )}
            </Button>
            {isExpanded && (
              <div className="mt-2">
                <CommentSection targetType="material_request" targetId={request.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Material so&#39;rovlari</h1>
        <p className="text-muted-foreground">Prorablardan kelgan material so&#39;rovlari</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['pending', 'approved', 'rejected', 'delivered'] as RequestStatus[]).map((status) => {
          const count = requests.filter((r) => r.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    status === 'pending' && 'bg-yellow-100 text-yellow-700',
                    status === 'approved' && 'bg-green-100 text-green-700',
                    status === 'rejected' && 'bg-red-100 text-red-700',
                    status === 'delivered' && 'bg-blue-100 text-blue-700'
                  )}
                >
                  {statusIcons[status]}
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{statusLabels[status]}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Kutilmoqda ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <ClipboardList className="h-3.5 w-3.5" />
            Barchasi ({requests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Kutilayotgan so&#39;rov yo&#39;q
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map(renderRequest)
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-4">
          {requests.map(renderRequest)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
