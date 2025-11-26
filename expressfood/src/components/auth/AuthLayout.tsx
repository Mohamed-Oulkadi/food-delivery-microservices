import React from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    imageSrc?: string;
    imageAlt?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    title,
    subtitle,
    imageSrc = "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
    imageAlt = "Delicious food delivery"
}) => {
    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-12 xl:p-24 justify-center relative z-10">
                <div className="max-w-md mx-auto w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-12 group">
                        <div className="h-10 w-10 rounded-xl bg-[#FF6B00] flex items-center justify-center shadow-lg shadow-orange-200 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-2xl">E</span>
                        </div>
                        <span className="text-2xl font-bold text-slate-900 tracking-tight">
                            ExpressFood
                        </span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                            {title}
                        </h1>
                        <p className="text-slate-500 text-lg">
                            {subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>

            {/* Right Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="absolute inset-0 w-full h-full object-cover animate-ken-burns"
                    style={{ animation: 'ken-burns 20s ease-out infinite alternate' }}
                />

                {/* Overlay Content */}
                <div className="absolute bottom-0 left-0 right-0 p-12 z-20 text-white">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 max-w-lg">
                        <p className="text-2xl font-bold mb-2">
                            "The fastest delivery in town, delivered hot & fresh."
                        </p>
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <span className="text-sm font-medium ml-2">Trusted by 10k+ foodies</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes ken-burns {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.1); }
                }
            `}</style>
        </div>
    );
};
