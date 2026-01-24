<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
	<div v-if="!acceptEro" style="padding: 5rem;">
		本サーバーは18歳以上の方を対象としたコンテンツを含みます。<br />
		このコンテンツを閲覧するには、あなたが18歳以上であることを確認する必要があります。<br />
		あなたが18歳以上であることを確認するには、以下のボタンをクリックしてください。<br />
		<MkButton @click="acceptEro = true">18歳以上です</MkButton>
	</div>
	<div v-else>
		<div v-if="instance">
			<XSetup v-if="instance.requireSetup"/>
			<XEntranceClassic v-else-if="(instance.clientOptions.entrancePageStyle ?? 'classic') === 'classic'"/>
			<XEntranceSimple v-else/>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import * as Misskey from 'misskey-js';
import { instanceName } from '@@/js/config.js';
import XSetup from './welcome.setup.vue';
import XEntranceClassic from './welcome.entrance.classic.vue';
import XEntranceSimple from './welcome.entrance.simple.vue';
import { definePage } from '@/page.js';
import { fetchInstance } from '@/instance.js';

/**
 *
 */

import MkButton from '@/components/MkButton.vue';
const acceptEro = ref(false);

const instance = ref<Misskey.entities.MetaDetailed | null>(null);

fetchInstance(true).then((res) => {
	instance.value = res;
});

const headerActions = computed(() => []);

const headerTabs = computed(() => []);

definePage(() => ({
	title: instanceName,
	icon: null,
}));
</script>
