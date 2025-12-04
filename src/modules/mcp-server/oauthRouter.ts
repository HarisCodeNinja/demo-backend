import { Router, Request, Response } from 'express';
import { MCPController } from './controller';

const oauthRouter = Router();

oauthRouter.get('/authorize', MCPController.authorize);
oauthRouter.post('/oauth/token', MCPController.getOAuthToken);

const buildBaseUrl = (req: Request) => {
  const proto = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  return `${proto}://${host}`;
};

const authorizationMetadataHandler = (req: Request, res: Response) => {
  const baseUrl = buildBaseUrl(req);
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
  });
};

const resourceMetadataHandler = (req: Request, res: Response) => {
  const baseUrl = buildBaseUrl(req);
  res.json({
    issuer: baseUrl,
    resource: `${baseUrl}/mcp`,
    authorization_servers: [`${baseUrl}/.well-known/oauth-authorization-server`],
    token_endpoint: `${baseUrl}/oauth/token`,
  });
};

const openIdConfigHandler = (req: Request, res: Response) => {
  const baseUrl = buildBaseUrl(req);
  const scopes = (process.env.MCP_OAUTH_SCOPE || 'user:manager user:hr user:admin')
    .split(/\s+/)
    .filter(Boolean);

  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'client_credentials'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    scopes_supported: scopes,
  });
};

oauthRouter.get('/.well-known/oauth-authorization-server', authorizationMetadataHandler);
oauthRouter.get('/.well-known/oauth-authorization-server/mcp', authorizationMetadataHandler);
oauthRouter.get('/.well-known/oauth-protected-resource', resourceMetadataHandler);
oauthRouter.get('/.well-known/oauth-protected-resource/mcp', resourceMetadataHandler);
oauthRouter.get('/.well-known/openid-configuration', openIdConfigHandler);
oauthRouter.get('/.well-known/openid-configuration/mcp', openIdConfigHandler);
oauthRouter.get('/.well-known/oauth-authorization-server/.well-known/openid-configuration', openIdConfigHandler);

export default oauthRouter;
