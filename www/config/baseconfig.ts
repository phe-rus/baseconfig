import { buildConfig } from '@baseconfig/core'
import { media } from './collections/media'
import { pages } from './collections/pages'
import { users } from './collections/users'
import { footer } from './globals/footer'
import { headers } from './globals/headers'

export default buildConfig({
	collections: [pages, users, media],
	globals: [headers, footer]
})
