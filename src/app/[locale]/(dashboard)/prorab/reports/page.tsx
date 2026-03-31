'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';
import { mockReports } from '@/mock/reports';
import { mockMaterials } from '@/mock/materials';
import { DailyReport, MaterialUsage, PhotoEntry } from '@/shared/types';
import { formatDate, formatDateTime, generateId } from '@/shared/lib/utils';
import {
  Plus, FileText, Calendar, Camera, CheckCircle2, Eye,
  Pencil, Image, MapPin, Clock, Users, AlertTriangle,
  X, Upload,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabReportsPage() {
  const [reports, setReports] = useState<DailyReport[]>(
    mockReports.filter((r) => r.prorabId === PRORAB_ID)
  );
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailReport, setDetailReport] = useState<DailyReport | null>(null);

  // Create report form state
  const [workDone, setWorkDone] = useState('');
  const [issues, setIssues] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState<MaterialUsage[]>([]);
  const [newMaterial, setNewMaterial] = useState<Partial<MaterialUsage>>({
    materialId: '',
    materialName: '',
    quantity: 0,
    unit: 'tonna',
    workDescription: '',
    workAmount: 0,
    workUnit: '',
  });
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);

  const handleAddMaterial = () => {
    if (!newMaterial.materialId || !newMaterial.quantity || !newMaterial.workDescription) return;
    const material = mockMaterials.find((m) => m.id === newMaterial.materialId);
    if (!material) return;

    setMaterialsUsed([
      ...materialsUsed,
      {
        materialId: material.id,
        materialName: material.name,
        quantity: Number(newMaterial.quantity),
        unit: material.unit,
        workDescription: newMaterial.workDescription || '',
        workAmount: Number(newMaterial.workAmount) || 0,
        workUnit: newMaterial.workUnit || '',
      },
    ]);
    setNewMaterial({
      materialId: '',
      materialName: '',
      quantity: 0,
      unit: 'tonna',
      workDescription: '',
      workAmount: 0,
      workUnit: '',
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterialsUsed(materialsUsed.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    const photo: PhotoEntry = {
      id: generateId(),
      url: `/photos/upload-${Date.now()}.jpg`,
      projectId: PROJECT_ID,
      uploadedBy: PRORAB_ID,
      uploadedByName: 'Karimov Botir',
      gpsLat: 41.3111 + (Math.random() - 0.5) * 0.001,
      gpsLng: 69.2797 + (Math.random() - 0.5) * 0.001,
      gpsAddress: "Navoiy ko'chasi 28",
      timestamp: new Date().toISOString(),
      description: '',
    };
    setPhotos([...photos, photo]);
  };

  const handleCreateReport = () => {
    if (!workDone.trim() || photos.length === 0) return;

    const report: DailyReport = {
      id: generateId(),
      projectId: PROJECT_ID,
      prorabId: PRORAB_ID,
      prorabName: 'Karimov Botir',
      date: new Date().toISOString().split('T')[0],
      workDone,
      materialsUsed,
      workersPresent: 40,
      issues: issues || undefined,
      photos,
      isSigned: false,
      createdAt: new Date().toISOString(),
    };
    setReports([report, ...reports]);
    resetForm();
    setCreateDialogOpen(false);
  };

  const handleSignReport = (reportId: string) => {
    setReports(reports.map((r) =>
      r.id === reportId ? { ...r, isSigned: true, signedAt: new Date().toISOString() } : r
    ));
  };

  const resetForm = () => {
    setWorkDone('');
    setIssues('');
    setMaterialsUsed([]);
    setPhotos([]);
    setNewMaterial({
      materialId: '', materialName: '', quantity: 0, unit: 'tonna',
      workDescription: '', workAmount: 0, workUnit: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kundalik hisobotlar</h1>
          <p className="text-muted-foreground">Hisobotlarni yarating va kuzating</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi hisobot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Kundalik hisobot yaratish</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              {/* Work Done */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Bajarilgan ish</label>
                <Textarea
                  placeholder="Bugun qanday ishlar bajarildi..."
                  value={workDone}
                  onChange={(e) => setWorkDone(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Issues */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Muammolar (ixtiyoriy)</label>
                <Textarea
                  placeholder="Yuzaga kelgan muammolar..."
                  value={issues}
                  onChange={(e) => setIssues(e.target.value)}
                  className="min-h-[60px]"
                />
              </div>

              {/* Materials Used */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Ishlatilgan materiallar</label>
                {materialsUsed.length > 0 && (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Miqdor</TableHead>
                        <TableHead>Ish tavsifi</TableHead>
                        <TableHead>Ish hajmi</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {materialsUsed.map((m, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{m.materialName}</TableCell>
                          <TableCell className="text-sm">{m.quantity} {m.unit}</TableCell>
                          <TableCell className="text-sm">{m.workDescription}</TableCell>
                          <TableCell className="text-sm">{m.workAmount} {m.workUnit}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveMaterial(i)}>
                              <X className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg bg-muted/30">
                  <Select
                    value={newMaterial.materialId}
                    onValueChange={(v) => {
                      const mat = mockMaterials.find((m) => m.id === v);
                      setNewMaterial({ ...newMaterial, materialId: v, materialName: mat?.name || '', unit: mat?.unit || 'tonna' });
                    }}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Material" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMaterials.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Miqdor"
                    className="text-sm"
                    value={newMaterial.quantity || ''}
                    onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number(e.target.value) })}
                  />
                  <Input
                    placeholder="Ish tavsifi"
                    className="text-sm"
                    value={newMaterial.workDescription || ''}
                    onChange={(e) => setNewMaterial({ ...newMaterial, workDescription: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Hajm"
                      className="text-sm"
                      value={newMaterial.workAmount || ''}
                      onChange={(e) => setNewMaterial({ ...newMaterial, workAmount: Number(e.target.value) })}
                    />
                    <Input
                      placeholder="Birlik"
                      className="text-sm w-20"
                      value={newMaterial.workUnit || ''}
                      onChange={(e) => setNewMaterial({ ...newMaterial, workUnit: e.target.value })}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="col-span-2"
                    onClick={handleAddMaterial}
                    disabled={!newMaterial.materialId || !newMaterial.quantity || !newMaterial.workDescription}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Qo&apos;shish
                  </Button>
                </div>
              </div>

              {/* Photos (mandatory) */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Rasmlar (majburiy)
                  {photos.length === 0 && (
                    <Badge variant="destructive" className="text-xs">Kamida 1 ta rasm kerak</Badge>
                  )}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {photos.map((photo, i) => (
                    <div key={photo.id} className="relative border rounded-lg p-3 bg-muted/30">
                      <div className="flex items-center justify-center h-20 bg-gray-200 rounded mb-2">
                        <Image className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {photo.gpsLat?.toFixed(4)}, {photo.gpsLng?.toFixed(4)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="border-2 border-dashed rounded-lg p-3 flex flex-col items-center justify-center h-[130px] hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Rasm yuklash</span>
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { resetForm(); setCreateDialogOpen(false); }}>
                Bekor qilish
              </Button>
              <Button onClick={handleCreateReport} disabled={!workDone.trim() || photos.length === 0}>
                <FileText className="h-4 w-4 mr-2" />
                Hisobotni saqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              Hisobotlar yo&apos;q. Birinchi hisobotingizni yarating!
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card
              key={report.id}
              className="hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{formatDate(report.date)}</span>
                      {report.isSigned ? (
                        <Badge className="bg-green-100 text-green-800" variant="secondary">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Imzolangan
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800" variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Imzolanmagan
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{report.workDone}</p>
                  </div>
                  <div className="flex gap-2">
                    {!report.isSigned && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={() => handleSignReport(report.id)}
                      >
                        <Pencil className="h-3.5 w-3.5 mr-1" />
                        Imzolash
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => setDetailReport(report)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      Batafsil
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {report.workersPresent} ishchi
                  </span>
                  <span className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    {report.photos.length} rasm
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    {report.materialsUsed.length} material
                  </span>
                  {report.issues && (
                    <span className="flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Muammo bor
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!detailReport} onOpenChange={() => setDetailReport(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {detailReport && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Hisobot — {formatDate(detailReport.date)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-4">
                {/* Work Done */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Bajarilgan ish</h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                    {detailReport.workDone}
                  </p>
                </div>

                {/* Issues */}
                {detailReport.issues && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-1 text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      Muammolar
                    </h4>
                    <p className="text-sm text-muted-foreground bg-orange-50 p-3 rounded-lg">
                      {detailReport.issues}
                    </p>
                  </div>
                )}

                {/* Materials */}
                {detailReport.materialsUsed.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Ishlatilgan materiallar</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead>Miqdor</TableHead>
                          <TableHead>Ish tavsifi</TableHead>
                          <TableHead>Ish hajmi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailReport.materialsUsed.map((m, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-sm font-medium">{m.materialName}</TableCell>
                            <TableCell className="text-sm">{m.quantity} {m.unit}</TableCell>
                            <TableCell className="text-sm">{m.workDescription}</TableCell>
                            <TableCell className="text-sm">{m.workAmount} {m.workUnit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Photos */}
                {detailReport.photos.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Rasmlar</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {detailReport.photos.map((photo) => (
                        <div key={photo.id} className="border rounded-lg p-3 bg-muted/30">
                          <div className="flex items-center justify-center h-24 bg-gray-200 rounded mb-2">
                            <Image className="h-10 w-10 text-gray-400" />
                          </div>
                          <p className="text-xs font-medium">{photo.description}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {photo.gpsAddress}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDateTime(photo.timestamp)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature */}
                <div className="flex items-center gap-2 p-3 rounded-lg border">
                  {detailReport.isSigned ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-700">Imzolangan</p>
                        <p className="text-xs text-muted-foreground">
                          {detailReport.signedAt && formatDateTime(detailReport.signedAt)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <p className="text-sm font-medium text-yellow-700">Imzolanmagan</p>
                    </>
                  )}
                </div>

                <Separator />

                {/* Comments */}
                <CommentSection targetType="report" targetId={detailReport.id} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
