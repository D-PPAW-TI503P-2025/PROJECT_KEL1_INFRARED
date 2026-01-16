export default function Navbar({ children }: { children?: React.ReactNode }) {
    return (
        <header className="bg-slate-900/80 backdrop-blur border-b border-white/10 sticky top-0 z-50">
            <nav className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    IoT Monitor
                </div>
                <div className="flex items-center gap-6 text-slate-400">
                    {children}
                </div>
            </nav>
        </header>
    );
}
