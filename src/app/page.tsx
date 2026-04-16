import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BookOpen, History, ChevronRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-16">
      {/* Hero */}
      <div className="text-center space-y-4">
        <Badge variant="outline" className="text-xs px-3 py-1">
          Claude Sonnet 4.6 搭載
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">
          Case<span className="text-primary">Lab</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          MBB水準のAI面接官と壁打ちして、
          <br />
          戦略コンサルのケース面接を突破する。
        </p>
      </div>

      {/* Mode cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/sparring" className="group">
          <div className="border border-border rounded-2xl p-6 h-full hover:border-primary hover:shadow-md transition-all bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <h2 className="text-lg font-semibold mb-2">壁打ちモード</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              McKinseyのシニアパートナー「Alex」がリアルな面接をシミュレート。
              弱い仮説にはpush-back、セッション後に5軸フィードバック。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["収益性分析", "市場規模推計", "成長戦略"].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Link>

        <Link href="/model-answer" className="group">
          <div className="border border-border rounded-2xl p-6 h-full hover:border-primary hover:shadow-md transition-all bg-card">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <h2 className="text-lg font-semibold mb-2">模範解答モード</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              MBBシニアコンサルが実演するモデルアンサーを確認。
              壁打ち後に自分の回答と並べて比較できます。
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Issue Tree", "仮説思考", "定量分析"].map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* How to use */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          使い方
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { step: "01", title: "ケースを選ぶ", desc: "収益性・市場規模・成長戦略から選択" },
            { step: "02", title: "AI面接官と壁打ち", desc: "懐疑的な面接官と本番さながらの対話" },
            { step: "03", title: "フィードバック＆比較", desc: "5軸スコアで弱点を把握、模範解答と比較" },
          ].map((item) => (
            <div key={item.step} className="flex gap-3">
              <span className="text-2xl font-bold text-primary/20 leading-none">
                {item.step}
              </span>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3 justify-center">
        <Link
          href="/sparring"
          className="inline-flex items-center justify-center h-9 gap-1.5 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/80 transition-colors"
        >
          壁打ちを始める
        </Link>
        <Link
          href="/history"
          className="inline-flex items-center justify-center h-9 gap-1.5 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
        >
          <History className="h-4 w-4" />
          履歴を見る
        </Link>
      </div>
    </div>
  );
}
