'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAuctions } from '@/mock/auctions';
import { Auction, AuctionBid } from '@/shared/types';
import { formatDate, formatDateTime, formatCurrency, getStatusColor, generateId } from '@/shared/lib/utils';
import {
  Plus, Gavel, Calendar, DollarSign, Trophy, Users,
  Clock, Eye, Send, TrendingDown, ArrowDown,
} from 'lucide-react';

const PRORAB_ID = 'u2';

export default function ProrabAuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>(mockAuctions);
  const [activeTab, setActiveTab] = useState('all');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [bidDialog, setBidDialog] = useState<{ open: boolean; auctionId: string }>({ open: false, auctionId: '' });
  const [detailAuction, setDetailAuction] = useState<Auction | null>(null);

  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    endDate: '',
  });

  const [newBid, setNewBid] = useState({
    company: '',
    amount: '',
    description: '',
  });

  const filteredAuctions = activeTab === 'all'
    ? auctions
    : auctions.filter((a) => a.status === activeTab);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Ochiq';
      case 'closed': return 'Yopilgan';
      case 'approved': return 'Tasdiqlangan';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  const handleCreateAuction = () => {
    if (!newAuction.title || !newAuction.description || !newAuction.endDate) return;
    const auction: Auction = {
      id: generateId(),
      title: newAuction.title,
      description: newAuction.description,
      projectId: 'p1',
      createdBy: PRORAB_ID,
      createdByName: 'Karimov Botir',
      status: 'open',
      startDate: new Date().toISOString().split('T')[0],
      endDate: newAuction.endDate,
      bids: [],
      createdAt: new Date().toISOString(),
    };
    setAuctions([auction, ...auctions]);
    setNewAuction({ title: '', description: '', endDate: '' });
    setCreateDialogOpen(false);
  };

  const handleBid = () => {
    if (!newBid.company || !newBid.amount || !newBid.description) return;
    const bid: AuctionBid = {
      id: generateId(),
      auctionId: bidDialog.auctionId,
      bidderId: PRORAB_ID,
      bidderName: 'Karimov Botir',
      company: newBid.company,
      amount: Number(newBid.amount),
      description: newBid.description,
      createdAt: new Date().toISOString(),
    };
    setAuctions(auctions.map((a) =>
      a.id === bidDialog.auctionId ? { ...a, bids: [...a.bids, bid] } : a
    ));
    setNewBid({ company: '', amount: '', description: '' });
    setBidDialog({ open: false, auctionId: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auktsionlar</h1>
          <p className="text-muted-foreground">Material yetkazib berish auktsionlari</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi auktsion
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yangi auktsion yaratish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Sarlavha</label>
                <Input
                  placeholder="Auktsion nomini kiriting"
                  value={newAuction.title}
                  onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tavsif</label>
                <Textarea
                  placeholder="Auktsion haqida batafsil..."
                  value={newAuction.description}
                  onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tugash sanasi</label>
                <Input
                  type="date"
                  value={newAuction.endDate}
                  onChange={(e) => setNewAuction({ ...newAuction, endDate: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Bekor qilish</Button>
              <Button
                onClick={handleCreateAuction}
                disabled={!newAuction.title || !newAuction.description || !newAuction.endDate}
              >
                Yaratish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Barchasi ({auctions.length})</TabsTrigger>
          <TabsTrigger value="open">Ochiq ({auctions.filter((a) => a.status === 'open').length})</TabsTrigger>
          <TabsTrigger value="closed">Yopilgan ({auctions.filter((a) => a.status === 'closed').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Auctions List */}
      <div className="space-y-4">
        {filteredAuctions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              Auktsionlar topilmadi
            </CardContent>
          </Card>
        ) : (
          filteredAuctions.map((auction) => {
            const lowestBid = auction.bids.length > 0
              ? Math.min(...auction.bids.map((b) => b.amount))
              : null;
            return (
              <Card
                key={auction.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Gavel className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold">{auction.title}</h3>
                        <Badge className={getStatusColor(auction.status)} variant="secondary">
                          {getStatusLabel(auction.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Boshlanish</p>
                      <p className="text-sm font-medium">{formatDate(auction.startDate)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Tugash</p>
                      <p className="text-sm font-medium">{formatDate(auction.endDate)}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Takliflar</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {auction.bids.length} ta
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Eng past narx</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <TrendingDown className="h-3.5 w-3.5 text-green-600" />
                        {lowestBid ? formatCurrency(lowestBid) : '-'}
                      </p>
                    </div>
                  </div>

                  {/* Winner */}
                  {auction.winnerName && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200 mb-3">
                      <Trophy className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        G&apos;olib: {auction.winnerName}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setDetailAuction(auction)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Batafsil
                    </Button>
                    {auction.status === 'open' && (
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => setBidDialog({ open: true, auctionId: auction.id })}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Taklif berish
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Bid Dialog */}
      <Dialog open={bidDialog.open} onOpenChange={(open) => setBidDialog({ ...bidDialog, open })}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Taklif berish</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Kompaniya nomi</label>
              <Input
                placeholder="Kompaniya nomini kiriting"
                value={newBid.company}
                onChange={(e) => setNewBid({ ...newBid, company: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Narx (so&apos;m)</label>
              <Input
                type="number"
                placeholder="Narxni kiriting"
                value={newBid.amount}
                onChange={(e) => setNewBid({ ...newBid, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tavsif</label>
              <Textarea
                placeholder="Taklif haqida batafsil..."
                value={newBid.description}
                onChange={(e) => setNewBid({ ...newBid, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBidDialog({ open: false, auctionId: '' })}>
              Bekor qilish
            </Button>
            <Button
              onClick={handleBid}
              disabled={!newBid.company || !newBid.amount || !newBid.description}
            >
              Yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Auction Detail Dialog */}
      <Dialog open={!!detailAuction} onOpenChange={() => setDetailAuction(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          {detailAuction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5" />
                  {detailAuction.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">{detailAuction.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Holat</p>
                    <Badge className={getStatusColor(detailAuction.status)} variant="secondary">
                      {getStatusLabel(detailAuction.status)}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Yaratuvchi</p>
                    <p className="text-sm font-medium">{detailAuction.createdByName}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Boshlanish</p>
                    <p className="text-sm font-medium">{formatDate(detailAuction.startDate)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground">Tugash</p>
                    <p className="text-sm font-medium">{formatDate(detailAuction.endDate)}</p>
                  </div>
                </div>

                {detailAuction.winnerName && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                    <Trophy className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">G&apos;olib: {detailAuction.winnerName}</p>
                      {detailAuction.approvedAt && (
                        <p className="text-xs text-green-600">Tasdiqlangan: {formatDateTime(detailAuction.approvedAt)}</p>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold mb-3">Takliflar ({detailAuction.bids.length})</h4>
                  {detailAuction.bids.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Hali takliflar yo&apos;q</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Kompaniya</TableHead>
                          <TableHead>Narx</TableHead>
                          <TableHead>Tavsif</TableHead>
                          <TableHead>Sana</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailAuction.bids
                          .sort((a, b) => a.amount - b.amount)
                          .map((bid, index) => (
                            <TableRow key={bid.id} className={index === 0 ? 'bg-green-50/50' : ''}>
                              <TableCell className="font-medium text-sm">
                                <div className="flex items-center gap-1">
                                  {index === 0 && <ArrowDown className="h-3.5 w-3.5 text-green-600" />}
                                  {bid.company}
                                </div>
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatCurrency(bid.amount)}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                                {bid.description}
                              </TableCell>
                              <TableCell className="text-xs text-muted-foreground">
                                {formatDate(bid.createdAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
