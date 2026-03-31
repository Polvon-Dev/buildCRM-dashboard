'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Gavel, Trophy, Calendar, CheckCircle, Clock,
  XCircle, DollarSign, ChevronDown, ChevronUp, Award,
} from 'lucide-react';
import { mockAuctions } from '@/mock/auctions';
import { mockProjects } from '@/mock/projects';
import { Auction, AuctionStatus } from '@/shared/types';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<AuctionStatus, string> = {
  open: 'Ochiq', closed: 'Yopilgan', approved: 'Tasdiqlangan', rejected: 'Rad etilgan',
};

export default function RahbarAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [expandedAuction, setExpandedAuction] = useState<string | null>(null);

  const getProjectName = (id?: string) => id ? (mockProjects.find((p) => p.id === id)?.name?.split(' - ')[0] || id) : '—';

  const handleApprove = (auctionId: string, winnerId: string, winnerName: string) => {
    setAuctions(auctions.map((a) =>
      a.id === auctionId
        ? {
            ...a,
            status: 'approved' as const,
            winnerId,
            winnerName,
            approvedBy: 'u1',
            approvedAt: new Date().toISOString(),
          }
        : a
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Auktsionlar</h1>
        <p className="text-muted-foreground">Material yetkazib berish uchun auktsionlar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Jami auktsionlar</p>
                <p className="text-2xl font-bold">{auctions.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Ochiq</p>
                <p className="text-2xl font-bold">{auctions.filter(a => a.status === 'open').length}</p>
              </div>
              <Clock className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Jami takliflar</p>
                <p className="text-2xl font-bold">{auctions.reduce((s, a) => s + a.bids.length, 0)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auction Cards */}
      <div className="space-y-4">
        {auctions.map((auction) => {
          const isExpanded = expandedAuction === auction.id;
          const sortedBids = [...auction.bids].sort((a, b) => a.amount - b.amount);
          const lowestBid = sortedBids[0];

          return (
            <Card key={auction.id} className="hover:shadow-lg transition-shadow">
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => setExpandedAuction(isExpanded ? null : auction.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center',
                      auction.status === 'open' ? 'bg-green-100' :
                      auction.status === 'approved' ? 'bg-blue-100' : 'bg-gray-100'
                    )}>
                      <Gavel className={cn(
                        'h-6 w-6',
                        auction.status === 'open' ? 'text-green-600' :
                        auction.status === 'approved' ? 'text-blue-600' : 'text-gray-600'
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{auction.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{auction.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(auction.status))}>
                      {statusLabels[auction.status]}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {auction.bids.length} taklif
                    </Badge>
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Boshlanish: {auction.startDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Tugash: {auction.endDate}</span>
                  </div>
                  <span>Loyiha: {getProjectName(auction.projectId)}</span>
                  <span>Yaratuvchi: {auction.createdByName}</span>
                </div>

                {auction.winnerName && (
                  <div className="rounded-lg border border-green-200 bg-green-50 p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        G&apos;olib: {auction.winnerName}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bids List */}
                {isExpanded && (
                  <div className="border-t pt-4 mt-2">
                    <h4 className="text-sm font-semibold mb-3">Takliflar:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-8">#</TableHead>
                          <TableHead>Kompaniya</TableHead>
                          <TableHead>Taklif qiluvchi</TableHead>
                          <TableHead className="text-right">Narx</TableHead>
                          <TableHead>Tavsif</TableHead>
                          <TableHead>Sana</TableHead>
                          {auction.status === 'open' && <TableHead className="text-right">Amal</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedBids.map((bid, index) => (
                          <TableRow key={bid.id} className={cn(
                            index === 0 && 'bg-green-50/50',
                            auction.winnerId === bid.bidderId && 'bg-green-50 border-l-2 border-l-green-500',
                          )}>
                            <TableCell className="text-sm">
                              {index === 0 ? (
                                <Award className="h-4 w-4 text-yellow-500" />
                              ) : (
                                <span className="text-muted-foreground">{index + 1}</span>
                              )}
                            </TableCell>
                            <TableCell className="font-medium text-sm">{bid.company}</TableCell>
                            <TableCell className="text-sm">{bid.bidderName}</TableCell>
                            <TableCell className="text-right font-bold text-sm">
                              {formatCurrency(bid.amount)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                              {bid.description}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {formatDate(bid.createdAt)}
                            </TableCell>
                            {auction.status === 'open' && (
                              <TableCell className="text-right">
                                <Button
                                  size="sm"
                                  className="text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(auction.id, bid.bidderId, bid.bidderName);
                                  }}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" /> Tasdiqlash
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
