import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import { env } from 'process';

const contentDir = env.CONTENT_DIR ?? resolve('../obsidian-backup');

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			allow: [contentDir]
		}
	}
});
