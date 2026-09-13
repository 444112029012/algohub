import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-vermillion">404</p>
      <h1 className="font-heading mt-2 text-3xl">沒有這篇教材</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        網址可能打錯，或這支演算法還沒寫進研究室。
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-9 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
      >
        回目錄
      </Link>
    </div>
  );
}
