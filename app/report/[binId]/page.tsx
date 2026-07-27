import Link from "next/link";
import { binData } from "@/components/pages/data/binStatusData";
import CitizenReportForm from "@/components/pages/CitizenReportForm";

interface CitizenReportPageProps {
  params: Promise<{ binId: string }>;
}

export default async function CitizenReportPage({ params }: CitizenReportPageProps) {
  const { binId } = await params;
  const normalized = decodeURIComponent(binId).toUpperCase();
  const bin = binData.find((b) => b.id.toUpperCase() === normalized);

  if (!bin) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-gray-900/80 p-8 text-center">
          <h1 className="text-2xl font-bold text-white">Unknown bin</h1>
          <p className="mt-3 text-gray-400">
            We couldn&apos;t find a smart dustbin matching{" "}
            <span className="font-mono text-cyan-300">{normalized}</span>. The QR sticker may be outdated.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full border border-gray-700 px-5 py-2 text-sm text-gray-200 hover:bg-gray-800"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return <CitizenReportForm bin={bin} />;
}
