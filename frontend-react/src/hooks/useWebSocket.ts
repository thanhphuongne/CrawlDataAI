import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'http://localhost:3001';

interface UseWebSocketProps {
  onChatResponse: (message: string) => void;
  onDataRequestProposal?: (data: any) => void;
  onConversationHistory?: (data: any) => void;
}

export function useWebSocket({ onChatResponse, onDataRequestProposal, onConversationHistory }: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Get token from localStorage
    let token = localStorage.getItem('accessToken');
    
    // TEMPORARY: Use test token for development
    // In production, you should login first to get a valid token
    if (!token) {
      console.warn('⚠️ No authentication token found - using test mode');
      token = 'test-token';
    }

    console.log('🔌 Connecting to WebSocket at', BACKEND_URL);

    // Initialize socket connection
    const socket = io(BACKEND_URL, {
      query: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ WebSocket connected successfully!');
      setIsConnected(true);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ WebSocket disconnected:', reason);
      setIsConnected(false);
      
      // If disconnected due to invalid token, clear it and use test-token
      if (reason === 'io server disconnect') {
        const oldToken = localStorage.getItem('accessToken');
        if (oldToken && oldToken !== 'test-token') {
          console.warn('⚠️ Invalid token detected, clearing and switching to test mode');
          localStorage.removeItem('accessToken');
          // Will reconnect with test-token on next mount
          window.location.reload();
        }
      }
    });

    socket.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    socket.on('conversation_history', (data) => {
      console.log('Received conversation history:', data);
      if (onConversationHistory) {
        onConversationHistory(data);
      }
    });

    socket.on('chat_response', (data) => {
      console.log('Received chat response:', data);
      onChatResponse(data.message);
    });

    socket.on('data_request_proposal', (data) => {
      console.log('Received data request proposal:', data);
      if (onDataRequestProposal) {
        onDataRequestProposal(data);
      }
    });

    socket.on('data_request_approved', (data) => {
      console.log('Data request approved:', data);
    });

    socket.on('crawling_completed', (data) => {
      console.log('Crawling completed:', data);
    });

    return () => {
      socket.disconnect();
    };
  }, [onChatResponse, onDataRequestProposal, onConversationHistory]);

  const sendMessage = useCallback((content: string, request_id?: number) => {
    if (socketRef.current && socketRef.current.connected) {
      console.log('📤 Sending message:', content);
      socketRef.current.emit('chat_message', {
        content,
        request_id,
      });
    } else {
      console.warn('⚠️ Cannot send message - socket not connected');
      // Fallback: show error to user
      if (!socketRef.current) {
        console.error('Socket not initialized - likely no auth token');
      }
    }
  }, []);

  const approveDataRequest = useCallback((requirement: string, message_id: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('approve_data_request', {
        requirement,
        message_id,
      });
    }
  }, [isConnected]);

  return {
    isConnected,
    sendMessage,
    approveDataRequest,
  };
}
