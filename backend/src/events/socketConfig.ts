import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // importante para frontend
  },
})
export class SocketConfig {
  @WebSocketServer()
  server: Server; // instancia real de socket.io

  afterInit(server: Server) {
    console.log('✅ Socket.io inicializado correctamente');
  }

  handleConnection(client: Socket) {
    console.log(`🔌 Cliente conectado: ${client.id}`);
  }

  @SubscribeMessage('qr enter')
  async handleQrEnter(
    @MessageBody() data: { id: string; admin: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('📲 Evento qr enter recibido:', data);

    // Acá iría tu lógica con wppModel
    // await wppModel.createSocket(client.id, data.admin);
    // await wppModel.initClient(data.id, client.id, client);

    // Podés mandar respuesta al cliente
    client.emit('qr response', { status: 'ok', socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    console.log(`❌ Cliente desconectado: ${client.id}`);
  }
}