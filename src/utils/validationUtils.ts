import type { core, ZodType } from 'zod';

/**
 * Zod スキーマを Vuetify の `rules` プロパティに渡せるバリデーション関数へ変換する。
 *
 * Vuetify の rules は `(value: unknown) => boolean | string` の形式を期待する。
 * `true` を返せばバリデーション通過、文字列を返せばエラーメッセージとして表示される。
 * `false` を返すとエラー状態になるがメッセージは表示されない。
 *
 * Zod のエラーコードを `errorMessage` の各ハンドラにマッピングすることで、
 * ユーザー向けの多言語対応メッセージを柔軟に指定できる。
 * ハンドラが与えられなかった、あるいはメッセージを生成できなかった場合は `false` を返す
 *（Vuetify はエラー状態になるが、メッセージは表示されない）。
 *
 * @param schema - バリデーションに使用する Zod スキーマ
 * @param errorMessage - Zod のエラーコードに対応するメッセージ生成関数のマップ
 * @returns Vuetify の rules に渡せるバリデーション関数
 *
 * @example
 * validationRule(z.string().min(1).max(100), {
 *   required: () => t('入力は必須です'),
 *   tooBig: ({ max }) => t('{max}文字以下で入力してください', { max }),
 * })
 */
export const validationRule = (
  schema: ZodType,
  errorMessage?: {
    /**
     * 空文字、undefined、null のときのエラーメッセージ。
     * too_small や invalid_type よりも優先される。
     */
    required?: () => string;
    /**
     * min 制約に違反したときのエラーメッセージ。
     */
    tooSmall?: (params: { min: number | bigint }) => string;
    /**
     * max 制約に違反したときのエラーメッセージ。
     */
    tooBig?: (params: { max: number | bigint }) => string;
    /**
     * 倍数制約に違反したときのエラーメッセージ。
     */
    notMultipleOf?: (params: { multipleOf: number | bigint }) => string;
    /**
     * 型やフォーマット制約に違反したときのエラーメッセージ。
     */
    invalidType?: () => string;
    /**
     * カスタムエラー。Zod の refine メソッドなどで発生させることができる。
     * エラーメッセージを返さなかった場合は、メッセージが生成できなかったものとし、
     * fallbackToZodMessage が指定されていれば zod のデフォルトメッセージにフォールバックする。
     */
    custom?: (params: { issue: core.$ZodIssue }) => string | undefined;
    /**
     * エラーメッセージが与えられなかった、あるいは生成できなかったときに、
     * zod のデフォルトメッセージを使用するかどうか。
     */
    fallbackToZodMessage?: boolean;
  }
): ((value: unknown) => boolean | string) => {
  return (value) => {
    const { success, error } = schema.safeParse(value);
    const isEmptyLike = value === '' || value === undefined || value === null;
    if (success) return true;

    if (errorMessage === undefined) {
      return false;
    }

    for (const issue of error.issues) {
      switch (issue.code) {
        case 'too_small': // 最小値・最小長などの制約違反
          if (isEmptyLike && errorMessage.required !== undefined) {
            /**
             * EmptyLike のときにこのエラーになった場合、required エラーとして扱う
             */
            return errorMessage.required();
          }
          if (errorMessage.tooSmall !== undefined) {
            return errorMessage.tooSmall({ min: issue.minimum });
          }
          break;
        case 'too_big': // 最大値・最大長などの制約違反
          if (errorMessage.tooBig !== undefined) {
            return errorMessage.tooBig({ max: issue.maximum });
          }
          break;
        case 'not_multiple_of': // 倍数制約の不一致
          if (errorMessage.notMultipleOf !== undefined) {
            return errorMessage.notMultipleOf({ multipleOf: issue.divisor });
          }
          break;
        case 'invalid_type': // 型の不一致
        case 'invalid_format': // 文字列フォーマットの不一致
        case 'invalid_value': // リテラル・列挙値など値の不一致
        case 'invalid_union': // union 型の不一致
        case 'unrecognized_keys': // 想定外キーの存在
        case 'invalid_key': // record/map のキー検証失敗
        case 'invalid_element': // set/map の要素検証失敗
          if (isEmptyLike && errorMessage.required !== undefined) {
            /**
             * EmptyLike のときにこのエラーになった場合、required エラーとして扱う
             */
            return errorMessage.required();
          }
          if (errorMessage.invalidType !== undefined) {
            return errorMessage.invalidType();
          }
          break;
        case 'custom': // カスタムエラー
          if (errorMessage.custom !== undefined) {
            const message = errorMessage.custom({ issue });
            if (message !== undefined) return message;
          }
          break;
      }

      if (errorMessage.fallbackToZodMessage) {
        return issue.message;
      }
    }
    return false;
  };
};
