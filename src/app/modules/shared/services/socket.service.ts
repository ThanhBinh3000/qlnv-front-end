import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    private static INSTANCE: SocketService;
    private socket: any;
    private callbacks: Map<string, () => void> = new Map();

    public static getInstance() {
        if (!SocketService.INSTANCE) {
            SocketService.INSTANCE = new SocketService();
        }
        return SocketService.INSTANCE;
    }
    private constructor() {
        let url = (environment.api.socketServer || '').replace('https', 'wss');
        url = url.replace('http', 'ws');
        this.socket = new WebSocket(url);
        this.socket.addEventListener('message', (result: { data: string }) => {
            const { data } = result;
            this.callbacks.get(data)!();
        });
    }

    public registerCallback(name: string, handler: () => void) {
        this.callbacks.set(name, handler);
    }
}
