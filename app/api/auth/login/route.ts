import { NextRequest, NextResponse } from 'next/server';
import { validateUser } from '../../../../lib/user-roles';
import jwt from 'jsonwebtoken';
import { withSecurity, SecurityConfigs } from '../../../../lib/security-middleware';
import { CloudAccessBridge } from '../../../../lib/cloud-access-bridge';

// Secret key for JWT - MUST be provided in environment variables
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for production');
}

// Type assertion after null check
const jwtSecret: string = JWT_SECRET;

async function handleLogin(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate user credentials
    const user = await validateUser(email, password);

    if (!user) {
      // Log failed login attempt for security monitoring
      console.log(`Failed login attempt for email: ${email} from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);
      
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create Enhanced JWT token with cloud capabilities
    const basePayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    
    // ENHANCEMENT WAVE: Amplify JWT with cloud access capabilities
    const enhancedPayload = CloudAccessBridge.enhanceJWTPayload(basePayload);
    
    const token = jwt.sign(
      enhancedPayload,
      jwtSecret,
      { expiresIn: '30d' } // 30 days as per SPOC requirement
    );

    // Log successful login
    console.log(`Successful login for user: ${user.email} (${user.role}) from IP: ${request.headers.get('x-forwarded-for') || 'unknown'}`);

    // Update last login (in a real app, this would update the database)
    user.lastLogin = new Date();

    // Return user data and token
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

// Apply security middleware with strict rate limiting for auth endpoints
export const POST = withSecurity({
  requireAuth: false,
  logRequest: true,
  rateLimit: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  allowedMethods: ['POST']
})(handleLogin);