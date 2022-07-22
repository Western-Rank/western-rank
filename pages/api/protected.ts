/**
 * Example route that requires authentication to access
 */

import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(function ProtectedRoute(req, res) {
  // we know session is not null | undefined since ApiAuth is required
  const session = getSession(req, res)!;
  res.send(`Hello, ${session.user}!`);
});