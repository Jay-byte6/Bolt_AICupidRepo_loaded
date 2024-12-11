import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routes = {
  '/': 'Home',
  '/personality-analysis': 'Personality Analysis',
  '/smart-matching': 'Smart Matching'
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex items-center space-x-2 text-gray-600 text-sm mb-6">
      <Link to="/" className="flex items-center hover:text-indigo-600">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      
      {pathnames.map((name, index) => {
        const routePath = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = routes[routePath as keyof typeof routes] || name;

        return (
          <React.Fragment key={routePath}>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="text-gray-800 font-medium">{displayName}</span>
            ) : (
              <Link
                to={routePath}
                className="hover:text-indigo-600"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;