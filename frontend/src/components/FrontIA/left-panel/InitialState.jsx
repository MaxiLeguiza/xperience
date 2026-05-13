export default function InitialState() {
    return (
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden px-8">

            {/* fondos */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.18),_transparent_28%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.14),_transparent_24%)]" />

            {/* contenido */}
            <div className="relative flex items-center">

                {/* X */}
                <span className="text-[12rem] md:text-[18rem] font-black text-orange-500 leading-none relative z-10">
                    X
                </span>
                {/* perience (pegado a la X) */}
                <div className="-ml-6 md:-ml-22 space-y-4 index-20 relative z-10">
                    <h1 className="text-4xl md:text-7xl font-black text-slate-100 tracking-tight">
                        PERIENCE
                    </h1>
                </div>
            </div>
        </div>
    );
}