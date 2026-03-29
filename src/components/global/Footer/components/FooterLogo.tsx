import Link from 'next/link';
import { Globe, Share2, MessageSquare } from 'lucide-react';

export const FooterLogo = () => {
    return (
        <div className="space-y-4">
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
                GEAR<span className="text-gray-900 dark:text-white">GRID</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                The ultimate destination for premium car enthusiasts. Buy, sell, and discover the finest automobiles in the world.
            </p>
            <div className="flex items-center gap-4">
                <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 transition-colors">
                    <Globe size={18} />
                </Link>
                <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 transition-colors">
                    <Share2 size={18} />
                </Link>
                <Link href="#" className="p-2 rounded-full bg-gray-50 dark:bg-gray-900 text-gray-400 hover:text-blue-600 transition-colors">
                    <MessageSquare size={18} />
                </Link>
            </div>
        </div>
    );
};
