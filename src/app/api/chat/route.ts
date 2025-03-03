import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mock database
let messages = [
  {
    id: '1',
    chatId: '1',
    content: 'Hello! How can I help you today?',
    sender: 'them',
    timestamp: new Date(),
    type: 'text',
    status: 'delivered'
  }
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const chatId = searchParams.get('chatId');

  if (!chatId) {
    return NextResponse.json(
      { error: 'Missing chat ID' },
      { status: 400 }
    );
  }

  const chatMessages = messages.filter(msg => msg.chatId === chatId);
  return NextResponse.json(chatMessages);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.chatId || !body.content || !body.sender) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const newMessage = {
    id: Date.now().toString(),
    ...body,
    timestamp: new Date(),
    status: 'sent'
  };

  messages.push(newMessage);

  // Simulate message delivery
  setTimeout(() => {
    const index = messages.findIndex(msg => msg.id === newMessage.id);
    if (index !== -1) {
      messages[index].status = 'delivered';
    }
  }, 1000);

  // Simulate automated response for demo
  if (body.sender === 'me') {
    setTimeout(() => {
      const responses = [
        "I'll check my schedule and get back to you soon.",
        "Thank you for your message. How can I assist you further?",
        "I understand your needs. Let me help you with that.",
        "Would you like to schedule a consultation?",
      ];
      
      const autoResponse = {
        id: Date.now().toString(),
        chatId: body.chatId,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'them',
        timestamp: new Date(),
        type: 'text',
        status: 'delivered'
      };

      messages.push(autoResponse);
    }, 2000);
  }

  return NextResponse.json(newMessage);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  
  const index = messages.findIndex(msg => msg.id === body.id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Message not found' },
      { status: 404 }
    );
  }

  messages[index] = { ...messages[index], ...body };

  return NextResponse.json(messages[index]);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing message ID' },
      { status: 400 }
    );
  }

  const index = messages.findIndex(msg => msg.id === id);
  if (index === -1) {
    return NextResponse.json(
      { error: 'Message not found' },
      { status: 404 }
    );
  }

  messages.splice(index, 1);

  return NextResponse.json({ success: true });
}
