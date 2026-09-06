import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: {
		'*': ['src/*.ts', 'src/*/*.ts']
	},
	format: ['esm'],
	dts: true,
	outDir: 'dist'
})
