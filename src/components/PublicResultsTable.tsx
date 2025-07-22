'use client'

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ExternalLink, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface PublicResult {
  id: string;
  shareId: string;
  isp: string;
  city: string;
  downloadSpeed: number;
  uploadSpeed: number;
  ping: number;
  throttlingRatio: number | null;
  testDate: string;
  sharedAt: string;
  videoStreamingSpeed: number | null;
  socialMediaSpeed: number | null;
  generalWebSpeed: number | null;
}

export function PublicResultsTable() {
  const [results, setResults] = useState<PublicResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async (currentOffset = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/public-results?limit=${limit}&offset=${currentOffset}`);
      const data = await response.json();
      
      if (currentOffset === 0) {
        setResults(data.results);
      } else {
        setResults(prev => [...prev, ...data.results]);
      }
      
      setHasMore(data.hasMore);
      setOffset(currentOffset);
    } catch (error) {
      console.error('Error fetching public results:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    fetchResults(offset + limit);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getThrottlingStatus = (throttlingRatio: number | null) => {
    if (!throttlingRatio) return null;
    
    if (throttlingRatio >= 0.9) {
      return { label: 'Normal', variant: 'default' as const, icon: TrendingUp };
    } else if (throttlingRatio >= 0.7) {
      return { label: 'Posible', variant: 'secondary' as const, icon: AlertTriangle };
    } else {
      return { label: 'Detectado', variant: 'destructive' as const, icon: TrendingDown };
    }
  };

  if (loading && results.length === 0) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resultados Públicos Recientes</CardTitle>
        <CardDescription>
          Pruebas de neutralidad compartidas por usuarios de toda Colombia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {results.length === 0 
                ? "No hay resultados públicos disponibles"
                : `Mostrando ${results.length} resultados más recientes`
              }
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>ISP</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead className="text-right">Descarga</TableHead>
                <TableHead className="text-right">Subida</TableHead>
                <TableHead className="text-right">Ping</TableHead>
                <TableHead className="text-center">Throttling</TableHead>
                <TableHead className="text-center">Ver</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => {
                const throttlingStatus = getThrottlingStatus(result.throttlingRatio);
                const ThrottlingIcon = throttlingStatus?.icon;
                
                return (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">
                      {formatDate(result.sharedAt)}
                    </TableCell>
                    <TableCell>{result.isp}</TableCell>
                    <TableCell>{result.city}</TableCell>
                    <TableCell className="text-right">
                      {result.downloadSpeed.toFixed(1)} Mbps
                    </TableCell>
                    <TableCell className="text-right">
                      {result.uploadSpeed.toFixed(1)} Mbps
                    </TableCell>
                    <TableCell className="text-right">
                      {result.ping} ms
                    </TableCell>
                    <TableCell className="text-center">
                      {throttlingStatus ? (
                        <Badge variant={throttlingStatus.variant} className="gap-1">
                          {ThrottlingIcon && <ThrottlingIcon className="w-3 h-3" />}
                          {throttlingStatus.label}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/share/${result.shareId}`} target="_blank">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {hasMore && (
          <div className="mt-4 text-center">
            <Button 
              onClick={loadMore} 
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                'Cargar más resultados'
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
