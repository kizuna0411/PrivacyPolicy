# プライバシー・法務ページ調査台帳

調査日: 2026-07-31。対象はこのワークスペース内で利用者に提供するアプリ／SaaSを、同一プロダクトの旧実装をまとめて数えた22件です。`policy.html` はこの台帳の実装根拠に対応します。

| 区分 | プロダクト | 主な情報・権限 | 外部送信／委託先 | アカウント・販売 |
|---|---|---|---|---|
| 金融・記録 | DorePay | 家計・決済入力、端末情報 | Firebase、Supabase、AdMob | アカウント、App Store課金 |
| 情報 | Currency Window | 任意の位置、設定 | 為替API、Apple | App Store課金 |
| 位置・共有 | DokoIku | 位置、共有地点・メモ | MapKit、CloudKit | 共有機能 |
| 文書 | ESWriter | メール、応募書類 | Firebase Auth/Firestore | アカウント |
| 記録 | FlightRecord | 位置、写真、飛行記録 | Firebase Functions、Apple | App Store課金 |
| 生産性 | ZenTree | タイマー、通知、端末情報 | Firebase、AdMob（旧版） | - |
| 気象 | HareTenki | 位置、地点、端末情報 | Firebase、MapKit、Apple | App Store課金 |
| 気象 | KasaCat | 位置、地点、通知設定 | WeatherKit、MapKit | - |
| 画像 | MatchDayFrame | 写真、試合入力 | Firebase、Mapbox | - |
| ゲーム | NomiSugoroku | 表示名、対戦、動画・写真・音声 | Cloudflare Workers/DO/R2 | 共有・対戦 |
| 記録 | ReadingLog | 読書記録、カメラ、端末情報 | AdMob、RevenueCat、Firebase（旧版） | App Store課金 |
| 生産性 | Readrop | URL、メモ、通知設定 | なし（端末内） | - |
| 旅行 | TabiPlot | 認証、旅程、位置、写真、連絡先 | Firebase、AdMob、Google Maps | アカウント |
| 位置・写真 | TomeLog | 駐車位置、写真、通知 | MapKit | - |
| 生産性 | わすれな | リマインダー、端末情報 | AdMob、Apple | App Store課金 |
| 予定 | Yohaku | メール、Apple ID、予定、カレンダー、通知 | Firebase、Cloudflare | アカウント |
| 在庫 | Zaikoff | 在庫、カメラ、写真・書類、通知 | Supabase（旧版） | アカウント（旧版） |
| 学習 | 合格ログ | 学習記録、通知、端末情報 | Firebase、AdMob、Apple | App Store課金 |
| 生産性 | Subscription | 契約情報、通知 | CloudKit、為替API | - |
| 就職 | 就活管理 | 応募・予定、カレンダー、端末情報 | Firebase、AdMob | - |
| 精算 | われっと | 認証、精算、画像、メッセージ | Supabase | アカウント・削除機能 |
| 開発支援 | AppleStoreConnectAutotranslate | APIキー、翻訳対象テキスト | Apple、OpenAI/Gemini/Z.AI | 利用者のAPIキー |

## 対象外

ASO、AppStoreReleaseTemplate、firebase-ad、各 `Store`・スクリーンショット生成フォルダ、設計資料およびビルド生成物は、単独で利用者向けサービスを提供せず、独自の個人データ処理も確認できなかったため、公開ポリシーの対象外としました。

## リリース前に必ず確定する事項

1. 有料販売するプロダクトは、販売事業者の住所・電話番号、価格、追加負担、支払時期・方法、提供時期、解約・返品条件を確定し、特定商取引法に基づく表記と購入最終確認画面に掲載すること。
2. アカウントを作成できる ESWriter、TabiPlot、Yohaku、Zaikoff（旧版）、われっと、DorePay は、アプリ内の削除開始導線と公開の削除案内URLを実装・検証すること。
3. App Store ConnectのApp Privacy、Google PlayのData safety、ATT、各OS権限の直前説明を、実際に組み込むSDK・リリースビルドに合わせて更新すること。
4. 広告SDK・分析SDK・認証／クラウドの追加・削除時は、`policy.html` と該当ストア申告を同一リリースで更新すること。
