# vue3-awesome-form

Vue 3 / Vuetify 4 / Zod / Vue I18n を使った、**多言語対応・型安全なフォーム実装**のサンプルプロジェクト。

## セットアップ

```bash
npm install
npm run dev
```

## このサンプルのねらい

### 1. バリデーションルールを Zod スキーマで記述する

各フィールドの値とその制約は `src/entities/` 配下のエンティティファイルに Zod スキーマとして定義する。

```ts
// src/entities/text-field-value.ts
export const TEXT_FIELD_VALUE_MIN_LENGTH = 1;
export const TEXT_FIELD_VALUE_MAX_LENGTH = 5;

export const TextFieldValue = {
  schema: z.string().min(TEXT_FIELD_VALUE_MIN_LENGTH).max(TEXT_FIELD_VALUE_MAX_LENGTH),
};
```

Vuetify の `rules` プロパティに渡せる形式への変換は `src/utils/validationUtils.ts` の `validationRule` ユーティリティが担う。

```ts
// src/utils/validationUtils.ts
validationRule(schema, errorMessage?)
// → (value: unknown) => boolean | string
```

Zod スキーマと Vuetify の rules を直接つなぐことで、**制約の定義が一箇所に集約**され、スキーマを変更すれば UI のバリデーションも自動的に追従する。

---

### 2. エラーメッセージはスキーマではなくコンポーザブルで定義し、Vue I18n で多言語化する

Zod スキーマはバリデーションロジックのみを持ち、**エラーメッセージを含まない**。
メッセージは `src/composables/useAwesomeFormValues.ts` の中で Vue I18n の `t()` と組み合わせて定義する。

```ts
// src/composables/useAwesomeFormValues.ts
const textFieldProps = reactive({
  hint: computed(() => t('{min}〜{max}文字で入力してください', { min, max })),
  rules: [
    validationRule(TextFieldValue.schema, {
      required: () => t('入力は必須です'),
      tooBig: ({ max }) => t('{max}文字以下で入力してください', { max }),
    }),
  ],
});
```

`validationRule` の第2引数でエラーコード（`required` / `tooSmall` / `tooBig` / `notMultipleOf` / `invalidType` / `custom`）ごとにメッセージ生成関数を渡す。これにより、

- スキーマは言語・UI に依存しない純粋なバリデーションロジックのまま保たれる
- `hint` は `computed` によってロケール変更に追従する。`rules` は静的に生成され、バリデーション実行時に `t()` を呼び出すためロケール変更は次回のバリデーショントリガー時（入力変更・フォーカスアウトなど）に反映される
- `reactive` 内の `computed` は自動的にアンラップされるため、テンプレートから `v-bind="textFieldProps"` のまま利用できる
- 独自のカスタムエラー（`z.superRefine` など）にも同じ仕組みで対応できる

フォーム全体のバリデーション済み値は `ValidFormValue.schema.safeParse()` で検証し、
通過した場合のみ型安全な値（`ValidFormValue` 型）として `validFormValue` に書き込む。

```ts
const validatedFormValue = computed(() =>
  ValidFormValue.schema.safeParse({ /* 各フィールドの値 */ }).data
);
watch(validatedFormValue, (value) => validFormValue.value = value, { immediate: true });
```

---

### 3. `VForm` がスロット内の `VInput` を検証する機能を活用する

Vuetify の `VForm` はスロット内にある `VInput` 系コンポーネントを自動的に検出し、
`v-model`（`modelValue: boolean | null`）でフォーム全体のバリデーション状態を管理する。

`VTextField` や `VNumberInput` など `rules` プロパティを持つコンポーネントはそのまま使える。
`VOtpInput` や `VRating` のように **`rules` を直接持たないコンポーネント**は、
`VInput` でラップし `:validation-value` で検証対象の値を渡すことで同じ仕組みに乗せられる。

```html
<!-- AwesomeForm.vue -->
<VInput :validation-value="otpInputValue" v-bind="otpInputProps">
  <VLabel>VOtpInput</VLabel>
  <VOtpInput v-model="otpInputValue" />
</VInput>
```

`VForm` のバリデーション状態（Vuetify）と `ValidFormValue`（Zod）は独立した2系統の検証であり、
送信可否の判定には両方の確認を推奨する。

```ts
// App.vue
const canSubmit = computed(() =>
  isFormValid.value === true && validFormValue.value !== undefined
);
```

---

## プロジェクト構成

```
src/
├── App.vue                      # ルートコンポーネント・送信ロジック
├── main.ts
├── components/
│   ├── AppBar.vue               # 言語切替 UI
│   └── AwesomeForm.vue          # フォームコンポーネント
├── composables/
│   └── useAwesomeFormValues.ts  # 各フィールドの状態・props・多言語メッセージを管理
├── entities/                    # フィールドごとの値スキーマと型
│   ├── text-field-value.ts
│   ├── number-input-value.ts
│   ├── autocomplete-value.ts
│   ├── slider-value.ts
│   ├── range-slider-value.ts
│   ├── file-input-value.ts
│   ├── otp-input-value.ts
│   ├── rating-value.ts
│   ├── valid-form-value.ts      # フォーム全体のバリデーション済み値（上記の合成）
│   └── locales.ts
├── plugins/
│   ├── i18n.ts
│   └── vuetify.ts
└── utils/
    └── validationUtils.ts       # Zod エラーコード → Vuetify rules 変換ユーティリティ
```

---

## 補足パターン

このプロジェクトの主眼ではないが、コードを読む上で知っておくと理解しやすいパターンを補足する。

### ネームスペースオブジェクトパターン

エンティティファイルでは `const Foo` と `type Foo` を同名で export している。
TypeScript の[宣言マージ](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)により、値と型を同一の識別子に集約できる。

```ts
// entities/text-field-value.ts
export const TextFieldValue = {
  schema: z.string().min(1).max(5),
};
export type TextFieldValue = z.infer<typeof TextFieldValue.schema>;

// 呼び出し側
TextFieldValue.schema   // Zod スキーマ（値として）
const val: TextFieldValue = '...'  // バリデーション済み型（型として）
```

### `z.input` と `z.infer` の使い分け

```ts
// v-model でバインドする ref の型（スキーマ適用前の生の値）
export type TextFieldInputValue = z.input<typeof TextFieldValue.schema>;

// バリデーション・変換後の型（送信ペイロードなど、確実に valid な値として扱う場面）
export type TextFieldValue = z.infer<typeof TextFieldValue.schema>;
```

変換（`z.coerce` など）がなければ両者は一致する。`z.coerce.number()` のような場合は異なる。

### 日本語文字列を i18n キーとするパターン

```ts
// composables/useAwesomeFormValues.ts
const messageEn = {
  '入力は必須です': 'Input is required',
  '{max}文字以下で入力してください': 'Please enter no more than {max} characters',
  // ...
} as const;

// messageJa はキーをそのまま値にしたマップ（キー = 表示文字列）
const messageJa = Object.fromEntries(Object.keys(messageEn).map(k => [k, k]));
```

`fallbackLocale: 'ja'`（`src/plugins/i18n.ts`）と組み合わせることで、
翻訳キーの追加漏れがあっても日本語がそのままフォールバック表示される。
日本語環境での開発中は `t('入力は必須です')` と書けばそのまま表示されるため、可読性が高い。
