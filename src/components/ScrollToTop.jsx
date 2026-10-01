import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// React Router keeps the scroll position when the page changes, so a new page
// opens wherever you were on the old one. This scrolls to the top on every
// new navigation, but leaves back/forward alone so the browser can return you
// to where you were.
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === 'POP') return; // back / forward button
    if (hash) return; // let #anchor links scroll to their target

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, search, hash, navigationType]);

  return null;
}
