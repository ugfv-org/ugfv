/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { describe, expect, test } from 'vitest';

import { ActivityPubServerService } from '@/server/ActivityPubServerService.js';
import type { MiNote } from '@/models/Note.js';

describe('ActivityPubServerService', () => {
	describe('applyRemoteQueryVisibility', () => {
		const service = Object.create(ActivityPubServerService.prototype) as ActivityPubServerService;

		test('treats local public notes as home for ActivityPub remote query rendering', () => {
			const note = {
				id: 'some-note-id',
				userHost: null,
				localOnly: false,
				visibility: 'public',
			} as MiNote;

			const rendered = service['applyRemoteQueryVisibility'](note);

			expect(rendered.visibility).toBe('home');
			expect(note.visibility).toBe('public');
		});

		test('does not change home visibility', () => {
			const note = {
				id: 'some-note-id',
				userHost: null,
				localOnly: false,
				visibility: 'home',
			} as MiNote;

			expect(service['applyRemoteQueryVisibility'](note)).toBe(note);
		});

		test('does not change local-only public notes', () => {
			const note = {
				id: 'some-note-id',
				userHost: null,
				localOnly: true,
				visibility: 'public',
			} as MiNote;

			expect(service['applyRemoteQueryVisibility'](note)).toBe(note);
		});

		test('does not change remote public notes', () => {
			const note = {
				id: 'some-note-id',
				userHost: 'remote.example',
				localOnly: false,
				visibility: 'public',
			} as MiNote;

			expect(service['applyRemoteQueryVisibility'](note)).toBe(note);
		});
	});
});
