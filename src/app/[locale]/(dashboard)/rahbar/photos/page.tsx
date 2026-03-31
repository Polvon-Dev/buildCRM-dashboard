'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Camera, MapPin, Calendar, User, Image,
  ChevronLeft, ChevronRight, X, ZoomIn,
} from 'lucide-react';
import { mockReports } from '@/mock/reports';
import { mockProjects } from '@/mock/projects';
import { PhotoEntry } from '@/shared/types';
import { formatDateTime } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarPhotosPage() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [filterProject, setFilterProject] = useState<string>('all');

  // Collect all photos from reports
  const allPhotos: PhotoEntry[] = mockReports.flatMap((r) => r.photos);

  const filtered = filterProject === 'all'
    ? allPhotos
    : allPhotos.filter((p) => p.projectId === filterProject);

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name?.split(' - ')[0] || id;

  const currentIndex = selectedPhoto ? filtered.findIndex((p) => p.id === selectedPhoto.id) : -1;

  const navigatePhoto = (direction: 'prev' | 'next') => {
    if (currentIndex === -1) return;
    const newIndex = direction === 'prev'
      ? (currentIndex - 1 + filtered.length) % filtered.length
      : (currentIndex + 1) % filtered.length;
    setSelectedPhoto(filtered[newIndex]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Foto galereya</h1>
        <p className="text-muted-foreground">Qurilish maydonchasidan yuklangan rasmlar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Jami rasmlar</p>
                <p className="text-2xl font-bold">{allPhotos.length}</p>
              </div>
              <Camera className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">GPS bilan</p>
                <p className="text-2xl font-bold">{allPhotos.filter((p) => p.gpsLat).length}</p>
              </div>
              <MapPin className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">Loyihalar</p>
                <p className="text-2xl font-bold">{new Set(allPhotos.map((p) => p.projectId)).size}</p>
              </div>
              <Image className="h-8 w-8 text-white/40" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Loyiha:</span>
            <Button
              variant={filterProject === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setFilterProject('all')}
            >
              Barchasi ({allPhotos.length})
            </Button>
            {mockProjects.map((p) => {
              const count = allPhotos.filter((ph) => ph.projectId === p.id).length;
              if (count === 0) return null;
              return (
                <Button
                  key={p.id}
                  variant={filterProject === p.id ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterProject(p.id)}
                >
                  {p.name.split(' - ')[0]} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <Card
            key={photo.id}
            className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all hover:-translate-y-0.5"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-1" />
                <p className="text-xs text-gray-500">{photo.description || 'Rasm'}</p>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardContent className="p-3">
              <p className="text-sm font-medium truncate">{photo.description || 'Rasm'}</p>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>{photo.uploadedByName}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDateTime(photo.timestamp)}</span>
              </div>
              {photo.gpsAddress && (
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 text-green-500" />
                  <span className="text-green-700">{photo.gpsAddress}</span>
                </div>
              )}
              <Badge variant="outline" className="text-xs mt-2">
                {getProjectName(photo.projectId)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Camera className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">Rasmlar topilmadi</p>
          </CardContent>
        </Card>
      )}

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPhoto?.description || 'Rasm'}</DialogTitle>
          </DialogHeader>
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
                {/* Navigation */}
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80"
                  onClick={() => navigatePhoto('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-white/80"
                  onClick={() => navigatePhoto('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="outline" className="bg-white/80 text-xs">
                    {currentIndex + 1} / {filtered.length}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Yuklagan:</strong> {selectedPhoto.uploadedByName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span><strong>Vaqt:</strong> {formatDateTime(selectedPhoto.timestamp)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {selectedPhoto.gpsAddress && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-green-500" />
                      <span><strong>Manzil:</strong> {selectedPhoto.gpsAddress}</span>
                    </div>
                  )}
                  {selectedPhoto.gpsLat && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="font-mono text-xs">
                        {selectedPhoto.gpsLat.toFixed(4)}, {selectedPhoto.gpsLng?.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
