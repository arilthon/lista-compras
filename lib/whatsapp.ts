import { Client, Message } from 'whatsapp-web.js';
import { generate as generateQR } from 'qrcode-terminal';

class WhatsAppService {
  private client: Client;
  private isReady: boolean = false;
  private callbacks: {
    onMessage?: (message: string, sender: string) => void;
  } = {};

  constructor() {
    this.client = new Client({
      puppeteer: {
        args: ['--no-sandbox'],
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('qr', (qr) => {
      generateQR(qr, { small: true });
      console.log('QR Code generated. Scan with WhatsApp to log in.');
    });

    this.client.on('ready', () => {
      this.isReady = true;
      console.log('WhatsApp client is ready!');
    });

    this.client.on('message', (message: Message) => {
      if (this.callbacks.onMessage && !message.isStatus && !message.fromMe) {
        this.callbacks.onMessage(message.body, message.from);
      }
    });
  }

  public init() {
    this.client.initialize();
  }

  public async sendMessage(to: string, message: string): Promise<void> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    await this.client.sendMessage(to, message);
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