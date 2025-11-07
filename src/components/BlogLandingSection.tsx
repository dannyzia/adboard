import React, { useEffect, useRef, useState } from 'react';
import { blogService } from '../services/blog.service';
import { Blog } from '../types';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../utils/helpers';

const BlogLandingSection: React.FC = () => {
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [loading, setLoading] = useState(true);
	const scrollerRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const load = async () => {
			try {
				const recent = await blogService.getRecentBlogs(12);
				setBlogs(recent);
			} catch (err) {
				console.error('Failed to load recent blogs', err);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

		if (loading) {
			return (
				<div className="py-8 bg-white">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
									<div className="flex gap-8 overflow-x-auto py-2">
										{[0,1,2,3].map((i) => (
											<div key={i} className="flex-shrink-0 w-72 bg-white rounded-lg shadow p-0">
												<div className="h-48 bg-gray-200 rounded-t-lg animate-pulse" />
									<div className="p-4">
										<div className="h-3 bg-gray-200 rounded w-24 mb-2 animate-pulse" />
										<div className="h-5 bg-gray-200 rounded w-full mb-2 animate-pulse" />
										<div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			);
		}

	return (
		<div className="py-12 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Section Heading */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-3xl font-bold text-gray-900 mb-2">
							📰 Latest Tips & Insights
						</h2>
						<p className="text-gray-600">
							Stay informed with our community articles and guides
						</p>
					</div>
					<button
						onClick={() => navigate('/blogs')}
						className="px-6 py-2 text-teal-600 hover:text-teal-700 font-semibold hover:underline"
					>
						View All →
					</button>
				</div>

			{/* horizontal scroller only - heading removed */}
				<div className="relative">
					<button
						aria-label="Scroll left"
						title="Scroll left"
						onClick={() => scrollerRef.current?.scrollBy({ left: -400, behavior: 'smooth' })}
						className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<button
						aria-label="Scroll right"
						title="Scroll right"
						onClick={() => scrollerRef.current?.scrollBy({ left: 400, behavior: 'smooth' })}
						className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
					>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>

								<div
									ref={scrollerRef}
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'ArrowLeft') scrollerRef.current?.scrollBy({ left: -400, behavior: 'smooth' });
										else if (e.key === 'ArrowRight') scrollerRef.current?.scrollBy({ left: 400, behavior: 'smooth' });
									}}
									className="flex gap-6 overflow-x-auto no-scrollbar py-2 snap-x snap-mandatory"
								>
									{blogs.map((b) => (
										<div key={b._id} onClick={() => navigate(`/blog/${b.slug}`)} className="flex-shrink-0 w-80 snap-start bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer transition-all transform hover:scale-105">
											<div className="h-48 overflow-hidden rounded-t-xl">
												{b.image?.url ? <img src={b.image.url} alt={b.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-teal-400 to-cyan-400" />}
											</div>
								<div className="p-5">
									<div className="flex items-center gap-2 text-xs text-teal-600 font-semibold mb-2">
										<span className="px-2 py-1 bg-teal-50 rounded">{b.category}</span>
										<span className="text-gray-400">•</span>
										<span className="text-gray-500">{formatDate(b.publishDate)}</span>
									</div>
									<h4 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">{b.title}</h4>
									<p className="text-sm text-gray-600 line-clamp-2 mb-3">{b.excerpt}</p>
									<div className="flex items-center justify-between text-xs text-gray-500">
										<span className="flex items-center gap-1">
											<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
											</svg>
											{b.views} views
										</span>
										<span className="text-teal-600 font-semibold hover:underline">Read more →</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default BlogLandingSection;
