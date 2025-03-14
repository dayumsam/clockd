import { NextResponse } from 'next/server';
import { supabase } from '@/config/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { encrypt } from '@/config/encryption';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validate input first
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Test Toggl API credentials before proceeding
    try {
      const togglAuthHeader = `Basic ${Buffer.from(`${email}:${password}`).toString('base64')}`;
      const togglResponse = await fetch('https://api.track.toggl.com/api/v9/me', {
        method: 'GET',
        headers: {
          'Authorization': togglAuthHeader,
          'Content-Type': 'application/json'
        }
      });

      if (togglResponse.status === 403 || togglResponse.status === 401) {
        return NextResponse.json(
          { message: 'Invalid Toggl credentials. Please check your email and password.' },
          { status: 401 }
        );
      }

      if (!togglResponse.ok) {
        throw new Error(`Toggl API returned ${togglResponse.status}: ${await togglResponse.text()}`);
      }

      // Optionally get the user data from Toggl
      const togglUser = await togglResponse.json();
      console.log('Toggl user verified:', togglUser.email || togglUser.id);
    } catch (togglError) {
      console.error('Error testing Toggl credentials:', togglError);
      return NextResponse.json(
        { message: 'Failed to verify Toggl credentials. Please try again.' },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 is the "not found" error from PostgREST
      throw fetchError;
    }

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Generate UUID for the user
    const userId = uuidv4();

    // Create Toggl API key format and encrypt it
    const togglAuth = Buffer.from(`${email}:${password}`).toString('base64');
    const encryptedTogglAuth = encrypt(togglAuth);

    // Insert user data (only once)
    const { error: insertError } = await supabase
      .from('users')
      .insert([{ 
        id: userId,
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        apitoken: encryptedTogglAuth,
        isactive: true
      }]);

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json(
      { message: 'User registered successfully', userId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to register user',
        error: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}