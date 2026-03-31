'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { mockReports } from '@/mock/reports';
import { PhotoEntry } from '@/shared/types';
import { formatDate, formatDateTime, generateId } from '@/shared/lib/utils';
import {
  Camera, MapPin, Clock, Image, Upload, X, ZoomIn,
  Calendar, Grid3x3, List,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabPhotosPage() {
  const myReports = mockReports.filter((r) => r.prorabId === PRORAB_ID);
  const allPhotos: PhotoEntry[] = myReports.flatMap((r) => r.photos);

  const [photos, setPhotos] = useState<PhotoEntry[]>(allPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleUploadPhoto = () => {
    const newPhoto: PhotoEntry = {
      id: generateId(),
      url: `/photos/new-upload-${Date.now()}.jpg`,
      projectId: PROJECT_ID,
      uploadedBy: PRORAB_ID,
      uploadedByName: 'Karimov Botir',
      gpsLat: 41.3111 + (Math.random() - 0.5) * 0.002,
      gpsLng: 69.2797 + (Math.random() - 0.5) * 0.002,
      gpsAddress: "Navoiy ko'chasi 28",
      timestamp: new Date().toISOString(),
      description: 'Yangi rasm',
    };
    setPhotos([newPhoto, ...photos]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rasmlar</h1>
          <p className="text-muted-foreground">
            Barcha loyiha rasmlari &middot; {photos.length} ta rasm
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleUploadPhoto}>
            <Upload className="h-4 w-4 mr-2" />
            Rasm yuklash
          </Button>
        </div>
      </div>

      {/* Photos Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Upload card */}
          <button
            type="button"
            onClick={handleUploadPhoto}
            className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center min-h-[200px] hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors mb-3">
              <Camera className="h-8 w-8 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-blue-600">
              Yangi rasm yuklash
            </span>
            <span className="text-xs text-muted-foreground mt-1">GPS avtomatik</span>
          </button>

          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <div className="relative">
                <div className="flex items-center justify-center h-40 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Image className="h-12 w-12 text-gray-400" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="text-xs bg-black/50 text-white border-0">
                    <MapPin className="h-3 w-3 mr-1" />
                    GPS
                  </Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate">{photo.description || 'Rasm'}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDateTime(photo.timestamp)}
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {photo.gpsLat?.toFixed(4)}, {photo.gpsLng?.toFixed(4)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {photos.map((photo) => (
            <Card
              key={photo.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200"
              onClick={() => setSelectedPhoto(photo)}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 bg-gray-100 rounded-lg shrink-0">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{photo.description || 'Rasm'}</p>
                  <p className="text-xs text-muted-foreground">{photo.uploadedByName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDateTime(photo.timestamp)}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {photo.gpsLat?.toFixed(4)}, {photo.gpsLng?.toFixed(4)}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs shrink-0">
                  <MapPin className="h-3 w-3 mr-1" />
                  GPS
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedPhoto && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Rasm tafsilotlari
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Photo preview */}
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                  <Image className="h-16 w-16 text-gray-400" />
                </div>

                {/* Details */}
                <div className="space-y-3">
                  {selectedPhoto.description && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Tavsif</p>
                      <p className="text-sm">{selectedPhoto.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        GPS koordinatalari
                      </p>
                      <p className="text-sm font-mono">
                        {selectedPhoto.gpsLat?.toFixed(6)}, {selectedPhoto.gpsLng?.toFixed(6)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        Manzil
                      </p>
                      <p className="text-sm">{selectedPhoto.gpsAddress || "Noma'lum"}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Vaqt
                      </p>
                      <p className="text-sm">{formatDateTime(selectedPhoto.timestamp)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                        <Camera className="h-3 w-3" />
                        Yuklagan
                      </p>
                      <p className="text-sm">{selectedPhoto.uploadedByName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
