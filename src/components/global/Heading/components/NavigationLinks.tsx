import Link from 'next/link';

interface LinkItem {
  id: number;
  name: string;
  href: string;
}

interface NavigationLinksProps {
  links: LinkItem[];
  isMobile?: boolean;
}

export const NavigationLinks = ({ links, isMobile = false }: NavigationLinksProps) => {
  return (
    <nav 
      role="navigation"
      className={isMobile ? "space-y-1 sm:px-3" : "flex items-baseline space-x-4 ml-10"}
    >
      {links.map((link, index) => {
        const isActive = index === 0; 
        
        return (
          <Link
            key={link.id}
            href={link.href}
            className={`
              block px-3 py-2 rounded-md text-sm font-medium transition-colors
              hover:bg-gray-100 dark:hover:bg-white/10
              ${isActive 
                ? "text-gray-900 dark:text-white" 
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"}
              ${isMobile ? "text-base" : ""}
            `}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
};
