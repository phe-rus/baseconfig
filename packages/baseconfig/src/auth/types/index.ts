type OAuthProviderConfig = {
	providerId: string
	clientId: string
	clientSecret: string
	discoveryUrl: string
}

type DefineAuthOptions = {
	db: D1Database
	secret: string
	baseURL: string
	basePath?: string
	trustedOrigins?: string[]
	oauthProvider?: OAuthProviderConfig
}

export type { DefineAuthOptions, OAuthProviderConfig }
