
import { Request, Response } from 'express';
import { registerSchema, loginSchema } from './auth.schema';
import { registerUser, loginUser, AuthError } from './auth.service';

export async function register(req: Request, res: Response): Promise<void> {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid registration data',
      errors: validation.error.flatten().fieldErrors
    });
    return;
  }

  try {
    const user = await registerUser(validation.data);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Account verification is required before login.',
      data: user
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to register user'
    });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({
      success: false,
      message: 'Invalid login data',
      errors: validation.error.flatten().fieldErrors
    });
    return;
  }

  try {
    
const result = await loginUser(validation.data);

res.status(200).json({
  success: true,
  message: 'Login successful',
  data: result.user,
  token: result.token
});

  } catch (error: unknown) {
    if (error instanceof AuthError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
      return;
    }

    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to log in'
    });
  }
}
export function getMyProfile(req: Request, res: Response): void {
  if (!req.authUser) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: 'JWT authentication successful',
    data: {
      user_id: req.authUser.user_id,
      phone_number: req.authUser.phone_number,
      role_name: req.authUser.role_name
    }
  });
}

