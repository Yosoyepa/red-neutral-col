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

// Este es el componente de la página principal
export default async function Page({ params }: { params: { id: string } }) {
  const resultData = await getTestResult(params.id);

  // Pasamos los datos del servidor a un componente de cliente para la interactividad
  return <ResultsScreen initialResults={resultData} />;
}
