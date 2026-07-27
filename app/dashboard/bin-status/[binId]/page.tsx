import BinAssignment from "@/components/pages/BinAssignment";

interface BinAssignmentPageProps {
  params: Promise<{ binId: string }>;
}

export default async function BinAssignmentPage({ params }: BinAssignmentPageProps) {
  const { binId } = await params;
  return <BinAssignment binId={binId} />;
}
