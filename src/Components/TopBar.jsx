import { useLocation, useNavigate } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbsMap = {
    '/dashboard': ['Dashboard'],
    '/home': ['Home'],
    '/home/hero-section': ['Home', 'Hero Section'],
    '/home/product-category': ['Home', 'Product Category'],
    '/home/video-section': ['Home', 'Video Section'],
    '/home/clients': ['Home', 'Clients'],
    '/home/end-section': ['Home', 'End Section'],
    '/about/about': ['About', 'About Us'],
    '/about/about-hero': ['About', 'Intro Section'],
    '/about/mission': ['About', 'Mission'],
    '/about/vision': ['About', 'Vision'],
    '/about/particle': ['About', 'Particle'],
    '/about/client': ['About', 'Client'],
    '/about/testimonial': ['About', 'Testimonial'],
    '/settings': ['Settings'],
    '/pages': ['Pages'],
    '/section-pages': ['Section Pages'],
    '/cards-section': ['Cards Section'],
    '/project/project-category': ['Project', 'Project Category'],
    '/project/project': ['Project', 'Project'],
    '/form/contact': ['Form', 'Contact'],
    '/form/join': ['Form', 'Application'],
    '/solution': ['Solutions'],
    '/partner': ['Partners'],
    '/product': ['Products'],
    '/service': ['Services'],
    '/faq': ['Faqs'],
    '/connect': ['Platforms'],
    '/genericEnd-section': ['End Section'],
  };

  const breadcrumbs = breadcrumbsMap[location.pathname] || ['Dashboard'];

  const buildPath = (index) => {
    if (index === 0) return '/';
    const parts = breadcrumbs.slice(0, index + 1)
      .map(c => c.toLowerCase().replace(/ /g, '-'));
    return '/' + parts.join('/');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 transition-colors group"
          aria-label="Dashboard"
        >
          <Home className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </button>

        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const path = buildPath(index);

          return (
            <div key={index} className="flex items-center gap-2">
 <ChevronRight className="w-4 h-4 text-gray-300" />

              {!isLast ? (
                <button
                  onClick={() => navigate(path)}
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
                >
                  {crumb}
                </button>
              ) : (
                <span className="text-gray-900 text-sm font-semibold">
                  {crumb}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBar;
