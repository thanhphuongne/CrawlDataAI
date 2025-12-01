import React, { useState } from 'react';
import { toast } from 'sonner';

interface VerifyOTPPageProps {
  accountName: string;
  password: string;
  onVerified: (accessToken: string, user: any) => void;
  onBack: () => void;
}

export default function VerifyOTPPage({ accountName, password, onVerified, onBack }: VerifyOTPPageProps) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const { authAPI } = await import('../utils/api');
      const response = await authAPI.verifyOTP({ accountName, otp, password });
      
      if (response.data.success) {
        toast.success('Email verified successfully!');
        onVerified(response.data.accessToken, response.data.user);
      }
    } catch (error: any) {
      console.error('Verification failed:', error);
      const errorMsg = error.response?.data?.message || 'Invalid or expired code';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { authAPI } = await import('../utils/api');
      const response = await authAPI.resendOTP({ accountName });
      
      if (response.data.success) {
        toast.success('Verification code sent! Check your email.');
        setOtp('');
      }
    } catch (error: any) {
      console.error('Resend failed:', error);
      toast.error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div style={{
      width: '100%',
      maxWidth: '400px',
      margin: '0 auto',
      padding: '40px 20px',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Verify Your Email
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>
            We've sent a 6-digit code to
          </p>
          <p style={{ color: '#333', fontWeight: '500', marginTop: '4px' }}>
            {accountName}
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
            }}>
              Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '18px',
                letterSpacing: '4px',
                textAlign: 'center',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                outline: 'none',
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading || otp.length !== 6 ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading || otp.length !== 6 ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
            }}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4CAF50',
                  fontWeight: '600',
                  cursor: isResending ? 'not-allowed' : 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {isResending ? 'Sending...' : 'Resend'}
              </button>
            </p>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#666',
                fontSize: '14px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Back to Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
