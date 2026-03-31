'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Truck, Phone, Mail, MapPin, Star, Package, ShoppingCart,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { RatingSummary } from '@/widgets/rating-summary/ui/RatingSummary';
import { mockSuppliers } from '@/mock/suppliers';
import { mockRatings } from '@/mock/ratings';
import { mockReceipts } from '@/mock/receipts';
import { getInitials, formatCurrency } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarSuppliersPage() {
  const totalOrders = mockSuppliers.reduce((s, sup) => s + sup.totalOrders, 0);
  const avgRating = mockSuppliers.length > 0
    ? (mockSuppliers.reduce((s, sup) => s + sup.rating, 0) / mockSuppliers.length).toFixed(1)
    : '0';
  const totalSpent = mockReceipts.reduce((s, r) => s + r.totalAmount, 0);

  const stats: StatCard[] = [
    { title: 'Jami yetkazuvchilar', value: mockSuppliers.length, icon: 'Users', color: 'blue' },
    { title: 'Jami buyurtmalar', value: totalOrders, icon: 'Package', color: 'green' },
    { title: "O'rtacha reyting", value: avgRating, icon: 'TrendingUp', color: 'yellow' },
    { title: 'Jami xaridlar', value: formatCurrency(totalSpent), icon: 'DollarSign', color: 'purple' },
  ];

  const supplierRatings = mockRatings.filter((r) => r.targetType === 'supplier');

  const renderStars = (rating: number) => (
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Yetkazib beruvchilar</h1>
        <p className="text-muted-foreground">Yetkazib beruvchilar va ularning reytinglari</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Suppliers Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Yetkazib beruvchilar ro&apos;yxati ({mockSuppliers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Kompaniya</TableHead>
                <TableHead>Aloqa shaxsi</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Manzil</TableHead>
                <TableHead>Materiallar</TableHead>
                <TableHead>Reyting</TableHead>
                <TableHead className="text-center">Buyurtmalar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSuppliers
                .sort((a, b) => b.rating - a.rating)
                .map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className={cn(
                        'h-8 w-8',
                        supplier.rating >= 4.5 ? 'bg-green-600' :
                        supplier.rating >= 3.5 ? 'bg-blue-600' : 'bg-orange-600'
                      )}>
                        <AvatarFallback className="text-white text-xs">
                          {getInitials(supplier.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{supplier.name}</p>
                        {supplier.email && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {supplier.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {supplier.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate max-w-[150px]">{supplier.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.materials.map((mat, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {mat}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{renderStars(supplier.rating)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-xs">
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      {supplier.totalOrders}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Rating Summaries */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Yetkazib beruvchilar baholari</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSuppliers.map((supplier) => (
            <RatingSummary
              key={supplier.id}
              ratings={supplierRatings}
              targetType="supplier"
              targetId={supplier.id}
              targetName={supplier.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
