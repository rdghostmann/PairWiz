import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center w-full min-h-screen">
      <section className="w-fit">
        <h1 className="text-center text-3xl ">Welcome</h1>
        <div className="text-center mt-7">
          <Link className="bg-slate-600 text-white p-4 rounded-md" href="/permute">Go to Permutation and Combination Tools</Link>
        </div>
      </section>
    </main>
  );
}
