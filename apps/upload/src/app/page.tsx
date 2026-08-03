import { UploadForm } from '@/components/UploadForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Portal de Upload</h1>
        <p className="text-gray-600 mb-6">Envie seus orçamentos para processamento.</p>
        <UploadForm />
      </div>
    </main>
  );
}
