'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  FileText, CheckCircle, Clock, Users, Package,
  Camera, ChevronDown, ChevronUp, AlertTriangle, Eye,
} from 'lucide-react';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';
import { mockReports } from '@/mock/reports';
import { mockProjects } from '@/mock/projects';
import { DailyReport } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarReportsPage() {
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [filterProject, setFilterProject] = useState<string>('all');

  const filtered = filterProject === 'all'
    ? mockReports
    : mockReports.filter((r) => r.projectId === filterProject);

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name || id;

  const signedCount = mockReports.filter((r) => r.isSigned).length;
  const totalWorkers = mockReports.reduce((s, r) => s + r.workersPresent, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kundalik hisobotlar</h1>
        <p className="text-muted-foreground">Prorablarning kundalik hisobotlari va izohlar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Jami hisobotlar</p>
            <p className="text-2xl font-bold">{mockReports.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Imzolangan</p>
            <p className="text-2xl font-bold">{signedCount}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Jami ishchilar</p>
            <p className="text-2xl font-bold">{totalWorkers}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Muammolar</p>
            <p className="text-2xl font-bold">{mockReports.filter((r) => r.issues).length}</p>
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
        </CardContent>
      </Card>

      {/* Reports */}
      <div className="space-y-4">
        {filtered.map((report) => {
          const isExpanded = expandedReport === report.id;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader
                className="pb-3 cursor-pointer"
                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
              >
                <div className="flex items-center justify-between">
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
                    <Badge variant="outline" className="text-xs">{report.date}</Badge>
                    {report.isSigned ? (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Imzolangan
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" /> Kutilmoqda
                      </Badge>
                    )}
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-3">{report.workDone}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {report.workersPresent} ishchi</span>
                  <span className="flex items-center gap-1"><Package className="h-3.5 w-3.5" /> {report.materialsUsed.length} material</span>
                  <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> {report.photos.length} rasm</span>
                </div>

                {report.issues && (
                  <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 mb-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                      <p className="text-sm text-orange-800">{report.issues}</p>
                    </div>
                  </div>
                )}

                {isExpanded && (
                  <div className="space-y-4 border-t pt-4 mt-3">
                    {/* Materials Used */}
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Ishlatilgan materiallar:</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs">Material</TableHead>
                            <TableHead className="text-xs">Miqdor</TableHead>
                            <TableHead className="text-xs">Ish turi</TableHead>
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

                    {/* Comment Section */}
                    <CommentSection targetType="report" targetId={report.id} />
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
