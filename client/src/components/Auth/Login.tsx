import { useEffect } from 'react';
import { useGetStartupConfig } from 'librechat-data-provider/react-query';
import { useAuthContext } from '~/hooks/AuthContext';

function Login() {
  const { isAuthenticated } = useAuthContext();
  const { data: startupConfig, isLoading } = useGetStartupConfig();

  useEffect(() => {
    if (!isLoading && startupConfig && !isAuthenticated) {
      const openIDLoginURL = `${startupConfig.serverDomain}/oauth/openid`;
      window.location.replace(openIDLoginURL);
    }
  }, [isLoading, startupConfig, isAuthenticated]);

  return null;
}

export default Login;
