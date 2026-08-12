# Design — Kizuna Apps Product Pages

Hallmark v1.1.0による、複数の独立したアプリブランドを一つのポートフォリオ内で紹介するためのデザインシステムです。

## Genre

modern-minimalを親システムとします。個別ページでは、アプリの用途に応じてplayful、editorial、technicalの表情を構造とウェイトで表現します。

## Macrostructure family

- Portfolio index: Index-First + Catalogue。説明よりも探索を優先します。
- Product pages with rich captures: Workbench、Catalogue、Photographic。
- Product pages with a clear sequence: Narrative Workflow。
- Expressive consumer products: Marquee Hero。
- Products with limited imagery: Long Document。
- Relationship-driven products: Map / Diagram。

URLはすべて維持します。各プロダクトは `showcase/data.js` の設計マップで一つの構造を選びます。

## Theme

- `--color-paper`: `oklch(98.8% 0.004 240)`
- `--color-paper-2`: `oklch(96.5% 0.006 240)`
- `--color-ink`: `oklch(20% 0.012 250)`
- `--color-ink-2`: `oklch(42% 0.012 250)`
- `--color-rule`: `oklch(88% 0.008 240)`
- `--color-accent`: プロダクトごとに、既存ブランド色から一色だけを指定します。
- `--color-focus`: `--color-accent` と同じ色相で、視認性を高めます。

全ページをライトテーマ固定とします。暗色セクション、暗色フッター、カラーフィル背景は使いません。アクセントは1画面あたり5%未満です。

## Typography

- Display: BIZ UDPGothic, weight 700, style normal
- Body: IBM Plex Sans JP, weight 400
- Mono / outlier: IBM Plex Mono, weight 500
- Display tracking: `-0.045em`
- Type scale anchor: `--text-display = clamp(2.75rem, 6vw, 5.25rem)`

見出しは常にローマン体です。イタリック強調は使いません。

## Spacing

4ポイント基準の名前付きスケールを `tokens.css` に定義します。レイアウト値はトークン経由で使用します。

## Motion

- Easings: `--ease-out`、`--ease-in`、`--ease-in-out`
- Reveal: 最初の主要要素だけ、opacity + 8px以下の移動
- Interactive feedback: CTA押下と画像フォーカス
- Reduced motion: 空間移動をなくし、150ms以下のopacityへ縮退

## Microinteractions stance

- 成功トーストは使いません。
- ホバーだけに依存せず、同じ状態をfocus-visibleでも提供します。
- すべてのクリック領域は44px以上にします。

## CTA voice

- Primary: ink fill、角丸12px、短い動詞ラベル
- Secondary: paper fill、1px rule、同じ角丸
- CTAラベルは1行固定です。

## Per-product allowances

- 紙面と本文色、本文書体、CTA形状は全ページで共有します。
- `--app-accent`、見出しの大きさ、画像比率、画像配置、特徴セクションの構造はプロダクトごとに変えてよいものとします。
- 実画面があるページは実画面を使います。画面がないページはタイポグラフィのみで構成します。
- 端末枠、ブラウザ枠、コードエディタ枠は描き直しません。

## What pages MUST share

- Kizuna Appsのナビゲーション名
- 白を主面とするライトテーマ
- display / body / monoの書体
- CTA、フォーカス、キーボード操作の規則
- プライバシー情報とApp Store導線の扱い

## What pages MAY differ on

- Macrostructure
- Hero archetype
- スクリーンショットの数、比率、並び
- ブランドアクセント
- 見出しの改行と余白のリズム

## Exports

実装用の完全なCSSトークンはルートの `tokens.css` を正とします。以下は別環境へ移植するときの対応形式です。

### CSS custom properties

```css
@import "tokens.css";
/* tokens.css contains the complete shared and per-product token set. */
```

### Tailwind v4

```css
@theme {
  --color-paper: oklch(98.8% 0.004 240);
  --color-paper-2: oklch(96.5% 0.006 240);
  --color-paper-3: oklch(93.5% 0.008 240);
  --color-ink: oklch(20% 0.012 250);
  --color-ink-2: oklch(42% 0.012 250);
  --color-muted: oklch(46% 0.01 250);
  --color-rule: oklch(88% 0.008 240);
  --color-rule-2: oklch(76% 0.01 240);
  --color-accent: oklch(54% 0.14 155);
  --color-focus: oklch(42% 0.12 250);
  --font-display: "BIZ UDPGothic", sans-serif;
  --font-body: "IBM Plex Sans JP", sans-serif;
  --font-outlier: "IBM Plex Mono", monospace;
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2.5rem;
  --spacing-2xl: 4rem;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-md: 1.25rem;
  --text-lg: 1.5625rem;
  --text-xl: 1.953rem;
  --text-2xl: 2.441rem;
  --radius-card: 20px;
  --radius-pill: 999px;
  --radius-input: 12px;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
}
```

### DTCG tokens.json

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "color": {
    "paper": { "$value": "oklch(98.8% 0.004 240)", "$type": "color" },
    "paper-2": { "$value": "oklch(96.5% 0.006 240)", "$type": "color" },
    "paper-3": { "$value": "oklch(93.5% 0.008 240)", "$type": "color" },
    "ink": { "$value": "oklch(20% 0.012 250)", "$type": "color" },
    "ink-2": { "$value": "oklch(42% 0.012 250)", "$type": "color" },
    "muted": { "$value": "oklch(46% 0.01 250)", "$type": "color" },
    "rule": { "$value": "oklch(88% 0.008 240)", "$type": "color" },
    "rule-2": { "$value": "oklch(76% 0.01 240)", "$type": "color" },
    "accent": { "$value": "oklch(54% 0.14 155)", "$type": "color" },
    "focus": { "$value": "oklch(42% 0.12 250)", "$type": "color" }
  },
  "font": {
    "display": { "$value": "BIZ UDPGothic, sans-serif", "$type": "fontFamily" },
    "body": { "$value": "IBM Plex Sans JP, sans-serif", "$type": "fontFamily" },
    "outlier": { "$value": "IBM Plex Mono, monospace", "$type": "fontFamily" }
  },
  "space": {
    "xs": { "$value": "0.5rem", "$type": "dimension" },
    "sm": { "$value": "0.75rem", "$type": "dimension" },
    "md": { "$value": "1rem", "$type": "dimension" },
    "lg": { "$value": "1.5rem", "$type": "dimension" },
    "xl": { "$value": "2.5rem", "$type": "dimension" },
    "2xl": { "$value": "4rem", "$type": "dimension" },
    "3xl": { "$value": "6rem", "$type": "dimension" },
    "4xl": { "$value": "9rem", "$type": "dimension" }
  },
  "duration": {
    "micro": { "$value": "120ms", "$type": "duration" },
    "short": { "$value": "220ms", "$type": "duration" },
    "long": { "$value": "420ms", "$type": "duration" }
  }
}
```

### shadcn/ui variables

```css
:root {
  --background: 98.8% 0.004 240;
  --foreground: 20% 0.012 250;
  --card: 96.5% 0.006 240;
  --card-foreground: 20% 0.012 250;
  --popover: 96.5% 0.006 240;
  --popover-foreground: 20% 0.012 250;
  --primary: 54% 0.14 155;
  --primary-foreground: 98.8% 0.004 240;
  --secondary: 93.5% 0.008 240;
  --secondary-foreground: 42% 0.012 250;
  --muted: 88% 0.008 240;
  --muted-foreground: 46% 0.01 250;
  --accent: 54% 0.14 155;
  --accent-foreground: 98.8% 0.004 240;
  --destructive: 58% 0.20 25;
  --destructive-foreground: 98.8% 0.004 240;
  --border: 88% 0.008 240;
  --input: 88% 0.008 240;
  --ring: 42% 0.12 250;
  --radius: 12px;
}
```
