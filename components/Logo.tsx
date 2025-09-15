'use client';

import { Box, Typography } from '@mui/material';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'horizontal' | 'vertical';
  color?: 'dark' | 'light';
}

const sizeMap = {
  small: { width: 60, height: 30 },
  medium: { width: 120, height: 60 },
  large: { width: 180, height: 90 }
};

export default function Logo({ 
  size = 'medium', 
  showText = true, 
  variant = 'horizontal',
  color = 'dark'
}: LogoProps) {
  const dimensions = sizeMap[size];
  
  // Use the Otic logo image
  const LogoIcon = () => (
    <Box sx={{
      width: dimensions.width,
      height: dimensions.height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <img
        src="/Otic icon@2x.png"
        alt="Otic"
        width={dimensions.width}
        height={dimensions.height}
        style={{ objectFit: 'contain' }}
      />
    </Box>
  );
  
  if (variant === 'vertical') {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        gap: 1
      }}>
        <LogoIcon />
        {showText && (
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant={size === 'small' ? 'body2' : size === 'medium' ? 'h6' : 'h5'}
              sx={{ 
                fontWeight: 800, 
                color: color === 'light' ? 'white' : '#1a237e',
                lineHeight: 1,
                letterSpacing: '0.5px',
                textShadow: color === 'light' ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Otic
            </Typography>
            <Typography 
              variant={size === 'small' ? 'caption' : 'body2'}
              sx={{ 
                color: color === 'light' ? 'rgba(255,255,255,0.8)' : '#666',
                fontSize: size === 'small' ? '0.7rem' : '0.8rem',
                lineHeight: 1,
                fontWeight: 500,
                letterSpacing: '0.3px',
                fontStyle: 'italic'
              }}
            >
              professional property valuation
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      gap: 2
    }}>
      <LogoIcon />
      {showText && (
        <Box>
          <Typography 
            variant={size === 'small' ? 'body2' : size === 'medium' ? 'h6' : 'h5'}
            sx={{ 
              fontWeight: 800, 
              color: color === 'light' ? 'white' : '#1a237e',
              lineHeight: 1,
              letterSpacing: '0.5px',
              textShadow: color === 'light' ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Otic
          </Typography>
          <Typography 
            variant={size === 'small' ? 'caption' : 'body2'}
            sx={{ 
              color: color === 'light' ? 'rgba(255,255,255,0.8)' : '#666',
              fontSize: size === 'small' ? '0.7rem' : '0.8rem',
              lineHeight: 1,
              fontWeight: 500,
              letterSpacing: '0.3px',
              fontStyle: 'italic'
            }}
          >
            professional property valuation
          </Typography>
        </Box>
      )}
    </Box>
  );
}
