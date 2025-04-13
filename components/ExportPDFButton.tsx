import React, { useState } from 'react';

interface ExportPDFButtonProps {
  onExport: () => Promise<{ success: boolean; error?: string }>;
}

export const ExportPDFButton: React.FC<ExportPDFButtonProps> = ({ onExport }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setShowSuccess(false);
    
    try {
      const result = await onExport();
      if (result.success) {
        setShowSuccess(true);
        // Esconder o sucesso após 3 segundos
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        setExportError(result.error || 'Erro ao exportar PDF');
      }
    } catch (err) {
      setExportError(err instanceof Error ? err.message : 'Erro ao exportar PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modern-card overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-4 text-white">
        <h3 className="text-xl font-bold">Exportar para PDF</h3>
        <p className="text-sm text-purple-100 mt-1">
          Gere um arquivo PDF da sua lista de compras
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4 p-2 bg-purple-50 text-purple-700 rounded-lg">
          <div className="bg-purple-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div>
            <p className="font-medium">PDF Pronto para Download</p>
            <p className="text-sm">Suas categorias serão mantidas no documento</p>
          </div>
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>Gerando PDF...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Exportar como PDF</span>
            </>
          )}
        </button>
        
        {exportError && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-fade-in">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{exportError}</span>
            </div>
          </div>
        )}
        
        {showSuccess && (
          <div className="mt-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 animate-fade-in">
            <div className="flex items-center">
              <div className="bg-green-100 p-1 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-medium">PDF gerado com sucesso!</p>
            </div>
            <p className="mt-1 text-sm pl-7">O download do arquivo foi iniciado automaticamente.</p>
          </div>
        )}
      </div>
    </div>
  );
}; 