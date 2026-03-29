import React from 'react';
import { FooterLogo, FooterLinks, FooterContact, FooterCopyright } from './components';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-16 pb-8">
            <div className="container max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <FooterLogo />
                    <FooterLinks />
                    <FooterContact />
                </div>
                <FooterCopyright />
            </div>
        </footer>
    );
};

export default Footer;
