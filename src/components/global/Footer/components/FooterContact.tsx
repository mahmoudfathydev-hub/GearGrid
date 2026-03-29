import { Mail, Phone, MapPin, Globe, Share2 } from 'lucide-react';

export const FooterContact = () => {
    return (
        <div className="space-y-4">
            <h4 className="text-gray-900 dark:text-white font-bold mb-6">Contact</h4>
            <div className="flex items-start gap-3 text-gray-500 dark:text-gray-400">
                <MapPin size={20} className="text-blue-600 mt-1 shrink-0" />
                <span>Smouha , Alexandria , Egypt</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-medium">
                <Phone size={20} className="text-blue-600 shrink-0" />
                <span>0120048181</span>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Mail size={20} className="text-blue-600 shrink-0" />
                <a href="mailto:mahmoudfathy.dev@gmail.com" className="hover:text-blue-600 transition-colors">mahmoudfathy.dev@gmail.com</a>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Globe size={20} className="text-blue-600 shrink-0" />
                <a href="https://mahmoud-fathy.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors underline underline-offset-4 decoration-blue-600">My Website</a>
            </div>
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <Share2 size={20} className="text-blue-600 shrink-0" />
                <a href="https://www.linkedin.com/in/mahmoudfathy-frontend" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">LinkedIn Profile</a>
            </div>
        </div>
    );
};
