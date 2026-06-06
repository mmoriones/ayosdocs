import Link from "next/link";
import { WifiOff, RotateCcw } from "lucide-react";

export const metadata = {
  title: "You're Offline — AyosDocs",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-ctp-mantle border border-ctp-surface1 flex items-center justify-center shadow-sm">
          <WifiOff className="text-ctp-subtext1" size={36} />
        </div>
        <h1 className="text-2xl font-black text-ctp-text mb-2">
          You&apos;re Offline
        </h1>
        <p className="text-ctp-subtext1 mb-8 leading-relaxed">
          It looks like you&apos;ve lost your internet connection.
          Previously viewed pages may still be available offline.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-ctp-sky-800 text-white font-bold hover:bg-ctp-sky-800/90 transition-all shadow-lg shadow-ctp-sky-800/20 active:scale-95"
          >
            <RotateCcw size={16} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-ctp-surface1 text-ctp-text font-bold hover:bg-ctp-mantle transition-all active:scale-95"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
