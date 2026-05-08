import TruckTrackStatus from "@/components/pages/TruckTrackStatus";

interface TruckTrackStatusPageProps {
  params: Promise<{ trackNumber: string }>;
}

export default async function TruckTrackStatusPage({ params }: TruckTrackStatusPageProps) {
  const { trackNumber } = await params;
  return <TruckTrackStatus trackNumber={trackNumber} />;
}
