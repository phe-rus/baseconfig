import { createContext, useContext } from 'react'
import type { AdminConfigProviderProps } from '../types'

const AdminConfigContext = createContext<
	AdminConfigProviderProps['config'] | undefined
>(undefined)

export const AdminConfigProvider = ({
	config,
	children
}: AdminConfigProviderProps) => (
	<AdminConfigContext.Provider value={config}>
		{children}
	</AdminConfigContext.Provider>
)

export const useAdminConfig = () => {
	const config = useContext(AdminConfigContext)

	if (!config) {
		throw new Error('useAdminConfig must be used within AdminConfigProvider')
	}

	return config
}
