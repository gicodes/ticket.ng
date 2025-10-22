'use client';

import React from 'react';
import { Role } from '@/types/users';
import { AdminLogin } from '../_level_2/adminLogin';
import SignInOptions from '../_level_1/signInOptions';
import { AuthDivider } from '../_level_1/orAuthDivider';
import { CredentialsForm } from '../_level_2/userLogin';
import { Box, Stack, Typography } from '@mui/material';

interface LoginProps { role?: Role; }

export const Login = ({role}: LoginProps) => {
  const isUser = role === "USER";

  return (
    <Box mt={5} minHeight={'75vh'}>
      <Box p={2} mx={'auto'} maxWidth={1200}>
        <Stack mt={5} gap={2} mx={'auto'} maxWidth={500}>
          <Stack gap={1} textAlign={'center'} py={1}>
            <Typography variant='h4'>Login to continue</Typography>
          </Stack>
          { isUser ? 
            <>
              <SignInOptions />
              <AuthDivider />
              <CredentialsForm /> 
            </>
            : (role === "ADMIN" || role === "AGENT") && <AdminLogin />
          }
        </Stack>
      </Box>
    </Box>
  );
};
