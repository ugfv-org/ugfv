/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import locales from 'i18n';
import { confirmProfileImage } from '@/utility/confirm-profile-image.js';
import * as os from '@/os.js';
import { updateI18n } from '@/i18n.js';

vi.mock('@/os.js', () => ({ confirm: vi.fn() }));

describe('confirmProfileImage', () => {
	beforeEach(() => {
		vi.mocked(os.confirm).mockReset();
		updateI18n(locales['ja-JP']);
	});

	test('accepts non-sensitive images without a dialog', async () => {
		expect(await confirmProfileImage({ isSensitive: false })).toBe(true);
		expect(os.confirm).not.toHaveBeenCalled();
	});

	test.each([false, true])('honors cancellation (%s) for sensitive images', async (canceled) => {
		vi.mocked(os.confirm).mockResolvedValue({ canceled });

		expect(await confirmProfileImage({ isSensitive: true })).toBe(!canceled);
		expect(os.confirm).toHaveBeenCalledExactlyOnceWith({
			type: 'warning',
			text: '外部に不意に配信される可能性のある画像のため、センシティブ要素を含まない画像を設定してください',
		});
	});
});
