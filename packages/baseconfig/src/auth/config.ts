import { createD1Client } from '@baseconfig/d1'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import type { Auth } from 'better-auth'
import { betterAuth } from 'better-auth/minimal'
import { genericOAuth } from 'better-auth/plugins/generic-oauth'
import type { DefineAuthOptions } from './types/index'

export const defineAuth = (options: DefineAuthOptions): Auth => {
	const db = createD1Client(options.db)

	const auth = betterAuth({
		database: drizzleAdapter(db, { provider: 'sqlite' }),
		secret: options.secret,
		baseURL: options.baseURL,
		basePath: options.basePath ?? '/api/auth',
		trustedOrigins: options.trustedOrigins,
		plugins: options.oauthProvider
			? [
					genericOAuth({
						config: [
							{
								providerId: options.oauthProvider.providerId,
								clientId: options.oauthProvider.clientId,
								clientSecret: options.oauthProvider.clientSecret,
								discoveryUrl: options.oauthProvider.discoveryUrl
							}
						]
					})
				]
			: []
	})

	return auth as Auth
}
