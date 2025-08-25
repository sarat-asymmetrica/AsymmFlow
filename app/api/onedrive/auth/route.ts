import { NextRequest, NextResponse } from 'next/server';

// Microsoft OAuth endpoints
const MICROSOFT_AUTH_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const MICROSOFT_TOKEN_URL = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';

// Required scopes for OneDrive and Excel access
const SCOPES = [
  'Files.ReadWrite.All',
  'offline_access',
  'User.Read'
].join(' ');

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // If no code, redirect to Microsoft OAuth
  if (!code) {
    const authParams = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID || '',
      response_type: 'code',
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3002/api/onedrive/auth',
      scope: SCOPES,
      response_mode: 'query'
    });
    
    const authUrl = `${MICROSOFT_AUTH_URL}?${authParams.toString()}`;
    return NextResponse.redirect(authUrl);
  }
  
  // Exchange code for token
  try {
    const tokenParams = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID || '',
      client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
      code: code,
      redirect_uri: process.env.MICROSOFT_REDIRECT_URI || 'http://localhost:3002/api/onedrive/auth',
      grant_type: 'authorization_code'
    });
    
    const tokenResponse = await fetch(MICROSOFT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString()
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      console.error('Token exchange error:', tokens);
      return NextResponse.json({ error: tokens.error_description }, { status: 400 });
    }
    
    // Store tokens securely (in production, use encrypted cookies or database)
    // For now, we'll redirect back to the data migration page with success
    const response = NextResponse.redirect(new URL('/data-migration?auth=success', request.url));
    
    // Set secure HTTP-only cookie with the access token
    response.cookies.set('onedrive_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600 // 1 hour
    });
    
    if (tokens.refresh_token) {
      response.cookies.set('onedrive_refresh', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 30 // 30 days
      });
    }
    
    return response;
    
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // Refresh token endpoint
  const refreshToken = request.cookies.get('onedrive_refresh')?.value;
  
  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }
  
  try {
    const tokenParams = new URLSearchParams({
      client_id: process.env.MICROSOFT_CLIENT_ID || '',
      client_secret: process.env.MICROSOFT_CLIENT_SECRET || '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    });
    
    const tokenResponse = await fetch(MICROSOFT_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString()
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      return NextResponse.json({ error: tokens.error_description }, { status: 400 });
    }
    
    const response = NextResponse.json({ success: true });
    
    // Update access token
    response.cookies.set('onedrive_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600
    });
    
    return response;
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}