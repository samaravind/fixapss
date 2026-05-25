import Image from "next/image";

type BrandRow = {
  name: string;
  description: string;
  logo: string;
  image: string;
  accent: string;
};

const brands: BrandRow[] = [
  { name: "Horlicks", description: "Classic malt nutrition brand", logo: "H", image: "/shopping.webp", accent: "bg-[#8b1c1c]" },
  { name: "MamyPoko", description: "Baby care and hygiene", logo: "M", image: "/electronics/e8.webp", accent: "bg-[#f1c14f]" },
  { name: "Pampers", description: "Trusted diaper essentials", logo: "P", image: "/accessories/uly.webp", accent: "bg-[#7f1d1d]" },
  { name: "CeraVe", description: "Dermatology-led skincare", logo: "C", image: "/watch-images/watch.webp", accent: "bg-[#d3d8e5]" },
  { name: "Sprinz BB", description: "Lifestyle and family goods", logo: "S", image: "/electronics/e3.webp", accent: "bg-[#d38f6a]" },
];

function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function IconStore() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 10h16v8H4z" strokeLinejoin="round" />
      <path d="M5 10V6h14v4" strokeLinecap="round" />
      <path d="M9 18v-4h6v4" strokeLinecap="round" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a3.5 3.5 0 0 0-2.5-3.35" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2-1l-1.1-1.9a8 8 0 0 0 0-1.2l1.1-1.9a1 1 0 0 0-.2-1l-1.2-1.2a1 1 0 0 0-1-.2l-1.9 1.1a8 8 0 0 0-1.2 0l-1.9-1.1a1 1 0 0 0-1 .2L9 6.8a1 1 0 0 0-.2 1L9.9 9.7a8 8 0 0 0 0 1.2L8.8 12.8a1 1 0 0 0 .2 1L10.2 15a1 1 0 0 0 1 .2l1.9-1.1a8 8 0 0 0 1.2 0l1.9 1.1a1 1 0 0 0 1-.2Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12l9-9h7l2 2v7l-9 9L3 12Z" strokeLinejoin="round" />
      <circle cx="15.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function BrandSidebarIcon({ active, children }: { active?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${active ? "bg-[#edf2ff] text-[#2850f0]" : "text-slate-500"} transition`}>
      {children}
    </div>
  );
}

export default function BrandingPage() {
  return (
    <main className="min-h-screen bg-[#f3f4f8] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-[92px] shrink-0 border-r border-[#e2e6ef] bg-[#f7f8fb] px-3 py-4 md:flex md:flex-col md:items-center md:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2850f0] text-lg font-bold text-white shadow-sm">
            F
          </div>
          <div className="mt-2 flex flex-col items-center gap-3">
            <BrandSidebarIcon>
              <IconGrid />
            </BrandSidebarIcon>
            <BrandSidebarIcon>
              <IconStore />
            </BrandSidebarIcon>
            <BrandSidebarIcon>
              <IconUsers />
            </BrandSidebarIcon>
            <BrandSidebarIcon active>
              <IconSettings />
            </BrandSidebarIcon>
            <BrandSidebarIcon>
              <IconTag />
            </BrandSidebarIcon>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="border-b border-[#e2e6ef] bg-white/80 px-4 py-5 backdrop-blur md:px-8">
            <div className="max-w-5xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Super Admin / Settings</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Branding</h1>
              <p className="mt-2 text-sm text-slate-500">Manage brands and logos</p>
            </div>
          </div>

          <div className="grid flex-1 gap-0 lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="min-w-0 border-r border-[#e2e6ef] bg-[#f7f8fb] px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-5xl">
                <div className="rounded-[1.75rem] border border-[#e2e6ef] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex h-12 w-full items-center gap-3 rounded-2xl border border-[#dfe5ee] bg-[#f7f9fc] px-4 text-sm text-slate-500 sm:max-w-md">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="m16 16 4 4" strokeLinecap="round" />
                      </svg>
                      <span>Search brands...</span>
                    </label>
                    <button type="button" className="rounded-full bg-[#2850f0] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1f47d8]">
                      Add brand
                    </button>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-[#e2e6ef] bg-white">
                    <div className="grid grid-cols-[0.9fr_1fr_1.3fr_1.4fr] gap-4 border-b border-[#e2e6ef] bg-[#f7f9fc] px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <span>Logo</span>
                      <span>Image</span>
                      <span>Name</span>
                      <span>Description</span>
                    </div>

                    <div className="divide-y divide-[#e2e6ef]">
                      {brands.map((brand) => (
                        <div key={brand.name} className="grid grid-cols-[0.9fr_1fr_1.3fr_1.4fr] items-center gap-4 px-5 py-4 text-sm">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white ${brand.accent}`}>
                              {brand.logo}
                            </div>
                            <span className="text-slate-900 md:hidden">{brand.name}</span>
                          </div>
                          <div className="flex h-11 w-24 items-center justify-center overflow-hidden rounded-2xl bg-[#f7f9fc]">
                            <Image src={brand.image} alt={brand.name} width={96} height={44} className="h-full w-full object-cover" />
                          </div>
                          <span className="font-semibold text-slate-900">{brand.name}</span>
                          <span className="line-clamp-1 text-slate-500">{brand.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <aside className="bg-white px-4 py-6 shadow-[0_-1px_0_rgba(15,23,42,0.04)] lg:border-l lg:border-[#e2e6ef] lg:px-6">
              <div className="mx-auto max-w-[380px]">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-semibold tracking-tight">Add Brand</h2>
                  <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-slate-700">
                    <span className="text-lg leading-none">&times;</span>
                  </button>
                </div>

                <div className="mt-6 space-y-5">
                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Name</span>
                    <input className="mt-2 h-12 w-full rounded-xl border border-[#e2e6ef] bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-300 focus:border-[#2850f0]" />
                  </label>

                  <label className="block">
                    <span className="text-sm font-semibold text-slate-700">Description</span>
                    <textarea className="mt-2 min-h-24 w-full rounded-xl border border-[#e2e6ef] bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-300 focus:border-[#2850f0]" />
                  </label>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">Logo</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-[#d5dbe6] bg-[#f7f9fc] text-slate-400">
                          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3.5" y="4" width="17" height="16" rx="2.2" />
                            <circle cx="9" cy="10" r="2" />
                            <path d="M4.5 17l4.5-4.5 3 3 2-2 5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <button type="button" className="rounded-xl border border-[#dfe5ee] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]">
                          Upload Logo
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">Brand Image</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex h-24 w-32 items-center justify-center rounded-2xl border border-dashed border-[#d5dbe6] bg-[#f7f9fc] text-slate-400">
                          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <rect x="3.5" y="4" width="17" height="16" rx="2.2" />
                            <circle cx="9" cy="10" r="2" />
                            <path d="M4.5 17l4.5-4.5 3 3 2-2 5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <button type="button" className="rounded-xl border border-[#dfe5ee] px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]">
                          Upload Brand Image
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button type="button" className="rounded-xl border border-[#dfe5ee] bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-[#f7f9fc]">
                      Cancel
                    </button>
                    <button type="button" className="rounded-xl bg-[#2850f0] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1f47d8]">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
