import { ReactNode } from "react";
import { NavigationLinks } from "./NavigationLinks";

interface Link {
  id: number;
  name: string;
  href: string;
}

interface MobileMenuProps {
  links: Link[];
  isOpen?: boolean;
  children?: ReactNode;
}

export const MobileMenu = ({ links, isOpen = false, children }: MobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800" id="mobile-menu" data-testid="mobile-menu">
      <NavigationLinks links={links} isMobile={true} />
      {children && (
        <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-800 px-5 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};
