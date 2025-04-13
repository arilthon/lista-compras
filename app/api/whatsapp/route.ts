import { NextRequest, NextResponse } from 'next/server';

// Usar link direto do WhatsApp em vez da biblioteca que está causando erros
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    status: 'WhatsApp service running',
    ready: true // Sempre pronto porque usaremos links diretos
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  try {
    const { to, message } = body;
    
    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: to, message' },
        { status: 400 }
      );
    }

    // Formatando o número de telefone
    const formattedNumber = to.startsWith('+') ? to.substring(1) : to;
    
    // Criando URL para WhatsApp
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    
    console.log(`Link para WhatsApp gerado: ${whatsappUrl}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Link gerado com sucesso',
      to: formattedNumber,
      url: whatsappUrl
    });
  } catch (error) {
    console.error('Erro processando mensagem WhatsApp:', error);
    return NextResponse.json(
      { error: 'Falha ao processar mensagem', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 