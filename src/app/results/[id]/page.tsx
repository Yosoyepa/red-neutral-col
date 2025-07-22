import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ResultsScreen } from "./ResultsScreen"

// Esta función obtiene los datos del lado del servidor
async function getTestResult(id: string) {
  const testResult = await prisma.testResult.findUnique({
    where: { id },
  });

  if (!testResult) {
    notFound(); // Muestra una página 404 si el ID no es válido
  }
  return testResult;
}

// Implementar el cálculo de promedios por ciudad
async function calculateCityAverages(city: string) {
  const results = await prisma.testResult.findMany({
    where: { city },
  });

  if (results.length === 0) return { download: 0, upload: 0, latency: 0 };

  const download = results.reduce((acc, cur) => acc + cur.downloadSpeed, 0) / results.length;
  const upload = results.reduce((acc, cur) => acc + cur.uploadSpeed, 0) / results.length;
  const latency = results.reduce((acc, cur) => acc + cur.ping, 0) / results.length;

  return { download, upload, latency };
}

// Implementar el cálculo de promedios por ISP
async function calculateIspAverages(isp: string) {
  const results = await prisma.testResult.findMany({
    where: { isp },
  });

  if (results.length === 0) return { download: 0, upload: 0, latency: 0 };

  const download = results.reduce((acc, cur) => acc + cur.downloadSpeed, 0) / results.length;
  const upload = results.reduce((acc, cur) => acc + cur.uploadSpeed, 0) / results.length;
  const latency = results.reduce((acc, cur) => acc + cur.ping, 0) / results.length;

  return { download, upload, latency };
}

// Función para calcular el puntaje de neutralidad
function calculateNeutralityScore(
  testResult: any,
  ispAverages: { download: number; upload: number; latency: number },
  cityAverages: { download: number; upload: number; latency: number }
) {
  // Si no hay promedios disponibles, devolver valores por defecto
  if (ispAverages.download === 0 || ispAverages.upload === 0) {
    return { score: 0, status: 'insufficient-data' };
  }

  // Calcular el ratio de velocidad comparado con el ISP
  const downloadRatio = testResult.downloadSpeed / ispAverages.download;
  const uploadRatio = testResult.uploadSpeed / ispAverages.upload;
  
  // Para la latencia, un valor más bajo es mejor, así que invertimos el ratio
  const latencyRatio = ispAverages.latency > 0 ? ispAverages.latency / testResult.ping : 1;

  // Calcular el puntaje promedio ponderado
  // Damos más peso a la descarga (50%), luego subida (30%) y latencia (20%)
  const weightedScore = (
    (downloadRatio * 0.5) +
    (uploadRatio * 0.3) +
    (latencyRatio * 0.2)
  ) * 100;

  // Limitar el puntaje entre 0 y 100
  const score = Math.min(100, Math.max(0, Math.round(weightedScore)));

  // Determinar el estado basado en el puntaje
  let status: string;
  if (score >= 85) {
    status = 'neutral';
  } else if (score >= 70) {
    status = 'possible-throttling';
  } else {
    status = 'throttling-detected';
  }

  return { score, status };
}

// Este es el componente de la página principal
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resultData = await getTestResult(id);

  // Calcular los promedios
  const cityAverages = await calculateCityAverages(resultData.city);
  const ispAverages = await calculateIspAverages(resultData.isp);

  // Calcular el puntaje de neutralidad
  const neutralityData = calculateNeutralityScore(resultData, ispAverages, cityAverages);

  // Pasamos los datos del servidor a un componente de cliente para la interactividad
  return (
    <ResultsScreen 
      initialResults={resultData} 
      cityAverages={cityAverages} 
      ispAverages={ispAverages}
      neutralityScore={neutralityData.score}
      neutralityStatus={neutralityData.status}
      serviceComparison={{
        videoStreamingSpeed: resultData.videoStreamingSpeed || 0,
        socialMediaSpeed: resultData.socialMediaSpeed || 0,
        generalWebSpeed: resultData.generalWebSpeed || 0
      }}
    />
  );
}
