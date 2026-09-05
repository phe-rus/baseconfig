import { Fragment } from 'react'
import type { AdminConfigProviderProps } from '../types'
import { AdminConfigProvider } from './config-context'
import { Headers } from './headers'

export function RouteRoot({ config, children }: AdminConfigProviderProps) {
	return (
		<AdminConfigProvider config={config}>
			<Fragment>
				<Headers />
				{children}
			</Fragment>
		</AdminConfigProvider>
	)
}
