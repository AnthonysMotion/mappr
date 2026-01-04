"use client"

export function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center text-white overflow-visible pb-32">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-4 relative z-10 pt-32">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.1]">
              Plan trips together.
              <br />
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Effortlessly.
              </span>
            </h1>
            <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              The collaborative workspace for travel planning. Pin locations, build timelines, and organize every detail with your travel companions in real-time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
