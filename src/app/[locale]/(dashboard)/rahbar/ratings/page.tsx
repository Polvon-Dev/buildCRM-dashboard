'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Star, Trophy, Users, Truck, TrendingDown } from 'lucide-react';
import { TopPerformers } from '@/widgets/top-performers/ui/TopPerformers';
import { mockRatings } from '@/mock/ratings';
import { mockWorkers } from '@/mock/workers';
import { mockSuppliers } from '@/mock/suppliers';
import { mockUsers } from '@/mock/users';
import { cn } from '@/lib/utils';

export default function RahbarRatingsPage() {
  const workerRatings = mockRatings.filter((r) => r.targetType === 'worker');
  const supplierRatings = mockRatings.filter((r) => r.targetType === 'supplier');
  const prorabRatings = mockRatings.filter((r) => r.targetType === 'prorab');

  const workerNameMap: Record<string, string> = {};
  mockWorkers.forEach((w) => { workerNameMap[w.id] = w.fullName; });

  const supplierNameMap: Record<string, string> = {};
  mockSuppliers.forEach((s) => { supplierNameMap[s.id] = s.name; });

  const prorabNameMap: Record<string, string> = {};
  mockUsers.filter((u) => u.role === 'prorab').forEach((u) => { prorabNameMap[u.id] = u.fullName; });

  const avgWorkerRating = workerRatings.length > 0
    ? (workerRatings.reduce((s, r) => s + r.stars, 0) / workerRatings.length).toFixed(1)
    : '0';
  const avgSupplierRating = supplierRatings.length > 0
    ? (supplierRatings.reduce((s, r) => s + r.stars, 0) / supplierRatings.length).toFixed(1)
    : '0';

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'h-4 w-4',
            star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reytinglar</h1>
        <p className="text-muted-foreground">Ishchilar, yetkazib beruvchilar va prorablar reytingi</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Jami baholar</p>
                <p className="text-2xl font-bold">{mockRatings.length}</p>
              </div>
              <Star className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Ishchilar o&apos;rtachasi</p>
                <p className="text-2xl font-bold">{avgWorkerRating}</p>
              </div>
              <Users className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Yetkazuvchilar o&apos;rtachasi</p>
                <p className="text-2xl font-bold">{avgSupplierRating}</p>
              </div>
              <Truck className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Prorablar bahosi</p>
                <p className="text-2xl font-bold">{prorabRatings.length}</p>
              </div>
              <Trophy className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workers">
        <TabsList>
          <TabsTrigger value="workers">Ishchilar</TabsTrigger>
          <TabsTrigger value="suppliers">Yetkazib beruvchilar</TabsTrigger>
          <TabsTrigger value="prорabs">Prorablar</TabsTrigger>
        </TabsList>

        <TabsContent value="workers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopPerformers
              ratings={workerRatings}
              title="Eng yaxshi ishchilar"
              type="best"
              nameMap={workerNameMap}
            />
            <TopPerformers
              ratings={workerRatings}
              title="Past reytingli ishchilar"
              type="worst"
              nameMap={workerNameMap}
            />
          </div>

          {/* All worker ratings */}
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Barcha ishchi baholari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {workerRatings.map((rating) => (
                  <div key={rating.id} className="flex items-start gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0',
                      rating.stars >= 4 ? 'bg-green-600' : rating.stars >= 3 ? 'bg-yellow-600' : 'bg-red-600'
                    )}>
                      {rating.stars}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{workerNameMap[rating.targetId] || 'Noma\'lum'}</span>
                        {renderStars(rating.stars)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{rating.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rating.authorName} tomonidan — {new Date(rating.createdAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopPerformers
              ratings={supplierRatings}
              title="Eng yaxshi yetkazib beruvchilar"
              type="best"
              nameMap={supplierNameMap}
            />
            <TopPerformers
              ratings={supplierRatings}
              title="Past reytinglilar"
              type="worst"
              nameMap={supplierNameMap}
            />
          </div>
        </TabsContent>

        <TabsContent value="prорabs">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopPerformers
              ratings={prorabRatings}
              title="Prorablar reytingi"
              type="best"
              nameMap={prorabNameMap}
            />
          </div>

          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prorab baholari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {prorabRatings.map((rating) => (
                  <div key={rating.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0',
                      rating.stars >= 4 ? 'bg-green-600' : 'bg-yellow-600'
                    )}>
                      {rating.stars}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{prorabNameMap[rating.targetId] || 'Noma\'lum'}</span>
                        {renderStars(rating.stars)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{rating.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {rating.authorName} — {new Date(rating.createdAt).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
