// Mock da implementação do WhatsApp para ambiente Docker
// A implementação real requer a biblioteca whatsapp-web.js

class WhatsAppService {
  private isReady: boolean = false;
  private callbacks: {
    onMessage?: (message: string, sender: string) => void;
  } = {};

  constructor() {
    console.log('WhatsApp service mock initialized');
  }

  public init() {
    this.isReady = true;
    console.log('WhatsApp client mock is ready!');
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    console.log(`Mock: Sending message to ${to}: ${message}`);
  }

  public onMessage(callback: (message: string, sender: string) => void) {
    this.callbacks.onMessage = callback;
  }

  public isClientReady(): boolean {
    return this.isReady;
  }
}

// Singleton pattern
let whatsAppService: WhatsAppService | null = null;

export function getWhatsAppService(): WhatsAppService {
  if (!whatsAppService) {
    whatsAppService = new WhatsAppService();
  }
  return whatsAppService;
} 