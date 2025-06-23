// components/ui/FullPageLoader.jsx
'use client';

export default function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-blue-700 font-medium">Loading NVS Book Store...</p>
    </div>
  );
}
