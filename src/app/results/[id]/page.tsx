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

// Este es el componente de la página principal
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resultData = await getTestResult(id);

  // Calcular los promedios
  const cityAverages = await calculateCityAverages(resultData.city);
  const ispAverages = await calculateIspAverages(resultData.isp);

  // Pasamos los datos del servidor a un componente de cliente para la interactividad
  return <ResultsScreen initialResults={resultData} cityAverages={cityAverages} ispAverages={ispAverages} />;
}
