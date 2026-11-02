/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as os from '@/os.js';
import { i18n } from '@/i18n.js';

export async function confirmProfileImage(file: { isSensitive: boolean }): Promise<boolean> {
	if (!file.isSensitive) return true;

	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.ts.profileImageSensitiveConfirm,
	});
	return !canceled;
}
