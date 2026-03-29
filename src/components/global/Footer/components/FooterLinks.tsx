import Link from 'next/link';

export const FooterLinks = () => {
    return (
        <>
            <div>
                <h4 className="text-gray-900 dark:text-white font-bold mb-6">Quick Links</h4>
                <ul className="space-y-4">
                    <li><Link href="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Home</Link></li>
                    <li><Link href="/cars" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Inventory</Link></li>
                    <li><Link href="/services" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Services</Link></li>
                </ul>
            </div>

            <div>
                <h4 className="text-gray-900 dark:text-white font-bold mb-6">Support</h4>
                <ul className="space-y-4">
                    <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">FAQs</Link></li>
                    <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Contact Us</Link></li>
                    <li><Link href="#" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                </ul>
            </div>
        </>
    );
};
