import React, { useState } from 'react';

interface ShareListFormProps {
  onShare: (phoneNumber: string) => Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }>;
}

export const ShareListForm: React.FC<ShareListFormProps> = ({ onShare }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setResponse(null);
    
    try {
      if (!phoneNumber) {
        throw new Error('Por favor, insira um número de telefone');
      }
      
      // Simple phone number validation
      const cleanedNumber = phoneNumber.replace(/\D/g, '');
      if (cleanedNumber.length < 10) {
        throw new Error('Número de telefone inválido');
      }
      
      const result = await onShare(cleanedNumber);
      if (!result.success) {
        setError(result.error || 'Erro ao compartilhar lista');
        return;
      }
      
      setSuccess(true);
      setResponse({
        message: 'Link do WhatsApp aberto em nova aba!',
        phoneNumber: cleanedNumber,
        timestamp: new Date().toLocaleString(),
        url: result.url
      });
      setPhoneNumber('');
    } catch (err: any) {
      setError(err instanceof Error ? err.message : 'Erro ao compartilhar lista');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-card overflow-hidden animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
        <h3 className="text-xl font-bold">Compartilhar via WhatsApp</h3>
        <p className="text-sm text-emerald-100 mt-1">
          Envie sua lista de compras organizada por categorias
        </p>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-4 p-2 bg-green-50 text-green-700 rounded-lg">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-green-600">
              <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.646.075-.3-.15-1.265-.465-2.411-1.483-.893-.795-1.497-1.77-1.674-2.07-.173-.3-.018-.465.13-.613.134-.135.301-.345.451-.52.151-.174.2-.3.3-.498.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.486-.51-.672-.51-.173 0-.4-.025-.6-.025-.2 0-.522.074-.796.374-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.2-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div>
            <p className="font-medium">Pronto para compartilhar</p>
            <p className="text-sm">Seu link do WhatsApp será gerado automaticamente</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 mb-1">
              Número de Telefone
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">+</span>
              </div>
              <input
                id="phone-number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="5511999999999"
                className="w-full pl-7 py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Digite o número com código do país e DDD (ex: 5511999999999)
            </p>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>Gerando link...</span>
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.646.075-.3-.15-1.265-.465-2.411-1.483-.893-.795-1.497-1.77-1.674-2.07-.173-.3-.018-.465.13-.613.134-.135.301-.345.451-.52.151-.174.2-.3.3-.498.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.486-.51-.672-.51-.173 0-.4-.025-.6-.025-.2 0-.522.074-.796.374-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.18 2.095 3.195 5.076 4.483.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.2-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Compartilhar via WhatsApp</span>
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 animate-fade-in">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mt-3 p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 animate-fade-in">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 p-1 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-medium">{response?.message || 'Lista compartilhada com sucesso!'}</p>
              </div>
              {response && (
                <div className="mt-2 pl-2 border-l-2 border-green-200">
                  <p className="text-sm">Telefone: +{response.phoneNumber}</p>
                  <p className="text-sm">Horário: {response.timestamp}</p>
                  {response.url && (
                    <a 
                      href={response.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block mt-3 text-emerald-600 hover:text-emerald-800 font-medium text-sm flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Abrir link do WhatsApp novamente
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}; 