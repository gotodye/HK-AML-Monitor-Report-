import express from 'express';

const app = express();

const HARDCODED_WHITELIST = [
  'laurence0315.lt@gmail.com',
  'gotodye@gmail.com'
];
const ENV_WHITELIST = (process.env.WHITELISTED_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean);
  
const WHITELIST = [...new Set([...HARDCODED_WHITELIST, ...ENV_WHITELIST])];

const getAppUrl = (req: express.Request) => {
  let url = process.env.APP_URL;
  if (!url) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    url = `${protocol}://${host}`;
  }
  return url.replace(/\/$/, '');
};

app.get('/api/auth/url', (req, res) => {
  const appUrl = getAppUrl(req);
  const redirectUri = `${appUrl}/auth/callback`;
  
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || '',
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  res.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}` });
});

app.get('/auth/callback', async (req, res) => {
  const { code } = req.query;
  
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const redirectUri = `${protocol}://${host}/auth/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        code: code as string,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      })
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const userData = await userRes.json();

    const email = userData.email?.toLowerCase();
    
    if (!WHITELIST.includes(email)) {
      return res.send(`
        <html><body><script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '您的 Email 不在白名單中：' + '${email}' }, '*');
            window.close();
          } else {
            window.location.href = '/';
          }
        </script>
        <p>認證失敗，請關閉此視窗。</p>
        </body></html>
      `);
    }

    res.send(`
      <html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', user: { email: '${email}', name: '${userData.name}' } }, '*');
          window.close();
        } else {
          window.location.href = '/';
        }
      </script>
      <p>認證成功，請關閉此視窗。</p>
      </body></html>
    `);
  } catch (error: any) {
    res.send(`
      <html><body><script>
        if (window.opener) {
          window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: '登入失敗' }, '*');
          window.close();
        } else {
          window.location.href = '/';
        }
      </script>
      <p>認證失敗，請關閉此視窗。</p>
      </body></html>
    `);
  }
});

export default app;
