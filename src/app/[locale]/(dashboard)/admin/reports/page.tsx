'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  FileText, Download, Filter, CheckCircle, Clock,
  Camera, Package, Users, Eye,
} from 'lucide-react';
import { mockReports } from '@/mock/reports';
import { mockProjects } from '@/mock/projects';
import { DailyReport } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function AdminReportsPage() {
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

  const filtered = mockReports.filter((r) => {
    if (filterProject !== 'all' && r.projectId !== filterProject) return false;
    if (filterDate && r.date !== filterDate) return false;
    return true;
  });

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hisobotlar</h1>
          <p className="text-muted-foreground">Barcha prorablarning kundalik hisobotlari</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" /> Eksport (Excel)
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filterlar:</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant={filterProject === 'all' ? 'default' : 'outline'}
                size="sm"
                className="text-xs"
                onClick={() => setFilterProject('all')}
              >
                Barchasi
              </Button>
              {mockProjects.map((p) => (
                <Button
                  key={p.id}
                  variant={filterProject === p.id ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterProject(p.id)}
                >
                  {p.name.split(' - ')[0]}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sana:</span>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="text-sm border rounded-md px-2 py-1"
              />
              {filterDate && (
                <Button variant="ghost" size="sm" className="text-xs" onClick={() => setFilterDate('')}>
                  Tozalash
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Hisobotlar topilmadi</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{report.prorabName}</CardTitle>
                      <p className="text-sm text-muted-foreground">{getProjectName(report.projectId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {report.date}
                    </Badge>
                    {report.isSigned ? (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Imzolangan
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" /> Imzolanmagan
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{report.workDone}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{report.workersPresent} ishchi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Package className="h-3.5 w-3.5" />
                    <span>{report.materialsUsed.length} material</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="h-3.5 w-3.5" />
                    <span>{report.photos.length} rasm</span>
                  </div>
                </div>

                {report.issues && (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 mb-3">
                    <p className="text-sm text-orange-800">
                      <strong>Muammo:</strong> {report.issues}
                    </p>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {expandedReport === report.id ? 'Yopish' : 'Batafsil'}
                </Button>

                {expandedReport === report.id && (
                  <div className="mt-3 border-t pt-3">
                    <h4 className="text-sm font-semibold mb-2">Ishlatilgan materiallar:</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs">Material</TableHead>
                          <TableHead className="text-xs">Miqdor</TableHead>
                          <TableHead className="text-xs">Ish tavsifi</TableHead>
                          <TableHead className="text-xs">Ish hajmi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {report.materialsUsed.map((mat, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="text-sm">{mat.materialName}</TableCell>
                            <TableCell className="text-sm">{mat.quantity} {mat.unit}</TableCell>
                            <TableCell className="text-sm">{mat.workDescription}</TableCell>
                            <TableCell className="text-sm">{mat.workAmount} {mat.workUnit}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
