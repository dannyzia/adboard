import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/HeroSection';
import BlogLandingSection from '../components/BlogLandingSection';
import { AdCard } from '../components/ads/AdCard';
import { useAds } from '../hooks/useAds';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
// Ad type not required here directly

export const HomePage: React.FC = () => {
  const { ads, loading, hasMore, totalAds, fetchAds, loadMore, reset } = useAds();
  const [sortBy, setSortBy] = React.useState<string>('newest');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  // initialize: fetch first page
  React.useEffect(() => {
    // reset and load first page
    reset();
    fetchAds(undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter changes from Navbar
  const handleFilterChange = React.useCallback((filters: any) => {
    reset();
    fetchAds(filters, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle search from HeroSection
  const handleHeroSearch = React.useCallback((query: string) => {
    reset();
    fetchAds({ search: query }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle category selection from HeroSection
  const handleCategorySelect = React.useCallback((category: string) => {
    reset();
    fetchAds({ category }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { lastElementRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  // Sort ads
  const sortedAds = React.useMemo(() => {
    const sorted = [...ads];
    switch(sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      default: // newest
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  }, [ads, sortBy]);

  return (
    <>
      <Navbar onFilterChange={handleFilterChange} />
      <HeroSection onSearch={handleHeroSearch} onCategorySelect={handleCategorySelect} />
      <BlogLandingSection />

      {/* Ads Section */}
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with Controls */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  🛍️ Browse All Ads
                </h2>
                <p className="text-gray-600">
                  {totalAds !== null ? `${totalAds.toLocaleString()} ads available` : `${ads.length.toLocaleString()} ads available`}
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* View Toggle */}
                <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-100 text-teal-700' : 'text-gray-500 hover:text-gray-700'}`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600"></div>
            </div>
          ) : sortedAds.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No ads found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? `grid 
              grid-cols-1
              xs:grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              2xl:grid-cols-8
              gap-6
            ` : 'flex flex-col gap-4'}>
                  {sortedAds.map((ad, idx) => {
                    const isLast = idx === sortedAds.length - 1;
                    return (
                      <div key={ad._id} ref={isLast ? lastElementRef : undefined}>
                        <AdCard ad={ad} onClick={(slugOrId: string) => { window.location.href = `/ad/${slugOrId}`; }} />
                      </div>
                    );
                  })}
            </div>
          )}

          {/* Load More Button - backup for infinite scroll */}
          {!loading && hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={() => loadMore()}
                className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-lg transition shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Load More Ads
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
