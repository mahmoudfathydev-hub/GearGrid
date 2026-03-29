import Link from 'next/link';

export const FooterCopyright = () => {
    return (
        <div className="border-t border-gray-100 dark:border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} GearGrid. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
                <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Terms of Service</Link>
                <Link href="#" className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">Cookie Policy</Link>
            </div>
        </div>
    );
};
